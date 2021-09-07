import { RACE_ID, SIDE, ACTION_TYPE, weatherTable, WEATHER, ROLL, getPlayerType, STATUS, SITUATION } from '../constants.js';
import * as B from './BB2.js';
import type * as I from './Internal.js';
import { cellEq } from './Internal.js';
import he from 'he';
import { ensureKeyedList, ensureList, translateStringNumberList } from '../replay-utils.js';
import { all, first } from 'underscore';
import { distance } from 'chroma-js';
import type { replay } from '../stores.js';

function requireValue<T>(v: T | undefined, msg: string, obj: any): T {
    if (v === undefined) {
        throw { msg, obj };
    }
    return v;
}

class Replay {
    constructor(
        public unhandledSteps: B.ReplayStep[],
        public teams: I.ByTeam<Team> = { home: new Team(), away: new Team() },
        public stadium: I.Replay['stadium'] = {name: "N/A", type: ""},
        public drives: Drive[] = [],
        private foundUnhandledStep = false,
        public finalScore: I.ByTeam<number> = { home: 0, away: 0 },
        public metadata: I.Replay['metadata'] = {datePlayed: new Date()},
        public gameLength: number = 0,
        public fans: I.ByTeam<I.Roll> = { home: {dice: [], total: 0}, away: {dice: [], total: 0} },
        public initialWeather: WEATHER = WEATHER.Nice,
        public coinFlipWinner: I.Side = "home",
        public initialKickingTeam: I.Side = "home",
        public checkpoint: I.Checkpoint = {playerStates: new Map()},
    ) {
        this.unhandledSteps = [...this.unhandledSteps];
        this.gameLength = Math.max(16, ...this.unhandledSteps.flatMap(step => {
            if (!('BoardState' in step)) {
                return [];
            } else {
                return [
                    step.BoardState.ListTeams.TeamState[0].GameTurn || 0,
                    step.BoardState.ListTeams.TeamState[1].GameTurn || 0
                ];
            }
        }));
    }

    processUnorderedSteps() {
        // Handle un-ordered replay steps
        for (let step of this.unhandledSteps) {
            if ('RulesEventGameFinished' in step) {
                this.handleGameFinishedStep(step);
            } else if ('GameInfos' in step) {
                this.handleGameInfo(step);
            }
        }
    }

    processSteps() {
        this.processUnorderedSteps();
        while (!this.foundUnhandledStep && this.unhandledSteps.length > 0) {
            let step = this.unhandledSteps.shift()!;
            if ('RulesEventGameFinished' in step || 'GameInfos' in step) {
                // Handled as an unordered replay step
            } else if ('RulesEventAddInducementSkill' in step) {
                this.handleAddInducementSkillStep(step);
            } else if ('RulesEventSetUpAction' in step) {
                this.handleSetUpAction(step);
            } else if ('RulesEventSetUpConfiguration' in step) {
                this.handleSetUpConfiguration(step);
            } else if ('RulesEventSetGeneratedPersonnalities' in step) {
                // don't need to handle this
            } else if (
                'RulesEventApplyInducements' in step ||
                'RulesEventAddMercenary' in step ||
                'RulesEventAddInducement' in step ||
                'RulesEventInducementsInfos' in step
            ) {
                this.handleAddInducementStep(step);
            } else if (
                'BoardState' in step
            ) {
                this.handleGameTurnStep(step);
            } else {
                badStep(step);
            }
            if ('BoardState' in step) {
                this.captureCheckpoint(step.BoardState);
            }
        }
    }

    captureCheckpoint(boardState: B.BoardState) {
        let checkpoint = {
            playerStates: new Map(),
        };
        for (let team of boardState.ListTeams.TeamState) {
            for (let player of ensureKeyedList("PlayerState", team.ListPitchPlayers)) {
                checkpoint.playerStates.set(player.Id, convertPlayerState(team, player));
            }
        }
        this.checkpoint = checkpoint;
    }

    handleGameFinishedStep(step: B.GameFinishedStep) {
        this.finalScore.home = step.RulesEventGameFinished.MatchResult.Row.HomeScore || 0;
        this.finalScore.away = step.RulesEventGameFinished.MatchResult.Row.AwayScore || 0;
        this.metadata.datePlayed = new Date(step.RulesEventGameFinished.MatchResult.Row.Finished);
    }

    handleAddInducementStep(step: B.AddInducementStep) {
        if ('RulesEventAddMercenary' in step) {
            // We can pull mercenaries from board state.
            for (const merc of ensureList(step.RulesEventAddMercenary)) {
                const playerNumber = merc.MercenaryId;
                const side = convertSide(B.playerIdSide(playerNumber));
                const team = this.teams[side];
                const pitchPlayers = ensureKeyedList('PlayerState', step.BoardState.ListTeams.TeamState[side == 'home' ? 0 : 1].ListPitchPlayers);
                const pitchPlayer = pitchPlayers.find(p => p.Id = merc.MercenaryId);
                assert(pitchPlayer != undefined);
                const player: I.Player = convertPlayerDefinition(pitchPlayer);
                team.players.set(player.id.number, player)
                team.inducements.mercenaries.set(player.id.number, player);
            }
        }
        if ('RulesEventAddInducement' in step) {
            // We can pull inducements applied from the board state.
        }
        if ('RulesEventRemoveInducement' in step) {
            // We can pull inducements applied from the board
        }
        if ('RulesEventInducementInfos' in step) {
            // Don't bother listing what the available inducements were
        }
        if ('RulesEventApplyInducements' in step) {
            // Nothing to add to replay
        }
        if ('RulesEventWaitingRequest' in step) {
            // No replay changes
        }
    }

    handleAddInducementSkillStep(step: B.AddInducementSkillStep) {
        let player = step.RulesEventAddInducementSkill.MercenaryId;
        let side = convertSide(B.playerIdSide(player));
        let skill = step.RulesEventAddInducementSkill.SkillId;
        let team = this.teams[side];
        let merc = team.inducements.mercenaries.get(player);
        if (merc) {
            merc.skills.push(skill);
        } else {
            console.warn("Unable to find merc to add skills to", {step, replay: this, team});
        }
        team.players.get(player)!.skills.push(skill);
    }

    handleGameInfo(step: B.GameInfoStep) {
        this.stadium.name = he.decode(step.GameInfos.NameStadium.toString());
        this.stadium.type = step.GameInfos.Stadium;
        this.stadium.enhancement = step.GameInfos.StructStadium;

        for (const side of ['home', 'away'] as I.Side[]) {
            this.teams[side].coach = he.decode(ensureList(step.GameInfos.CoachesInfos.CoachInfos)[SIDE[side]].UserId.toString());

            let bb2Team = step.BoardState.ListTeams.TeamState[SIDE[side]];
            this.teams[side].race = bb2Team.Data.IdRace;
            this.teams[side].name = he.decode(bb2Team.Data.Name.toString());
            this.teams[side].logo = bb2Team.Data.Logo;

            this.teams[side].players = new Map(
                ensureKeyedList("PlayerState", bb2Team.ListPitchPlayers).map(p => [p.Id, convertPlayerDefinition(p)])
            );
        }

        this.metadata.league = step.GameInfos.RowLeague.Name && he.decode(step.GameInfos.RowLeague.Name.toString());
    }

    handleSetUpConfiguration(step: B.SetUpConfigurationStep) {
        const side = convertSide(step.RulesEventWaitingRequest == '' ? SIDE.home : step.RulesEventWaitingRequest.ConcernedTeam || SIDE.home);
        let currentDrive = this.lastDrive();
        if (currentDrive.setups == undefined) {
            currentDrive.setups = { first: side, home: [], away: [] };
        }
        let currentSetup = currentDrive.setups[side];

        let nextSetup = {
            checkpoint: this.checkpoint,
            movedPlayers: new Map(step.RulesEventSetUpConfiguration.ListPlayersPositions.PlayerPosition.map(pos => {
                return [pos.PlayerId || 0, convertCell(pos.Position)];
            }))
        }
        currentSetup.push(nextSetup);
    }

    handleSetUpAction(step: B.SetUpActionStep) {
        const fromCell = convertCell(step.RulesEventSetUpAction.PlayerPosition);
        const toCell = convertCell(step.RulesEventSetUpAction.NewPosition);
        const alsoMove = step.RulesEventSetUpAction.Substitute;
        const side = convertSide(step.RulesEventWaitingRequest == '' ? SIDE.home : step.RulesEventWaitingRequest.ConcernedTeam || SIDE.home);
        let currentDrive = this.lastDrive();
        if (currentDrive.setups == undefined) {
            currentDrive.setups = { first: side, home: [], away: [] };
        }
        let currentSetup = currentDrive.setups[side];
        let players: Map<I.PlayerNumber, I.PlayerState> = this.checkpoint.playerStates;

        const movedPlayer = [...players.entries()]
            .find(([_, state]) => state.pitchCell && cellEq(fromCell, state.pitchCell));

        console.assert(movedPlayer != undefined, "Couldn't find moved player", step, this);
        if (movedPlayer != undefined) {
            let movedPlayers = new Map([
                [movedPlayer[0], toCell]
            ]);
            if (alsoMove) {
                movedPlayers.set(alsoMove, fromCell);
            }
            let nextSetup = {
                checkpoint: this.checkpoint,
                movedPlayers
            }
            currentSetup.push(nextSetup);
        }
    }

    handleGameTurnStep(step: B.GameTurnStep) {
        if (
            step.RulesEventKickOffChoice
        ) {
            this.coinFlipWinner = convertSide(step.RulesEventKickOffChoice.ChosingTeam || 0);
            this.initialKickingTeam = convertSide(step.RulesEventKickOffChoice.KickOffTeam || 0);
        }
        if (
            step.RulesEventForcedDices
        ) {
            this.cantHandle(step, "Can't handle RulesEventForcedDices");
            return;
        }
        if (
            step.RulesEventCoachChoice
        ) {
            this.cantHandle(step, "Can't handle RulesEventCoachChoice");
            return;
        }
        if (
            step.RulesEventSpecialAction
        ) {
            this.cantHandle(step, "Can't handle RulesEventSpecialAction");
            return;
        }
        if (
            step.RulesEventKickOffEventCancelled
        ) {
            let drive = last(this.drives);
            if (drive === undefined) {
                drive = new Drive(this.checkpoint);
                this.drives.push(drive);
            }
            drive.kickoff.event = {
                dice: [step.RulesEventKickOffEventCancelled.EventCancelled],
                cancelled: true,
            };
        }
        if (
            step.RulesEventLoadGame
        ) {
            this.cantHandle(step, "Can't handle RulesEventLoadGame");
            return;
        }
        if (step.RulesEventWaitingRequest) {
            // Ignore this
        }
        if (step.RulesEventEndTurn) {
            if (step.RulesEventEndTurn.NewDrive) {
                this.drives.push(new Drive(this.checkpoint));
            }
        }
        if (step.RulesEventKickOffTable) {
            let drive = last(this.drives);
            if (drive === undefined) {
                drive = new Drive(this.checkpoint);
                this.drives.push(drive);
            }
            drive.kickoff.event = {
                dice: translateStringNumberList(step.RulesEventKickOffTable.ListDice),
                cancelled: false,
            }
        }
        if (step.RulesEventBoardAction) {
            let actions = ensureList(step.RulesEventBoardAction);
            let converters = actions.map(action => actionConverter(this, step, action));
            if (converters.some(converter => converter == undefined)) {
                this.cantHandle(step, "Not all action types can be converted");
                return
            }
            converters.forEach(converter => converter!());
        }
    }

    cantHandle(step: B.ReplayStep, reason?: string) {
        console.log("Couldn't handle step", { step, reason });
        this.unhandledSteps.unshift(step);
        this.foundUnhandledStep = true;
    }

    lastDrive(): Drive {
        let drive = last(this.drives);
        if (!drive) {
            drive = this.addDrive();
        }
        return drive;
    }

    addDrive(): Drive {
        let lastDrive = last(this.drives);
        let drive = new Drive(this.checkpoint);
        drive.initialScore = lastDrive && lastDrive.finalScore ? lastDrive.finalScore : { home: 0, away: 0 };
        this.drives.push(drive);
        return drive;
    }
}

function assert(condition: any, msg?: string): asserts condition {
    if (!condition) {
        throw new Error(msg);
    }
}

function actionConverter(replay: Replay, step: B.GameTurnStep, action: B.RulesEventBoardAction): undefined | (() => void) {
    if ('ActionType' in action) {
        switch (action.ActionType) {
            case ACTION_TYPE.FansNumber:
                return () => convertFansNumber(replay, action);
            case ACTION_TYPE.InitialWeather:
                return () => convertInitialWeather(replay, action);
            case ACTION_TYPE.KickoffTarget:
                return () => convertKickoffTarget(replay, action);
            case ACTION_TYPE.KickoffScatter:
                return () => convertKickoffScatter(replay, action);
            case ACTION_TYPE.TakeDamage:
                return () => convertTakeDamage(replay, action);
            case ACTION_TYPE.ActivatePlayer:
                return () => convertActivatePlayer(replay, step, action);
            default:
                return undefined;
        }
    } else {
        return undefined;
    }
}

function convertFansNumber(replay: Replay, action: B.FansAction): void {
    for (const fanRoll of ensureKeyedList("BoardActionResult", action.Results)) {
        const team = convertSide(fanRoll.CoachChoices.ConcernedTeam || 0);
        let dice = translateStringNumberList(fanRoll.CoachChoices.ListDices);
        replay.fans[team] = {
            dice,
            total: dice[0] + dice[1],
        };
    }
};

function convertInitialWeather(replay: Replay, action: B.WeatherAction): void {
    let result = ensureKeyedList("BoardActionResult", action.Results)[0];
    let dice = translateStringNumberList(result.CoachChoices.ListDices);
    replay.initialWeather = weatherTable(dice[0] + dice[1]);
}

function convertKickoffTarget(replay: Replay, action: B.KickoffAction): void {
    let drive = replay.lastDrive();
    drive.kickoff.target = convertCell(action.Order.CellTo.Cell);
}

function convertKickoffScatter(replay: Replay, action: B.ScatterAction): void {
    let drive = replay.lastDrive();
    if (drive.kickoff.scatters == undefined) {
        drive.kickoff.scatters = [];
    }
    for (const result of ensureKeyedList("BoardActionResult", action.Results)) {
        switch (result.RollType) {
            case ROLL.KickoffScatter:
                drive.kickoff.scatters.push(convertCell(action.Order.CellTo.Cell));
                break;
            case ROLL.ThrowIn:
                drive.kickoff.scatters.push(convertCell(action.Order.CellTo.Cell));
                break;
            case ROLL.TouchBack:
                if (result.IsOrderCompleted) {
                    drive.kickoff.scatters.push(convertCell(action.Order.CellTo.Cell));
                }
                break;
            case ROLL.KickoffGust:
                drive.kickoff.scatters.push(convertCell(action.Order.CellTo.Cell));
                break;
        }
    }
}

function convertTakeDamage(replay: Replay, action: B.TakeDamageAction): void {
    let drive = replay.lastDrive();
    let damage: I.Damage = {
        player: {
            side: playerNumberToSide(action.PlayerId || 0),
            number: action.PlayerId || 0,
        },
    };
    for (const result of ensureKeyedList("BoardActionResult", action.Results)) {
        switch (result.RollType) {
            case ROLL.Injury:
                damage.injury = convertDiceRollResult(result);
                break;
            case ROLL.Armor:
                damage.armor = convertDiceRollResult(result);
                break
            case ROLL.Casualty:
                damage.casualty = convertDiceRollResult(result);
                break
            case ROLL.Regeneration:
                damage.regeneration = convertDiceRollResult(result);
                break
            case ROLL.PileOnArmorRoll:
                if ('ListDices' in result.CoachChoices) {
                    assert('ListDices' in result);
                    damage.armor!.pileOn = convertDiceRollResult(result);
                }
                break
            case ROLL.PileOnInjuryRoll:
                if ('ListDices' in result.CoachChoices) {
                    assert('ListDices' in result);
                    damage.casualty!.pileOn = convertDiceRollResult(result);
                }
                break
            case ROLL.ChainsawArmor:
                damage.armor = convertDiceRollResult(result);
                break
            case ROLL.RaiseDead:
                damage.raiseDead = true;
                break
            default:
                badResult(result);
        }
    }

    if (drive.turns) {
    } else { // Damage from a rocks during kickoff
        if (drive.kickoff.rockDamage == undefined) {
            drive.kickoff.rockDamage = [];
        }
    }
}

function convertActivatePlayer(replay: Replay, step: B.GameTurnStep, action: B.ActivatePlayerAction) {
    let drive = replay.lastDrive();
    let turn = last(drive.turns);
    let playerNumber = action.PlayerId || 0;
    let playerSide = playerNumberToSide(playerNumber);
    let teamState = step.BoardState.ListTeams.TeamState[playerSide == 'home' ? 0 : 1];
    if (!turn || turn.side != playerSide || turn.number != teamState.GameTurn) {
        turn = new Turn(
            teamState.GameTurn || 0,
            playerSide,
            replay.checkpoint,
        )
        drive.turns.push(turn);
    }
    turn.activations.push(new Activation(
        {side: playerSide, number: playerNumber}, 
        replay.checkpoint
    ));
}

class Team {
    constructor(
        public players: Map<I.PlayerNumber, I.Player> = new Map(),
        public inducements: I.Inducements = { mercenaries: new Map() },
        public race: RACE_ID = RACE_ID.Human,
        public coach: string = "N/A",
        public name: string = "N/A",
        public logo: string = "",
    ) { }
}

class Drive {
    constructor(
        public checkpoint: I.Checkpoint,
        public wakeups: I.KickoffOrder<I.WakeupRoll[]> = {first: "home", home: [], away: []},
        public setups: I.KickoffOrder<I.SetupAction[]> = {first: "home", home: [], away: []},
        public kickoff: I.Drive['kickoff'] = {
            event: {dice: [], cancelled: false},
            target: {x: -1, y: -1},
            scatters: [],
        },
        public turns: Turn[] = [],
        public initialScore: I.ByTeam<number> = { home: 0, away: 0 },
        public finalScore: I.ByTeam<number> = { home: 0, away: 0 },
    ) {
    }
}

class Turn {
    constructor(
        public number: number,
        public side: keyof I.ByTeam<any>,
        public checkpoint: I.Checkpoint,
        public activations: Activation[] = [],
        public startWizard?: I.WizardRoll,
        public endWizard?: I.WizardRoll,
    ) {}
}

class Activation {
    constructor(
        public playerId: I.PlayerId,
        public checkpoint: I.Checkpoint,
        public test?: I.ActivationTest,
        public action: I.Action = {
            actionType: ACTION_TYPE.Move,
            player: {number: 0, side: "home"},
            path: [],
        },
        public actionSteps: I.ActionStep[] = [],
    ) {}
}

export function convertCell(c: B.Cell): I.Cell {
    if (!c) {
        return { x: 0, y: 0 };
    } else {
        return {
            x: c.x || 0,
            y: c.y || 0
        };
    }
}

export function convertReplay(incoming: B.Replay): I.Replay {
    let outgoing: Replay = new Replay(incoming.ReplayStep);
    outgoing.metadata.filename = incoming.filename;
    outgoing.metadata.url = incoming.url;
    outgoing.processSteps();
    console.log("Finished converting", { outgoing });
    return outgoing;
}

function badResult(result: never): never
function badResult(result: B.BaseResult) {
    console.error({ msg: 'Unhandled result', result });
}

function badStep(step: never): never
function badStep(step: B.ReplayStep) {
    console.error({ msg: 'Unhandled step', step });
}

function last<T>(xs: T[]): T | undefined {
    if (xs.length == 0) {
        return undefined;
    } else {
        return xs[xs.length - 1];
    }
}

export function convertSide(s: SIDE): I.Side {
    return s == SIDE.home ? 'home' : 'away';
}

export function playerNumberToSide(n: I.PlayerNumber): I.Side {
    return n < 30 ? 'home' : 'away';
}

export function convertPlayerDefinition(p: B.PitchPlayer): I.Player {
    return {
        id: {
            number: p.Id,
            side: playerNumberToSide(p.Id),
        },
        skills: translateStringNumberList(p.Data.ListSkills),
        type: getPlayerType(p.Data.IdPlayerTypes),
        name: he.decode(p.Data.Name.toString()),
        stats: {
            ma: p.Data.Ma,
            st: p.Data.St,
            av: p.Data.Av,
            ag: p.Data.Ag,
        }
    };
}

export function convertPlayerState(t: B.TeamState, p: B.PitchPlayer): I.PlayerState {
    return {
        usedSkills: translateStringNumberList(p.ListUsedSkills),
        canAct: p.CanAct == 1,
        status: p.Status || STATUS.standing,
        disabled: p.Disabled == 1,
        blitzer: t.BlitzerId == p.Id,
        situation: p.Situation || SITUATION.Active,
        casualties: translateStringNumberList(p.ListCasualties),
        pitchCell: convertCell(p.Cell)
    };
}

function convertDiceModifier(modifier: B.DiceModifier): I.DiceModifier {
    let result: I.DiceModifier = {};
    if (modifier.Cell) {
        result.cell = convertCell(modifier.Cell);
    }
    if (modifier.Skill && modifier.Skill >= 0) {
        result.skill = modifier.Skill;
    }
    if (modifier.Type) {
        result.type = modifier.Type;
    }
    if (modifier.Value) {
        result.value = modifier.Value;
    }
    return result;
}

function convertDiceRollResult<R>(result: B.DiceRollResult<R, B.Skills, B.Cells>): I.DiceRoll {
    let roll: I.DiceRoll = {
        dice: translateStringNumberList(result.CoachChoices.ListDices),
        modifiers: ensureKeyedList("DiceModifier", result.ListModifiers).map(modifier => convertDiceModifier(modifier))
    };
    if ('Requirement' in result) {
        roll.target = result.Requirement;
    }
    return roll;
}