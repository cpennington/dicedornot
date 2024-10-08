import {
  SKILL_NAME,
  SKILL,
  SITUATION,
  ROLL_STATUS,
  RESULT_TYPE,
  SUB_RESULT_TYPE,
  ACTION_TYPE,
  BLOCK,
  BLOCK_DIE,
  PLAYER_TVS,
  SKILL_CATEGORY,
  getPlayerType,
  STAR_NAMES,
  KICKOFF_RESULT,
  KICKOFF_RESULT_NAMES,
  ROLL,
  PLAYER_TYPE,
  SIDE,
  PlayerTV
} from './constants.js';
import type {
  ReplayPosition,
} from './replay-utils.js';
import {
  SingleValue,
  SimpleDistribution,
  SumDistribution,
  MinDistribution,
  MaxDistribution,
  Distribution
} from './distribution.js';
import * as BB2 from './replay/BB2.js';
import type * as Internal from './replay/Internal.js';
import { convertCell, convertSide, playerNumberToSide } from './replay/BB2toInternal.js';
import _ from 'underscore';
import he from 'he';
import type { DeepReadonly } from "ts-essentials";

export interface DataPoint {
  iteration: number,
  turn: number,
  activeTeamId: Internal.Side | undefined,
  activeTeamName: string | undefined,
  teamId: Internal.Side | undefined,
  teamName: string | undefined,
  outcomeValue: number,
  type: POINT,
  expectedValue: number,
  netValue: number,
  actionIndex: number | undefined,
}

export interface ActualPoint extends DataPoint {
  player: string,
  playerSkills: string[],
  actionName: string,
  outcomes: number[],
  weights: number[],
  description: string,
  valueDescription: string,
  improbability: number,
  dice: string[],
}

// TODO: Switch over to using dice.js for better clarity

function sample<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function decayedHalfTurns(halfTurns: number): number {
  return halfTurns;
  var decayedTurns = 0;
  for (var turn = 0; turn < halfTurns; turn++) {
    decayedTurns += 0.9 ** turn;
  }
  return decayedTurns;
}

function manhattan(a: Internal.Cell, b: Internal.Cell): number {
  return Math.max(
    Math.abs((a.x) - (b.x)),
    Math.abs((a.y) - (b.y))
  );
}

function ballPositionValue(team: Team, cell: Internal.Cell): SingleValue {
  var distToGoal;
  if (team.id == 'home') {
    distToGoal = 25 - (cell.x);
  } else {
    distToGoal = (cell.x);
  }
  var distValue;
  if (distToGoal == 0) {
    distValue = 1;
  } else {
    distValue = .5 * (0.85 ** (distToGoal - 1));
  }
  return new SingleValue(`${distToGoal} to goal`, distValue);
}

enum POINT {
  actual = 'actual',
  simulated = 'simulated',
}


function unhandledReplayPosition(position: never): never;
function unhandledReplayPosition(position: ReplayPosition) {
  console.error(`Unhandled replay position ${JSON.stringify(position)}`);
}

export class Player {
  constructor(
    public readonly team: Team,
    public readonly name: string,
    public readonly id: number,
    public readonly playerType: PLAYER_TYPE,
    public readonly cell: Internal.Cell,
    public readonly situation: SITUATION | undefined,
    public readonly canAct: boolean,
    public readonly skills: SKILL[],
    public readonly isBallCarrier: boolean,
    public readonly isBlizter: boolean,
    public readonly stats: {
      readonly ma: number,
      readonly st: number,
      readonly ag: number,
      readonly av: number,
    },
  ) {
  }

  static fromBB2(team: Team, playerState: BB2.PitchPlayer, initialBoard: BB2.BoardState, finalBoard: BB2.BoardState) {
    const cell = convertCell(playerState.Cell);
    const name = he.decode(playerState.Data.Name.toString().replace(/\[colour='[0-9a-f]{8}'\]/i, '').toString())
    return new Player(
      team,
      STAR_NAMES[name] || name,
      playerState.Id,
      getPlayerType(playerState.Data.IdPlayerTypes),
      cell,
      playerState.Situation,
      playerState.CanAct == 1 && playerState.Situation === SITUATION.Active,
      BB2.translateStringNumberList(playerState.Data.ListSkills) || [],
      manhattan(convertCell(initialBoard.Ball.Cell), cell) == 0 && initialBoard.Ball.IsHeld == 1,
      finalBoard.ListTeams.TeamState[team.id == 'home' ? 0 : 1].BlitzerId == playerState.Id,
      {
        ma: playerState.Data.Ma,
        av: playerState.Data.Av,
        st: playerState.Data.St,
        ag: playerState.Data.Ag,
      });
  }

  get skillNames() {
    return this.skills.map((skill) => SKILL_NAME[skill]);
  }

  get tv() {
    let playerTV = PLAYER_TVS[this.playerType];
    if (playerTV.star === true) {
      return playerTV.tv;
    } else {
      let { tv, normals, doubles, free } = playerTV;
      this.skills.forEach(skill => {
        if (free.includes(skill)) {
          return;
        } else if (doubles.includes(SKILL_CATEGORY[skill])) {
          tv += 30;
        } else if (normals.includes(SKILL_CATEGORY[skill])) {
          tv += 20;
        } else if ([SKILL.IncreaseMovement, SKILL.IncreaseArmour].includes(skill)) {
          tv += 30;
        } else if (skill == SKILL.IncreaseAgility) {
          tv += 40;
        } else if (skill == SKILL.IncreaseStrength) {
          tv += 50;
        }
      })
      return tv;
    }
  }
}

class Team {
  public players: Player[];

  constructor(
    public name: string,
    public id: Internal.Side,
    public fame: number,
    public babes: number,
    public turn: number,
    public blitzerId?: number,
  ) {
    this.players = [];
  }

  static fromInternal(team: Internal.Team, teamState: Internal.TeamState, playerStates: Internal.PlayerStates): Team {
    return new this(
      team.name,
      team.id,
      teamState.fame || 0,
      teamState.babes || 0,
      teamState.turn,
      Object.values(playerStates).find(player => player.blitzer && player.id.side == team.id)?.id.number,
    )
  }

  static fromBB2(teamState: BB2.TeamState, initialBoard: BB2.BoardState, finalBoard: BB2.BoardState): Team {
    const side = convertSide(teamState.Data.TeamId || SIDE.home);
    const team = new this(
      he.decode(teamState.Data.Name.toString()),
      side,
      teamState.Fame || 0,
      teamState.Babes || 0,
      teamState.GameTurn || 0,
      teamState.BlitzerId
    );
    team.players = BB2.ensureKeyedList('PlayerState', teamState.ListPitchPlayers).map(
      (playerState) => Player.fromBB2(team, playerState, initialBoard, finalBoard)
    );
    return team;
  }

  get shortName() {
    return this.name
      .split(/\s+/)
      .map((word) => word[0])
      .join('');
  }
}

interface BoardStateArgs {
  teams: Team[],
  activeTeamId: number,
  ballCell: "" | Internal.Cell
}

class GameState {
  ballCell: Internal.Cell;
  teams: Internal.ByTeam<Team>;
  activeTeam: Internal.Side;
  turn: number;

  constructor({ teams, activeTeam, ballCell }:
    { teams: Internal.ByTeam<Team>, activeTeam: Internal.Side, ballCell: Internal.Cell }
  ) {
    this.teams = teams;
    this.activeTeam = activeTeam;
    this.turn = this.teams[this.activeTeam].turn;
    this.ballCell = ballCell || { x: 0, y: 0 };
  }

  static fromInternal(gameState: Internal.GameState, gameDefinition: Internal.GameDefinition): GameState {
    const teams = {
      home: Team.fromInternal(gameDefinition.teams.home, gameState.teams.home, gameState.players),
      away: Team.fromInternal(gameDefinition.teams.away, gameState.teams.away, gameState.players),
    };
    let ballCell: Internal.Cell;
    if ('heldBy' in gameState.ball) {
      const team = teams[gameState.ball.heldBy.side];
      const player = team.players[gameState.ball.heldBy.number];
      ballCell = player.cell;
    } else {
      ballCell = gameState.ball.pitchCell;
    }
    const args = {
      teams,
      activeTeam: gameState.activeTeam,
      ballCell,
    }
    return new this(args);
  }

  static fromBB2(initialBoardState: BB2.BoardState, finalBoardState: BB2.BoardState): GameState {
    let teams = {
      home: Team.fromBB2(initialBoardState.ListTeams.TeamState[0], initialBoardState, finalBoardState),
      away: Team.fromBB2(initialBoardState.ListTeams.TeamState[1], initialBoardState, finalBoardState),
    };
    let activeTeam = convertSide(finalBoardState.ActiveTeam || 0);
    let args = {
      teams,
      activeTeam,
      ballCell: convertCell(initialBoardState.Ball.Cell),
    }
    return new this(args);
  }

  playerById(playerId: BB2.PlayerId): Player | undefined {
    const side = playerNumberToSide(playerId);
    for (var player of this.teams[side].players) {
      if (player.id === playerId) {
        return player;
      }
    }
    return undefined;
  }

  playerAtPosition(cell: Internal.Cell): Player | undefined {
    for (var team of (['home', 'away'] as Internal.Side[])) {
      for (var player of this.teams[team].players) {
        if ((player.cell.x) === (cell.x) && (player.cell.y) === (cell.y)) {
          return player;
        }
      }
    }
    return undefined;
  }
}

type ActionXML = {
  replay: Internal.Replay,
  initialBoard: BB2.BoardState,
  positionIdx: number,
  resultPosition: BB2.BoardActionResultPosition
} | {
  replay: Internal.Replay,
  initialBoard: BB2.BoardState,
  positionIdx: number,
  kickoffPosition: BB2.KickoffPosition,
} | {
  replay: Internal.Replay,
  initialBoard: BB2.BoardState,
  positionIdx: number,
  setupPosition: BB2.SetupPosition,
};

type RollArgs = ConstructorParameters<typeof Action>[0] & {
  rollStatus?: ROLL_STATUS,
  rollType: ROLL,
  dice: number[],
  isReroll: boolean,
}

export class Action {
  _futurePlayerValue: Record<number, number | Distribution>;
  actionType: ACTION_TYPE;
  activePlayer: Player | undefined;
  armorRollCache: Record<string, ArmorRoll>;
  dependent?: { action: Action, index: number };
  dependentActions: (Action | Roll)[];
  endIndex: number | undefined = undefined;
  onTeamValues: Record<number, Distribution>;
  resultType?: RESULT_TYPE;
  actionIndex?: number;
  actions?: Action[];
  skillsInEffect: readonly BB2.SkillInfo[];
  startIndex: number;
  subResultType?: SUB_RESULT_TYPE;
  gameState: GameState;

  get actionName() { return `Unnamed Action ${this.constructor.name}`; }
  get handledSkills(): SKILL[] { return []; }
  get diceSeparator() { return ', '; }
  get hideDependents() { return false; }
  get dependentConditions(): DependentCondition[] { return []; }
  get unhandledSkills(): BB2.SkillInfo[] {
    let unhandledSkills = this.skillsInEffect.filter(
      (skillInfo: BB2.SkillInfo) => !this.handledSkills.includes(skillInfo.SkillId)
    );
    Object.defineProperty(this, 'unhandledSkills', { value: unhandledSkills });
    return this.unhandledSkills;
  }

  constructor(attrs: {
    skillsInEffect?: DeepReadonly<BB2.SkillInfo[]>,
    activePlayer?: Player,
    actionType: ACTION_TYPE,
    resultType?: RESULT_TYPE,
    subResultType?: SUB_RESULT_TYPE,
    startIndex: number,
    rolls?: Action[],
    gameState: GameState,
  }) {
    this.skillsInEffect = attrs.skillsInEffect || [];
    this.activePlayer = attrs.activePlayer;
    this.actionType = attrs.actionType;
    this.resultType = attrs.resultType;
    this.subResultType = attrs.subResultType;
    this.startIndex = attrs.startIndex;
    this.actions = attrs.rolls;
    this.gameState = attrs.gameState;

    this.onTeamValues = {};
    this.armorRollCache = {};
    this.dependentActions = [];
    this._futurePlayerValue = {};

    console.assert(
      !this.unhandledSkills || this.unhandledSkills.length == 0,
      'Unhandled skills for roll',
      {
        roll: this,
        skills:
          this.unhandledSkills &&
          this.unhandledSkills.map(
            (skillinfo) => SKILL_NAME[skillinfo.SkillId]
          ),
        actionName: this.actionName
      }
    );
  }

  static fromBB2(xml: ActionXML): Action {
    return new this(this.actionArgsFromBB2(xml));
  }

  static actionArgsFromBB2(xml: ActionXML): ConstructorParameters<typeof Action>[0] {
    assert('resultPosition' in xml);
    let { result } = xml.resultPosition;
    let action = xml.resultPosition.action;
    let step = xml.resultPosition.step;

    const gameState = GameState.fromBB2(
      xml.initialBoard,
      'BoardState' in step ? step.BoardState : xml.initialBoard
    );
    const activePlayerId = 'PlayerId' in action ? action.PlayerId : undefined;

    const skillsInEffect = 'CoachChoices' in result ? BB2.ensureKeyedList(
      'SkillInfo',
      result.CoachChoices.ListSkills
    ) : [];

    return {
      gameState,
      skillsInEffect,
      activePlayer: activePlayerId !== undefined ? gameState.playerById(activePlayerId) || undefined : undefined,
      actionType: 'ActionType' in action ? action.ActionType : ACTION_TYPE.Move,
      resultType: result.ResultType,
      subResultType: result.SubResultType,
      startIndex: xml.positionIdx,
    };
  }

  get ignore() {
    return false;
  }

  static fromReplayPosition(replay: Internal.Replay, initialBoard: BB2.BoardState | undefined, positionIdx: number, position: ReplayPosition): (Action | UnknownAction | undefined) {
    switch (position.type) {
      case 'bb2.setup': {
        if (initialBoard) {
          return SetupAction.fromBB2({
            replay,
            initialBoard,
            positionIdx,
            setupPosition: position,
          });
        }
        break;
      }
      case 'bb2.kickoff': {
        if (initialBoard) {
          return Roll.fromKickoffEvent(replay, initialBoard, positionIdx, position);
        }
        break;
      }
      case 'bb2.actionResult': {
        if (initialBoard) {
          let action = Action.fromBoardActionResult(replay, initialBoard, positionIdx, position);
          if (action) {
            return action;
          }
        }
        break;
      }
      case 'setupAction': {
        const action = SetupAction.fromInternal(replay.gameDefinition, position, positionIdx);
        return action;
      }
    }
    return undefined;
  }

  static fromBoardActionResult(
    replay: Internal.Replay,
    initialBoard: BB2.BoardState,
    positionIdx: number,
    position: BB2.BoardActionResultPosition,
  ): Action | UnknownAction | undefined {
    let boardActionResult = position.result;
    let action = position.action;
    if (boardActionResult && !('RollType' in boardActionResult)) {
      if (!('ActionType' in action)) {
        return MoveAction.fromBB2({
          replay,
          initialBoard,
          positionIdx,
          resultPosition: position,
        });
      } else {
        return undefined;
      }
    }

    let rollClass = ROLL_TYPES[boardActionResult.RollType];
    if (rollClass === undefined) {
      return undefined;
    } else if (!rollClass) {
      return new UnknownAction(`Unknown Roll ${boardActionResult.RollType}`, position.step);
    } else if (typeof rollClass === "string") {
      return new UnknownAction(rollClass, position.step);
    } else {
      return rollClass.fromBB2({
        replay,
        initialBoard,
        positionIdx,
        resultPosition: position,
      });
    }
  }

  onTeamValue(player: Player): Distribution {
    // The fraction of the teams on-pitch players that this player represents.
    return (
      this.onTeamValues[player.id] || (
        this.onTeamValues[player.id] = (
          this.playerValue(player).divide(
            this.teamValue(
              player.team,
              [SITUATION.Active, SITUATION.Reserves, SITUATION.KO],
              player
            ).named('Players on Team')
            // Scale players by the difference between a full team scoring 1.5 points per game
            // and pitch-cleared opponent scoring 16 points per game
          ).product(6.5 / 32).named(player.name)
        )
      )
    );
  }

  get nextAction(): (Roll | Action | undefined) {
    if (this.dependentActions.length > 0) {
      return this.dependentActions[0];
    } else if (this.dependent) {
      return this.dependent.action.dependentActions[this.dependent.index + 1];
    }
    return undefined;
  }

  get improbability() {
    return 0;
  }

  get turn() {
    return this.gameState.turn;
  }

  get jointDescription() {
    return [this.description].concat(this.dependentActions.map(roll => roll.shortDescription || roll.description)).join(" \u2192 ");
  }

  get description() {
    if (this.activePlayer) {
      var activeSkills =
        this.activePlayer.skills.length > 0
          ? ` (${this.activePlayer.skillNames.join(', ')})`
          : '';
      return `${this.actionName}: [${this.activePlayer.team.shortName}] ${this.activePlayer.name}${activeSkills}`;
    } else {
      return `${this.actionName}`;
    }
  }

  get shortDescription() {
    if (this.activePlayer) {
      return `${this.actionName}: ${this.activePlayer.name}`;
    } else {
      return `${this.actionName}`;
    }
  }

  isDependentAction(action: Action): boolean {
    return this.dependentConditions.some(cond => cond(this, action));
  }

  value(dice: number[] = [], expected: boolean = false): Distribution | number {
    throw 'value must be defined by subclass';
  }
  get expectedValue() {
    return this.possibleOutcomes.expectedValue;
  }
  get _possibleOutcomes(): Distribution {
    throw `_possibleOutcomes must be defined by subclass ${this.constructor.name}`;
  }

  get possibleOutcomes(): Distribution {
    Object.defineProperty(this, 'possibleOutcomes', { value: this._possibleOutcomes });
    return this.possibleOutcomes;
  }

  get actualValue() {
    const outcomeValue = this.value();
    if (!(outcomeValue instanceof Distribution)) {
      return new SingleValue(this.actionName, outcomeValue);
    } else {
      return outcomeValue;
    }
  }

  get valueWithDependents() {
    return this.actualValue.add(...this.dependentActions.map(roll => roll.actualValue));
  }

  get actual(): ActualPoint {
    var dataPoint = this.dataPoint(-1, POINT.actual);
    return {
      ...dataPoint,
      turn: this.turn,
      player: (this.activePlayer && this.activePlayer.name) || '',
      playerSkills:
        (this.activePlayer &&
          this.activePlayer.skills.map((skill) => SKILL_NAME[skill])) ||
        [],
      actionName: this.actionName,
      outcomes: this.possibleOutcomes.flat.map(outcome => outcome.value),
      weights: this.possibleOutcomes.flat.map(outcome => outcome.weight),
      description: this.jointDescription,
      valueDescription: `${this.valueWithDependents.valueString} ${this.possibleOutcomes.valueString}`,
      improbability: this.dependentActions.reduce((acc, roll) => acc + roll.improbability, this.improbability),
      dice: [],
    };
  }

  simulated(iteration: number) {
    return this.dataPoint(
      iteration,
      POINT.simulated,
    );
  }
  dataPoint(iteration: number, type: POINT): DataPoint {
    let outcomeValue: number;
    switch (type) {
      case POINT.actual:
        outcomeValue = this.valueWithDependents.singularValue;
        break;
      case POINT.simulated:
        outcomeValue = this.possibleOutcomes.sample();
        break;
    }
    return {
      iteration: iteration,
      turn: this.turn,
      activeTeamId: this.gameState.activeTeam,
      activeTeamName: this.gameState.teams[this.gameState.activeTeam].name,
      teamId: this.activePlayer
        ? this.activePlayer.team.id
        : this.gameState.activeTeam,
      teamName: this.activePlayer
        ? this.activePlayer.team.name
        : this.gameState.teams[this.gameState.activeTeam].name,
      outcomeValue,
      type,
      expectedValue: this.expectedValue,
      netValue: outcomeValue - this.expectedValue,
      actionIndex: this.actionIndex,
    };
  }

  onActiveTeam(player: Player) {
    return player.team.id === this.gameState.activeTeam;
  }

  playerValue(player: Player) {
    let ballCell = this.gameState.ballCell;
    if (!ballCell || (ballCell.x) < 0 || (ballCell.y) < 0) {
      return this.rawPlayerValue(player);
    }
    var distanceToBall = manhattan(ballCell, player.cell);
    if (distanceToBall == 0) {
      return this.rawPlayerValue(player).product(new SingleValue("On Ball", 2)).named(`PV(${player.name})`);
    } else if (distanceToBall == 1) {
      return this.rawPlayerValue(player).product(new SingleValue("By Ball", 1.5)).named(`PV(${player.name})`);
    } else {
      return this.rawPlayerValue(player);
    }
  }

  rawPlayerValue(player: Player) {
    return new SingleValue(`TV(${player.name})`, player.tv);
  }

  teamValue(team: Team, situations: SITUATION[], includingPlayer: Player) {
    return new SumDistribution(
      team.players
        .filter((player) => situations.includes(player.situation || SITUATION.Active) || player.id == includingPlayer.id)
        .map((player) => this.playerValue(player)),
      `TV(${team.name})`
    );
  }

  get halfTurnsInGame() {
    // Return the number of half-turns left in the game
    if (!this.gameState) {
      return 32;
    }
    var halfTurnsByTeam = [this.gameState.teams.home, this.gameState.teams.away].map((team) => {
      if ((this.turn || 0) <= 16) {
        return 16 - team.turn;
      } else {
        return 24 - team.turn;
      }
    });
    const halfTurns = halfTurnsByTeam[0] + halfTurnsByTeam[1];
    console.assert(halfTurns >= 0);
    return halfTurns;
  }

  get halfTurnsInHalf(): number {
    if (!this.gameState) {
      return 16;
    }
    // Return the number of half-turns left in the game
    var halfTurnsByTeam = [this.gameState.teams.home, this.gameState.teams.away].map((team) => {
      if ((this.turn || 0) <= 8) {
        return 8 - team.turn;
      } else if ((this.turn || 0) <= 16) {
        return 16 - team.turn;
      } else {
        return 24 - team.turn;
      }
    });
    const halfTurns = halfTurnsByTeam[0] + halfTurnsByTeam[1] + 1;
    console.assert(halfTurns >= 0);
    return halfTurns;
  }

  stunTurns(player: Player) {
    return Math.min(
      this.onActiveTeam(player) ? 4 : 3,
      this.halfTurnsInHalf
    );
  }

  kdTurns(player: Player) {
    return Math.min(
      this.onActiveTeam(player) ? 2 : 1,
      this.halfTurnsInHalf
    );
  }

  armorRoll(player: Player, damageBonusActive?: boolean) {
    damageBonusActive = damageBonusActive || false;
    let key = `${player.id}-${damageBonusActive}`;
    return (
      this.armorRollCache[key] ||
      (this.armorRollCache[key] = new ArmorRoll({
        gameState: this.gameState,
        activePlayer: player,
        modifier: damageBonusActive ? 1 : 0,
        damageBonusActive,
        isFoul: false,
        canPileOn: false,
        isPileOn: false,
        target: 0,
        skillsInEffect: [],
        rollStatus: ROLL_STATUS.NoStatus,
        rollType: ROLL.Armor,
        dice: [1, 1],
        actionType: ACTION_TYPE.TakeDamage,
        resultType: RESULT_TYPE.Passed,
        subResultType: SUB_RESULT_TYPE.ArmorNoBreak,
        startIndex: this.startIndex,
        isReroll: false,
        rolls: this.actions,
      }))
    );
  }

  knockdownValue(player: Player, includeExpectedValues = false, damageBonusActive = false) {
    // Return the number of half-turns the player is unavailable times the
    // fraction of current team value it represents
    const playerValue = this.onTeamValue(player);
    var turnsMissing = this.kdTurns(player);
    var tdTurnsMissing = decayedHalfTurns(turnsMissing);
    var scalingFactors = [new SingleValue(`TDT(${turnsMissing / 2})`, tdTurnsMissing)];
    if (this.onActiveTeam(player)) {
      scalingFactors.push(new SingleValue('On Active Team', -1));
    }
    var result = playerValue.product(...scalingFactors).named(`KD(${player.name})`);
    if (includeExpectedValues) {
      result = result.add(this.armorRoll(player, damageBonusActive).possibleOutcomes.named('Armor Roll'));
    }
    return result;
  }

  stunValue(player: Player) {
    // Return the number of half-turns the player is unavailable times the
    // fraction of current team value it represents
    var playerValue = this.onTeamValue(player);
    var turnsMissing = this.stunTurns(player);
    var tdTurnsMissing = decayedHalfTurns(turnsMissing);
    var scalingFactors = [new SingleValue(`TDT(${turnsMissing / 2})`, tdTurnsMissing)];
    if (this.onActiveTeam(player)) {
      scalingFactors.push(new SingleValue('On Active Team', -1));
    }

    return playerValue.product(...scalingFactors).named(`STUN(${player.name})`);
  }

  koValue(player: Player) {
    const playerValue =
      this.onTeamValue(player)
    let turnsInGame = this.halfTurnsInGame;
    let turnsInHalf = this.halfTurnsInHalf;
    let wakeUpChance = (3 + player.team.babes) / 6;
    let wakeUpTurns = wakeUpChance * turnsInHalf + (1 - wakeUpChance) * turnsInGame;
    let stunTurns = this.stunTurns(player);
    let turns = wakeUpTurns - stunTurns;
    let decayedTurns = decayedHalfTurns(wakeUpTurns) - decayedHalfTurns(stunTurns);

    let scalingFactors = [
      new SingleValue(
        `TDT(${turns})`,
        decayedTurns
      )
    ];
    if (this.onActiveTeam(player)) {
      scalingFactors.push(new SingleValue('On Active Team', -1));
    }

    return playerValue.product(...scalingFactors).named(`KO(${player.name})`);
  }

  casValue(player: Player) {
    const gameValue = this.onTeamValue(player).product(
      new SingleValue(`TDT(${this.halfTurnsInGame / 2})`, decayedHalfTurns(this.halfTurnsInGame))
    );
    const playerValue = gameValue.named(`PV(${player.name})`);

    var scalingFactors = [];
    if (this.onActiveTeam(player)) {
      scalingFactors.push(new SingleValue('On Active Team', -1));
    }
    return playerValue.product(...scalingFactors).subtract(this.stunValue(player)).named(`CAS(${player.name})`);
  }

  get dependentMoveValues(): Distribution | undefined {
    const dependentMoves = this.dependentActions.filter(
      roll => roll instanceof MoveAction
    );
    if (dependentMoves.length > 0) {
      return new SumDistribution(
        dependentMoves.map(roll => roll.value()),
        "Following Moves"
      );
    } else {
      return undefined;
    }
  }

  get unactivatedPlayers(): Player[] {
    let unactivatedPlayers = this.gameState.activeTeam ? this.gameState.teams[this.gameState.activeTeam].players.filter((player) => player.canAct) : [];
    Object.defineProperty(this, 'unactivatedPlayers', {
      value: unactivatedPlayers
    });
    return this.unactivatedPlayers;
  }

  futurePlayerValue(player: Player): number | Distribution {
    let cachedValue = this._futurePlayerValue[player.id];
    if (cachedValue) {
      return cachedValue;
    }

    let futureActions = (this.actions || []).filter(
      roll => (
        this.startIndex < roll.startIndex &&
        roll.activePlayer &&
        roll.activePlayer.id == player.id &&
        roll.turn == this.turn
      )
    );

    let result;
    if (futureActions.length) {
      result = futureActions.reduce((sum, roll) => sum + roll.expectedValue, 0);
    } else {
      result = this.onTeamValue(player).expectedValue;
    }
    this._futurePlayerValue[player.id] = result;
    return new SingleValue(`Remaining Turn ${this.turn} value for ${player.name}`, result);
  }

  get turnoverValue(): Distribution {
    // futurePlayerValue == EV of all further player actions in the turn, or an estimate if the player didn't get to act
    const playerValues = this.unactivatedPlayers.map(player => this.futurePlayerValue(player));
    var value;
    if (playerValues.length > 0) {
      value = new SumDistribution(playerValues).named('Unactivated FPV').product(-1).named('Turnover');
    } else {
      value = new SingleValue("No Active Players", 0);
    }
    Object.defineProperty(this, 'turnoverValue', { value: value });
    return this.turnoverValue;
  }

  get rerollValue() {
    return new SingleValue("Reroll", 0);
  }
}

export class Roll extends Action {
  dice: number[];
  isReroll: boolean;
  rollStatus?: ROLL_STATUS;
  rollType: ROLL;

  constructor(attrs: RollArgs) {
    super(attrs);
    this.rollStatus = attrs.rollStatus;
    this.rollType = attrs.rollType;
    this.dice = attrs.dice;
    this.isReroll = attrs.isReroll;
  }

  static fromBB2(xml: ActionXML): Roll {
    return new this(this.rollArgsFromBB2(xml));
  }
  static rollArgsFromBB2(xml: ActionXML): RollArgs {
    assert('resultPosition' in xml);
    let { result } = xml.resultPosition;
    if (!('RollType' in result)) {
      throw new Error("Unable to create a Roll from an action with no RollType");
    }
    let dice: number[];
    if ('ListDices' in result.CoachChoices && result.CoachChoices.ListDices) {
      dice = this.dice(result.CoachChoices.ListDices);
    } else {
      dice = [];
    }
    return {
      ...super.actionArgsFromBB2(xml),
      dice,
      rollStatus: 'RollStatus' in result ? result.RollStatus : undefined,
      rollType: result.RollType,
      isReroll: 'RollStatus' in result && ([
        ROLL_STATUS.RerollTaken,
        ROLL_STATUS.RerollWithSkill,
        ROLL_STATUS.RerollWithSkillChoice,
        ROLL_STATUS.RerollWithFailedOutcome
      ] as (ROLL_STATUS | undefined)[]).includes(result.RollStatus),
    };
  }

  get actual(): ActualPoint {
    return {
      ...super.actual,
      dice: this.dice.map(face => face.toString()),
    }
  }

  get actualValue() {
    const outcomeValue = this.value(this.dice);
    if (!(outcomeValue instanceof Distribution)) {
      return new SingleValue(this.actionName, outcomeValue);
    } else {
      return outcomeValue;
    }
  }

  get description() {
    if (this.activePlayer) {
      var activeSkills =
        this.activePlayer.skills.length > 0
          ? ` (${this.activePlayer.skillNames.join(', ')})`
          : '';
      return `${this.actionName}: [${this.activePlayer.team.shortName}] ${this.activePlayer.name}${activeSkills} - ${this.dice.join(this.diceSeparator)}`;
    } else {
      return `${this.actionName}: ${this.dice.join(this.diceSeparator)}`;
    }
  }

  get shortDescription() {
    if (this.activePlayer) {
      return `${this.actionName}: ${this.activePlayer.name} - ${this.dice.join(this.diceSeparator)}`;
    } else {
      return `${this.actionName}: ${this.dice.join(this.diceSeparator)}`;
    }
  }

  simulateDice() {
    throw 'simulateDice must be defined by subclass';
  }

  get ignore() {
    if (this.rollStatus == ROLL_STATUS.RerollNotTaken) {
      return true; // Didn't take an offered reroll, so ignore this roll in favor of the previous one
    }

    if (this.dice.length == 0) {
      return true;
    }

    return super.ignore;
  }

  static dice(listDices: BB2.Dices): number[] {
    return BB2.translateStringNumberList(listDices);
  }

  static fromKickoffEvent(
    replay: Internal.Replay,
    initialBoard: BB2.BoardState,
    positionIdx: number,
    position: BB2.KickoffPosition,
  ): (Action | UnknownAction | undefined) {
    return KickoffRoll.fromBB2({
      replay,
      initialBoard,
      positionIdx,
      kickoffPosition: position,
    });
  }

  static fromKickoffEventMessage(
    replay: Internal.Replay,
    initialBoard: BB2.BoardState,
    positionIdx: number,
    position: BB2.KickoffMessagePosition,
  ) {
    let dice = BB2.translateStringNumberList(position.kickoff.ListDice);
    let diceSum: KICKOFF_RESULT = dice[0] + dice[1];
    let rollClass = KICKOFF_RESULT_TYPES[diceSum];
    if (typeof rollClass === 'string') {
      return new UnknownAction(rollClass, position.step);
    } else if (position.kickoff.EventResults) {
      let eventClass: typeof KickoffEventRoll = rollClass;
      return eventClass.fromBB2({
        initialBoard,
        positionIdx,
        kickoffPosition: {
          ...position,
          type: 'bb2.kickoff',
        },
        messageData: position.kickoffMessage,
      });
    }
  }
}


type DependentCondition = (roll: Action, dependent: Action) => boolean;

function pushOrFollow(roll: Action, dependent: Action): boolean {
  return [PushChoice, FollowUpChoice].some(type => dependent instanceof type);
}

function nonFoulDamage(roll: Action, dependent: Action) {
  if (![ArmorRoll, InjuryRoll, CasualtyRoll].some(rollType => dependent instanceof rollType)) {
    return false;
  }
  return (
    !(dependent as ArmorRoll | InjuryRoll | CasualtyRoll).isFoul
  );
}

function foulDamage(roll: Action, dependent: Action) {
  let thisIsFoul = (roll instanceof InjuryRoll || roll instanceof ArmorRoll || roll instanceof CasualtyRoll) && roll.isFoul;
  let dependentIsFoul = ((dependent instanceof InjuryRoll || dependent instanceof ArmorRoll || dependent instanceof CasualtyRoll) && dependent.isFoul);
  let dependentIsFoulPenalty = dependent instanceof FoulPenaltyRoll;

  return thisIsFoul && (
    (dependentIsFoul && dependent.activePlayer?.id == roll.activePlayer?.id) || dependentIsFoulPenalty
  );
}

function reroll(roll: Action | Roll, dependent: Action | Roll) {
  return (
    'rollType' in dependent && 'rollType' in roll && dependent.rollType === roll.rollType &&
    ([
      ROLL_STATUS.RerollTaken,
      ROLL_STATUS.RerollWithSkill,
      ROLL_STATUS.RerollWithSkillChoice,
      ROLL_STATUS.RerollWithFailedOutcome
    ] as (ROLL_STATUS | undefined)[]).includes(
      dependent.rollStatus
    )
  );
}

function sameTeamMove(roll: Action, dependent: Action) {
  return (
    dependent instanceof MoveAction && roll.gameState.activeTeam == dependent.gameState.activeTeam
  )
}

function setup(roll: Action, dependent: Action) {
  return (
    dependent instanceof SetupAction
  )
}

function samePlayerMove(roll: Action, dependent: Action) {
  return (
    dependent instanceof MoveAction && roll.activePlayer?.id == dependent.activePlayer?.id
  )
}

function catchOrInterception(roll: Action, dependent: Action) {
  return dependent instanceof CatchRoll || dependent instanceof InterceptionRoll;
}

interface BlockRollArgs extends RollArgs {
  activePlayer: Player,
  isRedDice: boolean,
  attacker: Player | undefined,
  defender: Player | undefined,
  isBlitz: boolean,
}

export class BlockRoll extends Roll {
  activePlayer: Player;
  isRedDice: boolean;
  attacker: Player | undefined;
  defender: Player | undefined;
  isBlitz: boolean;
  get actionName() { return "Block"; }
  get handledSkills(): SKILL[] {
    return [
      SKILL.Tackle,
      SKILL.Dodge,
      SKILL.Block,
      SKILL.Guard,
      SKILL.Horns,
      SKILL.StandFirm,
      SKILL.Wrestle,
      SKILL.TakeRoot
    ]
  };
  get diceSeparator() { return '/'; }
  get dependentConditions(): DependentCondition[] { return [pushOrFollow, nonFoulDamage, reroll, samePlayerMove]; }

  constructor(attrs: BlockRollArgs) {
    super(attrs);
    this.dice = attrs.dice;
    this.activePlayer = attrs.activePlayer;
    this.isRedDice = attrs.isRedDice;
    this.attacker = attrs.attacker;
    this.defender = attrs.defender;
    this.isBlitz = attrs.isBlitz;
    console.assert(
      this.attacker != undefined && this.defender != undefined,
      "Block Roll was missing attacker or defender",
      this
    )
  }

  static fromBB2(xml: ActionXML): BlockRoll {
    return new this(this.blockArgsFromBB2(xml));
  }

  static blockArgsFromBB2(xml: ActionXML): BlockRollArgs {
    assert('resultPosition' in xml);
    let { result } = xml.resultPosition;
    let args = super.rollArgsFromBB2(xml);
    let isRedDice = false;
    if ('Requirement' in result) {
      isRedDice = (result.Requirement || 0) < 0;
    }
    let defender = (args.gameState.playerAtPosition(
      convertCell(BB2.ensureKeyedList('Cell', xml.resultPosition.action.Order.CellTo)[0])
    ));
    return {
      ...args,
      dice: args.dice.slice(0, args.dice.length / 2),
      activePlayer: args.activePlayer!,
      isRedDice,
      attacker: args.activePlayer,
      defender,
      isBlitz: args.activePlayer != undefined && args.activePlayer.isBlizter,
    }
  }

  get description() {
    if (this.attacker == undefined || this.defender == undefined) {
      return "Block Roll missing attacker or defender";
    }
    var uphill = this.isRedDice ? ' uphill' : '';
    var attackerSkills =
      this.attacker.skills.length > 0
        ? ` (${this.attacker.skillNames.join(', ')})`
        : '';
    var defenderSkills =
      this.defender && this.defender.skills.length > 0
        ? ` (${this.defender.skillNames.join(', ')})`
        : '';
    return `${this.actionName}: [${this.activePlayer.team.shortName}] ${this.activePlayer.name
      }${attackerSkills} against ${this.defender.name
      }${defenderSkills} - ${this.dice.map(val => BLOCK_DIE[val]).join(this.diceSeparator)}${uphill}`;
  }

  get shortDescription() {
    return `${this.actionName}: ${this.activePlayer.name} - ${this.dice.map(val => BLOCK_DIE[val]).join(this.diceSeparator)}`;
  }

  get ignore() {
    // Block dice have dice repeated for the coaches selection, resulttype is missing for the second one
    if (this.resultType != RESULT_TYPE.FailTeamRR) {
      return true;
    }
    if (this.subResultType == SUB_RESULT_TYPE.Fend) {
      // Opponent picking whether to activate fend
      return true;
    }
    if (this.subResultType == SUB_RESULT_TYPE.ChoiceUseDodgeTackle) {
      // Opponent picking whether to activate tackle
      return true;
    }

    return super.ignore;
  }

  dieValue(result: BLOCK, expected: boolean): Distribution {
    const attacker = this.attacker;
    const defender = this.defender;
    if (attacker == undefined || defender == undefined) {
      return new SingleValue("Block Roll missing attacker or defender", 0);
    }
    var attackerSkills = attacker.skills;
    var defenderSkills = defender.skills;

    switch (result) {
      case BLOCK.AttackerDown:
        return this.knockdownValue(attacker, expected, defenderSkills.includes(SKILL.MightyBlow)).add(
          this.turnoverValue,
        );
      case BLOCK.BothDown:

        const aBlock = attackerSkills.includes(SKILL.Block);
        const dBlock = defenderSkills.includes(SKILL.Block);

        var aOptions = [];
        if (attackerSkills.includes(SKILL.Wrestle)) {
          const wrestleDown = this.knockdownValue(defender, false).add(
            this.knockdownValue(attacker, false)
          );
          aOptions.push(wrestleDown);
        }
        if (attackerSkills.includes(SKILL.Juggernaut) && this.isBlitz) {
          const push = this.knockdownValue(
            defender, false
          ).product(
            new SingleValue('Push', 0.33)
          ).named(
            `Push(${defender.name})`
          ).add(expected ? this.dependentMoveValues : undefined);
          aOptions.push(push);
        }
        var dOptions = [];
        if (defenderSkills.includes(SKILL.Wrestle)) {
          const wrestleDown = this.knockdownValue(defender, false).add(
            this.knockdownValue(attacker, false)
          );
          dOptions.push(wrestleDown);
        }

        var base;
        if (aBlock && dBlock) {
          const blockBlock = new SingleValue('Block/Block', 0).add(expected ? this.dependentMoveValues : undefined);
          base = blockBlock;
        } else if (aBlock) {
          const defDown = this.knockdownValue(defender, expected, attackerSkills.includes(SKILL.MightyBlow)).add(expected ? this.dependentMoveValues : undefined);
          base = defDown;
        } else if (dBlock) {
          const attDown = this.knockdownValue(attacker, expected, defenderSkills.includes(SKILL.MightyBlow));
          base = attDown;
        } else {
          const bothDown = this.knockdownValue(defender, expected, attackerSkills.includes(SKILL.MightyBlow)).add(
            this.knockdownValue(attacker, expected, defenderSkills.includes(SKILL.MightyBlow)),
            this.turnoverValue
          );
          base = bothDown;
        }

        return base.min(...dOptions).max(...aOptions);
      case BLOCK.Push:
        return (
          defenderSkills.includes(SKILL.StandFirm)
            ? new SingleValue('Stand Firm', 0)
            : this.knockdownValue(defender, false).product(new SingleValue('Push', 0.33)).named(`Push(${defender.name})`)
        ).add(expected ? this.dependentMoveValues : 0);
      case BLOCK.DefenderStumbles:
        if (
          defenderSkills.includes(SKILL.Dodge) &&
          !attackerSkills.includes(SKILL.Tackle)
        ) {
          return (
            defenderSkills.includes(SKILL.StandFirm)
              ? new SingleValue('Stand Firm', 0)
              : this.knockdownValue(defender, false).product(new SingleValue('Push', 0.33)).named(`Push(${defender.name})`)
          ).add(expected ? this.dependentMoveValues : undefined);
        } else {
          return this.knockdownValue(defender, expected, attackerSkills.includes(SKILL.MightyBlow)).add(expected ? this.dependentMoveValues : undefined);
        }
      case BLOCK.DefenderDown:
        return this.knockdownValue(defender, expected, attackerSkills.includes(SKILL.MightyBlow)).add(expected ? this.dependentMoveValues : undefined);
    }
  }

  value(dice: number[], expected: boolean): Distribution {
    if (
      this.dependentActions.length > 0 &&
      'rollType' in this.dependentActions[0] &&
      this.dependentActions[0].rollType == this.rollType &&
      this.dependentActions[0].rollStatus == ROLL_STATUS.RerollTaken
    ) {
      return this.rerollValue;
    }
    var possibilities = dice
      .filter((value, index, self) => self.indexOf(value) === index)
      .map((die) => this.dieValue(BLOCK_DIE[die], expected));
    if (possibilities.length == 1) {
      return possibilities[0];
    } else if (this.isRedDice) {
      var [first, ...rest] = possibilities;
      return first.min(...rest);
    } else {
      var [first, ...rest] = possibilities;
      return first.max(...rest);
    }
  }

  get improbability() {
    if (this.attacker == undefined || this.defender == undefined) {
      return 0;
    }
    let bothDownSafe = this.attacker.skills.includes(SKILL.Block) || this.attacker.skills.includes(SKILL.Wrestle);
    let unsafeFaces = [BLOCK.AttackerDown, BLOCK.BothDown];
    if (bothDownSafe) {
      unsafeFaces = [BLOCK.AttackerDown];
    }
    var pass, passChance;
    if (this.isRedDice) {
      pass = !this.dice.some(face => unsafeFaces.includes(BLOCK_DIE[face]));
      passChance = 1 - ((1 - ((6 - unsafeFaces.length) / 6)) ** this.dice.length);
    } else {
      pass = !this.dice.every(face => unsafeFaces.includes(BLOCK_DIE[face]));
      passChance = ((6 - unsafeFaces.length) / 6) ** this.dice.length;
    }
    return (pass ? 1 : 0) - passChance;
  }

  get _possibleOutcomes() {
    var value;
    const blockDie = new SimpleDistribution([
      { name: BLOCK.Push, weight: 1 / 3, value: this.dieValue(BLOCK.Push, true) },
      { name: BLOCK.AttackerDown, weight: 1 / 6, value: this.dieValue(BLOCK.AttackerDown, true) },
      { name: BLOCK.DefenderDown, weight: 1 / 6, value: this.dieValue(BLOCK.DefenderDown, true) },
      { name: BLOCK.DefenderStumbles, weight: 1 / 6, value: this.dieValue(BLOCK.DefenderStumbles, true) },
      { name: BLOCK.BothDown, weight: 1 / 6, value: this.dieValue(BLOCK.BothDown, true) },
    ])
    if (this.dice.length == 1) {
      value = blockDie;
    } else if (this.isRedDice) {
      value = new MinDistribution(new Array(this.dice.length).fill(blockDie));
    } else {
      value = new MaxDistribution(new Array(this.dice.length).fill(blockDie));
    }
    return value;
  }

  simulateDice() {
    return this.dice.map(() =>
      sample([
        BLOCK.AttackerDown,
        BLOCK.BothDown,
        BLOCK.Push,
        BLOCK.Push,
        BLOCK.DefenderStumbles,
        BLOCK.DefenderDown
      ])
    );
  }
}

class FansRoll extends Roll {
  get actionName() { return "Fans"; }
  // TODO: Need to capture both teams rolls, because result is about comparison.
}

interface ModifiedD6SumRollArgs extends RollArgs {
  target: number,
  modifier: number,
}


export class ModifiedD6SumRoll extends Roll {
  target: number;
  modifier: number;
  get computedTarget() { return 0; }
  get computedModifier() { return 0; }
  get numDice() { return 1 };
  get diceSeparator() { return '+' }
  get rerollSkill(): undefined | SKILL { return undefined; }
  get rerollCancelSkill(): undefined | SKILL { return undefined; }
  get dependentConditions(): DependentCondition[] { return [reroll, samePlayerMove]; }

  constructor(args: ModifiedD6SumRollArgs) {
    super(args);
    this.target = args.target;
    this.modifier = args.modifier;

    console.assert(
      !this.computedTarget ||
      !this.target ||
      this.computedTarget == this.target,
      "Computed target (%d) doesn't equal target from replay XML (%d)",
      this.computedTarget,
      this.target,
      this
    );
    console.assert(
      this.computedModifier === undefined ||
      this.modifier === undefined ||
      this.computedModifier == this.modifier,
      "Computed modifier (%d) doesn't equal modifier from replay XML (%d)",
      this.computedModifier,
      this.modifier,
      this
    );
    console.assert(
      this.dice === undefined || this.numDice == this.dice.length,
      'Mismatch in number of dice (%d) and expected number of dice (%d)',
      this.dice && this.dice.length,
      this.numDice,
      this
    );
  }

  static fromBB2(xml: ActionXML): ModifiedD6SumRoll {
    return new this(this.d6RollArgsFromBB2(xml));
  }

  static d6RollArgsFromBB2(xml: ActionXML): ModifiedD6SumRollArgs {
    assert('resultPosition' in xml);
    let { result } = xml.resultPosition;
    let superArgs = super.rollArgsFromBB2(xml);
    return {
      ...superArgs,
      activePlayer: superArgs.activePlayer!,
      modifier: (
        'ListModifiers' in result ?
          BB2.ensureKeyedList("DiceModifier", result.ListModifiers) : []
      ).map((value: BB2.DiceModifier) => (value.Value || 0))
        .reduce((a, b) => a + b, 0) || 0,
      target: ('Requirement' in result && result.Requirement) || 0,
    }
  }

  get description() {
    if (this.activePlayer) {
      var activeSkills =
        this.activePlayer.skills.length > 0
          ? ` (${this.activePlayer.skillNames})`
          : '';
      return `${this.actionName}: [${this.activePlayer.team.shortName}] ${this.activePlayer.name}${activeSkills} - ${this.dice} (${this.modifiedTarget})`;
    } else {
      return `${this.actionName}: ${this.dice} (${this.modifiedTarget})`;
    }
  }

  get shortDescription() {
    if (this.activePlayer) {
      return `${this.actionName}: ${this.activePlayer.name} - ${this.dice.reduce((a, b) => a + b)} (${this.modifiedTarget})`;
    } else {
      return `${this.actionName}: ${this.dice.reduce((a, b) => a + b)} (${this.modifiedTarget})`
    }
  }

  get actual() {
    return Object.assign(super.actual, {
      target: this.modifiedTarget
    });
  }
  get modifiedTarget() {
    var target =
      (this.target || this.computedTarget) -
      (this.modifier || this.computedModifier || 0);
    if (this.numDice == 1) {
      return Math.min(6, Math.max(2, target));
    } else {
      return target;
    }
  }

  get improbability() {
    let { pass, fail } = this.diceSums.reduce((acc, sum) => {
      if (sum >= this.modifiedTarget) {
        acc.pass += 1;
      } else {
        acc.fail += 1;
      }
      return acc;
    }, { pass: 0, fail: 0 });
    let passChance = pass / (pass + fail);
    let passed = this.dice.reduce((a, b) => a + b) >= this.modifiedTarget;
    return (passed ? 1 : 0) - passChance;
  }

  get diceSums() {
    var diceSums = [0];
    for (var die = 0; die < this.numDice; die++) {
      var newSums = [];
      for (var face = 1; face <= 6; face++) {
        for (const sum of diceSums) {
          newSums.push(sum + face);
        }
      }
      diceSums = newSums;
    }
    diceSums.sort((a, b) => a - b);
    Object.defineProperty(this, 'diceSums', { value: diceSums });
    return diceSums;
  }

  value(dice: number[], expected: boolean): Distribution {
    let rollTotal = dice.reduce((a, b) => a + b, 0);
    if (rollTotal >= this.modifiedTarget) {
      return this.passValue(expected, rollTotal, this.modifiedTarget).add(expected ? this.dependentMoveValues : undefined);
    } else if (
      this.nextAction &&
      this.nextAction.constructor == this.constructor &&
      'isReroll' in this.nextAction &&
      this.nextAction.isReroll
    ) {
      return new SingleValue(`Rerolled ${this.actionName}`, this.rerollValue);
    } else {
      return this.failValue(expected, rollTotal, this.modifiedTarget);
    }
  }
  get _possibleOutcomes() {
    var sumsByOutcome = this.diceSums.reduce((acc: { min: number, max: number, count: number, value: Distribution }[], sum) => {
      let value;
      if (sum >= this.modifiedTarget) {
        value = this.passValue(true, sum, this.modifiedTarget).add(this.dependentMoveValues);
      } else {
        value = this.hasSkillReroll ? this.reroll.possibleOutcomes : this.failValue(true, sum, this.modifiedTarget)
      }
      if (acc.length == 0) {
        acc.push({
          min: sum,
          max: sum,
          count: 1,
          value
        })
      } else {
        var lastValue = acc[acc.length - 1];
        if (lastValue.value.valueOf() == value.valueOf()) {
          if (sum == lastValue.min - 1) {
            lastValue.min = sum;
            lastValue.count += 1;
          } else if (sum == lastValue.max + 1) {
            lastValue.max = sum;
            lastValue.count += 1;
          } else if (sum >= lastValue.min && sum <= lastValue.max) {
            lastValue.count += 1;
          } else {
            acc.push({
              min: sum,
              max: sum,
              count: 1,
              value
            })
          }
        } else {
          acc.push({
            min: sum,
            max: sum,
            count: 1,
            value
          })
        }
      }
      return acc;
    }, []);

    var outcomes = sumsByOutcome.map(outcome => {
      return {
        name: outcome.min === outcome.max ? outcome.min.toString() : `${outcome.min}-${outcome.max}`,
        value: outcome.value,
        weight: outcome.count / this.diceSums.length
      }
    });
    return new SimpleDistribution(outcomes);
  }
  get reroll(): ModifiedD6SumRoll {
    const reroll = new (this.constructor as any)({
      ...this,
      rollStatus: ROLL_STATUS.RerollWithSkill
    });
    Object.defineProperty(this, 'reroll', { value: reroll });
    return this.reroll;

  }
  get hasSkillReroll() {
    return this.rerollSkill && this.activePlayer && this.activePlayer.skills.includes(this.rerollSkill) &&
      (this.rerollCancelSkill && !this.skillsInEffect.map(info => info.SkillId).includes(this.rerollCancelSkill)) &&
      !([ROLL_STATUS.RerollWithSkill, ROLL_STATUS.RerollTaken] as (ROLL_STATUS | undefined)[]).includes(this.rollStatus);
  }
  simulateDice() {
    return this.dice.map(() => sample([1, 2, 3, 4, 5, 6]));
  }
  passValue(expected: boolean, rollTotal: number, modifiedTarget: number): Distribution {
    return new SingleValue("Pass", 0);
  }
  failValue(expected: boolean, rollTotal: number, modifiedTarget: number): Distribution {
    return new SingleValue("Fail", 0);
  }
}

class PlayerD6Roll extends ModifiedD6SumRoll {
  activePlayer: Player;

  constructor(args: ModifiedD6SumRollArgs) {
    super(args);
    this.activePlayer = args.activePlayer!;
  }
}

class PickupRoll extends ModifiedD6SumRoll {
  get actionName() { return "Pickup"; }
  get rerollSkill(): undefined | SKILL { return SKILL.SureHands; }
  get handledSkills(): SKILL[] { return [SKILL.SureHands, SKILL.BigHand, SKILL.ExtraArms] };
  failValue(expected: boolean, rollTotal: number, modifiedTarget: number) {
    return this.turnoverValue;
  }
}

class BoneHeadRoll extends PlayerD6Roll {
  get actionName() { return "Bone Head"; }
  get handledSkills(): SKILL[] { return [SKILL.BoneHead] };
  get dependentConditions(): DependentCondition[] { return [reroll, samePlayerMove]; }
  failValue(expected: boolean, rollTotal: number, modifiedTarget: number) {
    return this.knockdownValue(this.activePlayer, false);
  }
}

class ReallyStupidRoll extends PlayerD6Roll {
  get actionName() { return "Really Stupid"; }
  get handledSkills(): SKILL[] { return [SKILL.ReallyStupid] };
  get dependentConditions(): DependentCondition[] { return [reroll, samePlayerMove]; }
  failValue(expected: boolean, rollTotal: number, modifiedTarget: number) {
    return this.knockdownValue(this.activePlayer, false);
  }
}

class FoulAppearanceRoll extends PlayerD6Roll {
  get actionName() { return "Foul Appearance"; }
  get handledSkills(): SKILL[] { return [SKILL.FoulAppearance] };
  get dependentConditions(): DependentCondition[] { return [reroll, samePlayerMove]; }
  failValue() {
    return this.onTeamValue(this.activePlayer).product(-1);
  }
}

class ArmorRoll extends PlayerD6Roll {
  foulingPlayer?: Player;
  pilingOnPlayer?: Player;
  canPileOn: boolean;
  isFoul: boolean;
  isPileOn: boolean;
  injuryRollCache: Map<string, InjuryRoll>;
  damageBonusActive: boolean;

  get numDice() { return 2; }
  get handledSkills(): SKILL[] { return [SKILL.Claw, SKILL.MightyBlow, SKILL.DirtyPlayer, SKILL.PilingOn] };
  get dependentConditions(): DependentCondition[] { return [foulDamage]; }

  constructor(attrs: ConstructorParameters<typeof PlayerD6Roll>[0] & {
    foulingPlayer?: Player,
    pilingOnPlayer?: Player,
    canPileOn: boolean,
    isFoul: boolean,
    isPileOn: boolean,
    damageBonusActive: boolean,
  }) {
    super(attrs);
    this.canPileOn = attrs.canPileOn;
    this.isFoul = attrs.isFoul;
    this.isPileOn = attrs.isPileOn;
    this.pilingOnPlayer = attrs.pilingOnPlayer;
    this.foulingPlayer = attrs.foulingPlayer;
    this.damageBonusActive = attrs.damageBonusActive;
    this.injuryRollCache = new Map();
  }

  static fromBB2(xml: ActionXML): ArmorRoll {
    return new this(this.armorArgsFromBB2(xml));
  }

  static armorArgsFromBB2(xml: ActionXML): ConstructorParameters<typeof ArmorRoll>[0] {
    assert('resultPosition' in xml);
    let { result, action, resultIdx, step } = xml.resultPosition;
    const args = super.d6RollArgsFromBB2(xml);

    let canPileOn = false, isPileOn = false, isFoul = false, foulingPlayer, pilingOnPlayer, damageBonusActive = false;

    if (args.rollType == ROLL.PileOnArmorRoll) {
      // The first time you see it, without an IsOrderCompleted, is the choice to use PileOn
      // The second time, with IsOrderComplete, is an actual PileOn (but there are no dice associated)
      // If there's no IsOrderComplete, then it will show up as a normal injury roll.
      canPileOn = !('IsOrderCompleted' in result) || result.IsOrderCompleted == undefined;
    }

    // An Armor PileOn has a IsOrderCompleted RollType 60 right before it
    if (resultIdx == 0) {
      isPileOn = false;
    } else {
      var previousResult =
        action.Results && BB2.ensureKeyedList("BoardActionResult", action.Results as BB2.KeyedMList<"BoardActionResult", BB2.ActionResult<BB2.RulesEventBoardAction>>)[resultIdx - 1];
      if (previousResult && 'RollType' in previousResult) {
        isPileOn = previousResult.RollType == 59;
        if (isPileOn) {
          var previousSkills = BB2.ensureKeyedList("SkillInfo", previousResult.CoachChoices.ListSkills);
          pilingOnPlayer = args.gameState.playerById(
            previousSkills.filter((skill) => skill.SkillId == SKILL.PilingOn)[0]
              .PlayerId
          );
        }
      }
    }
    isFoul = 'ActionType' in action && action.ActionType == ACTION_TYPE.Foul;
    if (isFoul) {
      let firstAction = BB2.ensureList(step.RulesEventBoardAction)[0];
      assert('PlayerId' in firstAction);
      foulingPlayer = args.gameState.playerById(firstAction.PlayerId || 0)!;
      damageBonusActive = foulingPlayer.skills.includes(SKILL.DirtyPlayer);
    }
    assert(isPileOn === (pilingOnPlayer != undefined));
    return {
      ...args,
      canPileOn,
      isPileOn,
      isFoul,
      foulingPlayer,
      pilingOnPlayer,
      damageBonusActive,
    };
  }

  get description() {
    if (this.isFoul) {
      var foulerSkills =
        this.foulingPlayer && this.foulingPlayer.skills.length > 0
          ? ` (${this.foulingPlayer.skillNames.join(', ')})` : '';
      var fouledSkills =
        this.activePlayer.skills.length > 0
          ? ` (${this.activePlayer.skillNames.join(', ')})`
          : '';
      return `${this.actionName}: [${this.foulingPlayer!.team.shortName}] ${this.foulingPlayer!.name
        }${foulerSkills} against ${this.activePlayer.name}${fouledSkills} - ${this.dice.join(this.diceSeparator)}`;
    } else {
      return super.description;
    }
  }

  get actionName() {
    if (this.isFoul) {
      return "Foul (Armor)";
    } else if (this.isPileOn) {
      return "Pile On (Armor)";
    } else {
      return "Armor";
    }
  }

  get computedTarget() {
    return this.activePlayer.stats.av + 1;
  }

  get computedModifier() {
    return this.damageBonusActive ? 1 : 0;
  }

  injuryRoll(damageBonusAvailable: boolean, canPileOn: boolean, isFoul: boolean): InjuryRoll {
    let key = `${damageBonusAvailable}-${canPileOn}-${isFoul}`;
    let result = this.injuryRollCache.get(key) ||
      (this.injuryRollCache.set(key, new InjuryRoll({
        gameState: this.gameState,
        activePlayer: this.activePlayer,
        modifier: damageBonusAvailable ? 1 : 0,
        skillsInEffect: [],
        canPileOn,
        isPileOn: false,
        isFoul: this.isFoul,
        foulingPlayer: this.foulingPlayer,
        rollStatus: ROLL_STATUS.NoStatus,
        rollType: ROLL.Injury,
        dice: [],
        actionType: this.actionType,
        resultType: RESULT_TYPE.Passed,
        subResultType: SUB_RESULT_TYPE.CASResult,
        startIndex: this.startIndex,
        isReroll: false,
        rolls: this.actions,
      })).get(key));
    return result!;
  }

  value(dice: number[], expected: boolean): Distribution {
    var value = super.value(dice, expected);
    if (this.isFoul && dice[0] == dice[1]) {
      value = value.add(this.casValue(this.foulingPlayer!).named('Sent Off'), this.turnoverValue);
    }
    return value;
  }

  passValue(expected: boolean, rollTotal: number, modifiedTarget: number) {
    let damageBonusAvailable = this.damageBonusActive;
    if (this.damageBonusActive && rollTotal == modifiedTarget) {
      damageBonusAvailable = false;
    }
    var injuredPlayerValue = this.stunValue(this.activePlayer).subtract(this.knockdownValue(this.activePlayer)); // Player is at least stunned = out for 2 turns
    if (expected) {
      injuredPlayerValue = injuredPlayerValue.add(this.injuryRoll(damageBonusAvailable, this.canPileOn && !this.isPileOn, this.isFoul).possibleOutcomes.named('Injury Roll'));
    }
    if (this.isPileOn) {
      const pileOnCost = this.knockdownValue(this.pilingOnPlayer!, false);
      return injuredPlayerValue.add(pileOnCost);
    } else {
      return injuredPlayerValue;
    }
  }

  failValue(expected: boolean, rollTotal: number, modifiedTarget: number) {
    var value = new SingleValue('No Break', 0);
    if (this.isPileOn) {
      assert(this.isPileOn === (this.pilingOnPlayer != undefined));
      // Using Piling On means the piling on player is out for a whole turn;
      return value.add(this.knockdownValue(this.pilingOnPlayer!, false));
    } else {
      return value;
    }
  }

  get improbability() {
    let { numBroke, numHeld } = this.diceSums.reduce((acc, sum) => {
      if (sum >= this.modifiedTarget) {
        acc.numBroke += 1;
      } else {
        acc.numHeld += 1;
      }
      return acc;
    }, { numBroke: 0, numHeld: 0 });
    if (this.onActiveTeam(this.activePlayer)) {
      let heldChance = numHeld / (numBroke + numHeld);
      let held = this.dice.reduce((a, b) => a + b) < this.modifiedTarget;
      return (held ? 1 : 0) - heldChance;
    } else {
      let brokeChance = numBroke / (numBroke + numHeld);
      let broke = this.dice.reduce((a, b) => a + b) >= this.modifiedTarget;
      return (broke ? 1 : 0) - brokeChance;
    }
  }
}

class WildAnimalRoll extends PlayerD6Roll {
  get actionName() { return "Wild Animal"; }
  get handledSkills(): SKILL[] { return [SKILL.WildAnimal] };
  get dependentConditions(): DependentCondition[] { return [reroll, samePlayerMove]; }
  failValue(expected: boolean, rollTotal: number, modifiedTarget: number) {
    // Failing Wild Animal means that this player is effectiFvely unavailable
    // for the rest of your turn, but is active on your opponents turn
    return this.onTeamValue(this.activePlayer).product(-1);
  }
}

class DauntlessRoll extends ModifiedD6SumRoll {
  get actionName() { return "Dauntless"; }
  get handledSkills(): SKILL[] { return [SKILL.Dauntless] };
}

interface MoveRollArgs extends ModifiedD6SumRollArgs {
  cellFrom: Internal.Cell,
  cellTo: Internal.Cell,
}

class DodgeRoll extends PlayerD6Roll {
  cellFrom: Internal.Cell;
  cellTo: Internal.Cell;

  get actionName() { return "Dodge"; }
  get handledSkills(): SKILL[] { return [SKILL.BreakTackle, SKILL.Stunty, SKILL.TwoHeads, SKILL.Dodge, SKILL.Tackle, SKILL.PrehensileTail, SKILL.DivingTackle] };
  get rerollSkill(): undefined | SKILL { return SKILL.Dodge; }
  get rerollCancelSkill() { return SKILL.Tackle; }
  get dependentConditions(): DependentCondition[] { return [reroll, samePlayerMove, nonFoulDamage]; }

  constructor(args: ConstructorParameters<typeof PlayerD6Roll>[0] & {
    cellTo: Internal.Cell,
    cellFrom: Internal.Cell
  }) {
    super(args);
    this.cellTo = args.cellTo;
    this.cellFrom = args.cellFrom;
  }

  static fromBB2(xml: ActionXML): DodgeRoll {
    return new this(this.moveArgsFromBB2(xml));
  }

  static moveArgsFromBB2(xml: ActionXML): ConstructorParameters<typeof DodgeRoll>[0] {
    assert('resultPosition' in xml);
    let { result, stepIdx, action } = xml.resultPosition;
    let args = super.d6RollArgsFromBB2(xml);
    if (
      'SubResultType' in result &&
      result.SubResultType && ([
        SUB_RESULT_TYPE.ChoiceUseDodgeTackle,
        SUB_RESULT_TYPE.ChoiceUseDodgeSkill
      ] as (SUB_RESULT_TYPE | undefined)[]).includes(result.SubResultType)
    ) {
      // A dodge that fails in tackle and prompts for a team reroll doesn't have the requirement attached, so
      // pull them from the later roll
      let nextStep = xml.replay.unhandledSteps[stepIdx + 1];
      let nextActions = 'RulesEventBoardAction' in nextStep && nextStep.RulesEventBoardAction ? BB2.ensureList(nextStep.RulesEventBoardAction) : [];
      let nextResult = BB2.ensureKeyedList("BoardActionResult", nextActions[0].Results as BB2.KeyedMList<"BoardActionResult", BB2.ActionResult<BB2.RulesEventBoardAction>>)[0] as DeepReadonly<BB2.DodgeResult>;
      args.target = nextResult.Requirement || 0;
      args.modifier = (nextResult.ListModifiers == "" ? [] : BB2.ensureList(nextResult.ListModifiers.DiceModifier || []))
        .map((modifier) => modifier.Value || 0)
        .reduce((a, b) => a + b, 0) || 0;
    }
    return {
      ...args,
      cellFrom: convertCell(action.Order.CellFrom),
      cellTo: convertCell(BB2.ensureKeyedList('Cell', action.Order.CellTo)[0])
    }
  }
  failValue(expected: boolean, rollTotal: number, modifiedTarget: number) {
    return this.knockdownValue(this.activePlayer, expected).add(this.turnoverValue);
  }
  passValue(expected: boolean, rollTotal: number, modifiedTarget: number) {
    if (this.activePlayer && this.activePlayer.isBallCarrier) {
      return ballPositionValue(this.activePlayer.team, this.cellTo).subtract(
        ballPositionValue(this.activePlayer.team, this.cellFrom)
      );
    } else {
      return new SingleValue("Dodge", 0);
    }
  }
}

class JumpUpRoll extends PlayerD6Roll {
  get actionName() { return "Jump-Up"; }
  get handledSkills(): SKILL[] { return [SKILL.JumpUp] };
  failValue(expected: boolean, rollTotal: number, modifiedTarget: number) {
    // Jump Up failure means the block fails to activate, so the player is no longer
    // available for this turn.
    return this.onTeamValue(this.activePlayer).product(-1);
  }
}

class LeapRoll extends PlayerD6Roll {
  cellFrom: Internal.Cell;
  cellTo: Internal.Cell;
  get actionName() { return "Leap"; }
  get dependentConditions(): DependentCondition[] { return [reroll, samePlayerMove, nonFoulDamage]; }

  constructor(args: ConstructorParameters<typeof PlayerD6Roll>[0] & {
    cellFrom: Internal.Cell,
    cellTo: Internal.Cell
  }) {
    super(args);
    this.cellFrom = args.cellFrom;
    this.cellTo = args.cellTo;
  }
  static fromBB2(xml: ActionXML): LeapRoll {
    return new this(this.leapArgsFromBB2(xml));
  }
  static leapArgsFromBB2(xml: ActionXML): ConstructorParameters<typeof LeapRoll>[0] {
    assert('resultPosition' in xml);
    let { result, action } = xml.resultPosition;
    return {
      ...super.d6RollArgsFromBB2(xml),
      cellFrom: convertCell(action.Order.CellFrom),
      cellTo: convertCell(BB2.ensureKeyedList('Cell', action.Order.CellTo)[0]),
    };
  }
  failValue(expected: boolean, rollTotal: number, modifiedTarget: number) {
    return this.knockdownValue(this.activePlayer).add(this.turnoverValue);
  }
  passValue(expected: boolean, rollTotal: number, modifiedTarget: number) {
    if (this.activePlayer && this.activePlayer.isBallCarrier) {
      return ballPositionValue(this.activePlayer.team, this.cellTo).subtract(
        ballPositionValue(this.activePlayer.team, this.cellFrom)
      );
    } else {
      return new SingleValue("Leap", 0);
    }
  }
}

class PassRoll extends ModifiedD6SumRoll {
  get actionName() { return "Pass"; }
  get rerollSkill(): undefined | SKILL { return SKILL.Pass; }
  get handledSkills(): SKILL[] { return [SKILL.Pass, SKILL.StrongArm, SKILL.Accurate] };
  get dependentConditions(): DependentCondition[] { return [catchOrInterception, samePlayerMove, reroll]; }
  failValue(expected: boolean, rollTotal: number, modifiedTarget: number) {
    // TODO: Failed pass doesn't turn over, it causes the ball to scatter. If it scatters to another
    // player, then it's not a turnover.
    // TODO: Account for fumbles.
    return this.turnoverValue;
  }
}

class ThrowTeammateRoll extends ModifiedD6SumRoll {
  get actionName() { return "Throw Teammate"; }
  get handledSkills(): SKILL[] { return [SKILL.ThrowTeamMate] };
  get dependentConditions(): DependentCondition[] { return [samePlayerMove, reroll]; }
  failValue(expected: boolean, rollTotal: number, modifiedTarget: number) {
    // TODO: Throw teammate only turns over if the thrown player has the ball, and even then, only
    // TODO: Failed pass doesn't turn over, it causes the ball to scatter. If it scatters to another
    // player, then it's not a turnover.
    // TODO: Account for fumbles.
    return new SingleValue("Fail", 0);
  }

}

class InterceptionRoll extends ModifiedD6SumRoll {
  get actionName() { return "Intercept"; }
  get handledSkills(): SKILL[] { return [SKILL.ExtraArms] };
  // Interception rolls on the thrower, not the interceptee. If it "passes",
  // then the ball is caught
  passValue(expected: boolean, rollTotal: number, modifiedTarget: number) {
    return this.turnoverValue;
  }
}

class WakeUpRoll extends PlayerD6Roll {
  get actionName() { return "Wake Up"; }
  constructor(attrs: ModifiedD6SumRollArgs) {
    super(attrs);
    this.gameState.activeTeam = this.activePlayer?.team.id;
  }
  passValue(expected: boolean, rollTotal: number, modifiedTarget: number) {
    const playerValue =
      this.onTeamValue(this.activePlayer)
    let turnsInGame = this.halfTurnsInGame;

    let turnDecay = new SingleValue(
      `TDT(${turnsInGame})`,
      decayedHalfTurns(turnsInGame)
    );

    return playerValue.product(turnDecay).named(`WakeUp(${this.activePlayer.name})`);
  }
}

class GFIRoll extends PlayerD6Roll {
  cellFrom: Internal.Cell;
  cellTo: Internal.Cell;
  get actionName() { return "GFI"; }
  get handledSkills(): SKILL[] { return [SKILL.SureFeet] };
  get rerollSkill(): undefined | SKILL { return SKILL.SureFeet; }
  get dependentConditions(): DependentCondition[] { return [nonFoulDamage, reroll, samePlayerMove]; }

  constructor(args: ConstructorParameters<typeof PlayerD6Roll>[0] & {
    cellTo: Internal.Cell,
    cellFrom: Internal.Cell
  }) {
    super(args);
    this.cellFrom = args.cellFrom;
    this.cellTo = args.cellTo;
  }

  static fromBB2(xml: ActionXML): GFIRoll {
    return new this(this.gfiArgsFromBB2(xml));
  }
  static gfiArgsFromBB2(xml: ActionXML): ConstructorParameters<typeof GFIRoll>[0] {
    assert('resultPosition' in xml);
    let { result, action } = xml.resultPosition;
    return {
      ...super.d6RollArgsFromBB2(xml),
      cellFrom: convertCell(action.Order.CellFrom),
      cellTo: convertCell(BB2.ensureKeyedList('Cell', action.Order.CellTo)[0]),
    };
  }

  failValue(expected: boolean, rollTotal: number, modifiedTarget: number) {
    return this.knockdownValue(this.activePlayer, expected).add(this.turnoverValue);
  }
  passValue(expected: boolean, rollTotal: number, modifiedTarget: number) {
    if (this.activePlayer && this.activePlayer.isBallCarrier) {
      return ballPositionValue(this.activePlayer.team, this.cellTo).subtract(
        ballPositionValue(this.activePlayer.team, this.cellFrom)
      );
    } else {
      return new SingleValue("GFI", 0);
    }
  }
}

class CatchRoll extends ModifiedD6SumRoll {
  get actionName() { return "Catch"; }
  get handledSkills(): SKILL[] { return [SKILL.DisturbingPresence, SKILL.Catch, SKILL.ExtraArms] };
  get rerollSkill(): undefined | SKILL { return SKILL.Catch; }

  failValue(expected: boolean, rollTotal: number, modifiedTarget: number) {
    return this.turnoverValue;
  }
}

class StandUpRoll extends PlayerD6Roll {
  get actionName() { return "Stand Up"; }
  failValue(expected: boolean, rollTotal: number, modifiedTarget: number) {
    return this.knockdownValue(this.activePlayer, false);
  }
}

class TakeRootRoll extends PlayerD6Roll {
  get actionName() { return "Take Root"; }
  get handledSkills(): SKILL[] { return [SKILL.TakeRoot] };
  failValue(expected: boolean, rollTotal: number, modifiedTarget: number) {
    return this.knockdownValue(this.activePlayer, false);
  }
}

class LandingRoll extends PlayerD6Roll {
  get actionName() { return "Landing"; }
  get dependentConditions(): DependentCondition[] { return [reroll, samePlayerMove, nonFoulDamage]; }
  failValue(expected: boolean, rollTotal: number, modifiedTarget: number) {
    // TODO: Handle a turnover if the thrown player has the ball
    return this.knockdownValue(this.activePlayer, expected);
  }
}

class FireballRoll extends PlayerD6Roll {
  get actionName() { return "Fireball"; }
  get dependentConditions(): DependentCondition[] { return [nonFoulDamage]; }
  passValue(expected: boolean, rollTotal: number, modifiedTarget: number) {
    return this.knockdownValue(this.activePlayer, expected);
  }
}

class LightningBoltRoll extends PlayerD6Roll {
  get actionName() { return "Lightning Bolt"; }
  get dependentConditions(): DependentCondition[] { return [reroll, samePlayerMove, nonFoulDamage]; }
  static fromBB2(xml: ActionXML): LightningBoltRoll {
    return new this(this.lightningBoltArgsFromBB2(xml));
  }
  static lightningBoltArgsFromBB2(xml: ActionXML): ConstructorParameters<typeof LightningBoltRoll>[0] {
    assert('resultPosition' in xml);
    let { result, action } = xml.resultPosition;
    const args = super.d6RollArgsFromBB2(xml);
    args.activePlayer = args.gameState.playerAtPosition(convertCell(BB2.ensureKeyedList('Cell', action.Order.CellTo)[0]))!;
    return args;
  }
  passValue(expected: boolean, rollTotal: number, modifiedTarget: number) {
    return this.knockdownValue(this.activePlayer, expected);
  }
}

interface InjuryRollArgs extends RollArgs {
  canPileOn: boolean,
  isPileOn: boolean,
  pilingOnPlayer?: Player,
  isFoul: boolean,
  foulingPlayer?: Player,
  modifier: number
}

interface Outcome {
  name: string,
  value: Distribution,
}

export class InjuryRoll extends Roll {
  canPileOn: boolean;
  isPileOn: boolean;
  pilingOnPlayer?: Player;
  isFoul: boolean;
  foulingPlayer?: Player;
  modifier: number;
  activePlayer: Player;

  constructor(args: InjuryRollArgs) {
    super(args);
    this.canPileOn = args.canPileOn;
    this.isPileOn = args.isPileOn;
    this.pilingOnPlayer = args.pilingOnPlayer;
    this.isFoul = args.isFoul;
    this.foulingPlayer = args.foulingPlayer;
    this.modifier = args.modifier;
    this.activePlayer = args.activePlayer!;
    console.assert(
      this.isFoul === !(this.foulingPlayer === undefined),
      { msg: "Must have a fouling player for a foul", roll: this }
    )
  }

  get handledSkills(): SKILL[] { return [SKILL.MightyBlow, SKILL.DirtyPlayer, SKILL.Stunty] };
  get diceSeparator() { return '+'; }
  get dependentConditions(): DependentCondition[] { return [reroll]; }

  static fromBB2(xml: ActionXML): InjuryRoll {
    return new this(this.injuryArgsFromBB2(xml));
  }

  static injuryArgsFromBB2(xml: ActionXML): InjuryRollArgs {
    assert('resultPosition' in xml);
    let { result, resultIdx, action, step } = xml.resultPosition;
    assert('RollType' in result);
    assert(result.RollType == ROLL.Injury || result.RollType == ROLL.PileOnInjuryRoll);

    const args = super.rollArgsFromBB2(xml);
    let canPileOn = false, isPileOn = false, pilingOnPlayer, isFoul = false, foulingPlayer, modifier = 0;

    if (args.rollType == ROLL.PileOnInjuryRoll) {
      // The first time you see it, without an IsOrderCompleted, is the choice to use PileOn
      // The second time, with IsOrderCompleted, is an actual PileOn (but there are no dice associated)
      // If there's no IsOrderCompleted, then it will show up as a normal injury roll.
      canPileOn = result.IsOrderCompleted == undefined;
    }

    // An Injury PileOn has a IsOrderCompleted RollType 60 right before it
    if (resultIdx == 0) {
      isPileOn = false;
    } else {
      var previousResult =
        BB2.ensureKeyedList("BoardActionResult", action.Results as BB2.KeyedMList<"BoardActionResult", BB2.ActionResult<BB2.RulesEventBoardAction>>)[resultIdx - 1];
      if ('RollType' in previousResult) {
        if (previousResult.RollType == ROLL.PileOnInjuryRoll) {
          isPileOn = true;
          var previousSkills = BB2.ensureKeyedList(
            "SkillInfo",
            previousResult.CoachChoices.ListSkills
          );
          pilingOnPlayer = args.gameState.playerById(
            previousSkills.filter((skill) => skill.SkillId == SKILL.PilingOn)[0]
              .PlayerId
          );
        }
      }
    }

    isFoul = 'ActionType' in action && action.ActionType == ACTION_TYPE.Foul;
    if (isFoul) {
      let actions = 'RulesEventBoardAction' in step ? BB2.ensureList(step.RulesEventBoardAction) : [];
      let foulAction = actions[0] as BB2.FoulAction;
      foulingPlayer = args.gameState.playerById(foulAction.PlayerId!);
    }

    modifier =
      BB2.ensureKeyedList("DiceModifier", result.ListModifiers)
        .map((modifier) => modifier.Value || 0)
        .reduce((a, b) => a + b, 0) || 0;

    assert(isPileOn === (pilingOnPlayer != undefined));
    return {
      ...args,
      canPileOn,
      isPileOn,
      pilingOnPlayer,
      isFoul,
      foulingPlayer,
      modifier,
    };
  }

  get shortDescription() {
    return `${this.actionName}: ${this.activePlayer.name} - ${this.dice.reduce((a, b) => a + b)}`;
  }

  get actionName() {
    if (this.canPileOn) {
      return "Injury (Can Pile On)"
    } else if (this.isPileOn) {
      return "Injury (Piled On)";
    } else {
      return "Injury";
    }
  }

  // TODO: Handle skills
  get injuryName() {
    let total = this.dice[0] + this.dice[1] + this.modifier;
    if (this.activePlayer.skills.includes(SKILL.Stunty)) {
      total += 1;
    }
    if (total <= 7) {
      return "Stun";
    } else if (total <= 9) {
      return "KO";
    } else {
      return "CAS";
    }
  }

  // TODO: Handle skills
  injuryValue(total: number) {
    if (this.activePlayer.skills.includes(SKILL.Stunty)) {
      total += 1;
    }
    if (total <= 7) {
      return new SingleValue("No Injury", 0); // Only stunned, no additional cost relative to armor break failure
    } else if (total <= 9) {
      return this.koValue(this.activePlayer);
    } else {
      return this.casValue(this.activePlayer);
    }
  }

  get improbability() {
    let modifier = this.activePlayer.skills.includes(SKILL.Stunty) ? 1 : 0;
    let { pass, fail } = this.diceCombinations.reduce((acc: { pass: number, fail: number }, dice: number[]) => {
      if (dice[0] + dice[1] + modifier <= 7) {
        acc.fail += 1;
      } else {
        acc.pass += 1;
      }
      return acc;
    }, { pass: 0, fail: 0 });

    let passChance = pass / (pass + fail);
    let passed = this.dice[0] + this.dice[1] + modifier > 7;
    return (passed ? 1 : 0) - passChance;
  }

  get diceCombinations(): number[][] {
    var combinations = [];
    for (var first = 1; first <= 6; first++) {
      for (var second = 1; second <= 6; second++) {
        combinations.push([first, second]);
      }
    }
    Object.defineProperty(this, 'diceCombinations', { value: combinations });
    return this.diceCombinations;
  }

  value(dice: number[], expected: boolean): Distribution {
    if (this.canPileOn) {
      return new SingleValue(`Pile On Decision Pending`, 0);
    }
    var total = dice[0] + dice[1] + this.modifier;
    var value = this.injuryValue(total);
    if (this.isPileOn) {
      // Using Piling On means the piling on player is out for a whole turn;
      value = value.subtract(this.onTeamValue(this.pilingOnPlayer!));
    }
    if (this.isFoul && dice[0] == dice[1]) {
      value = value.add(this.casValue(this.foulingPlayer!).named('Sent Off'), this.turnoverValue);
    }
    if (
      this.nextAction &&
      this.nextAction.constructor == this.constructor &&
      'isReroll' in this.nextAction &&
      this.nextAction.isReroll
    ) {
      return new SingleValue(`Rerolled ${this.actionName}`, this.rerollValue);
    } else {
      return value;
    }
  }

  get _possibleOutcomes() {
    var outcomesByName: Record<string, Outcome[]> = {};
    for (var combination of this.diceCombinations) {
      let value = this.value(combination, true);
      var outcomeList = outcomesByName[value.name];
      if (!outcomeList) {
        outcomeList = outcomesByName[value.name] = [];
      }
      outcomeList.unshift({
        name: (combination[0] + combination[1]).toString(),
        value: value
      });
    }
    return new SimpleDistribution(
      Object.values(outcomesByName).map((outcomes) => {
        const minOutcome = Math.min(
          ...outcomes.map((outcome) => parseInt(outcome.name))
        );
        const maxOutcome = Math.max(...outcomes.map((outcome) => parseInt(outcome.name)));
        return {
          name: minOutcome === maxOutcome ? minOutcome.toString() : `${minOutcome}-${maxOutcome}`,
          weight: outcomes.length,
          value: outcomes[0].value
        }
      })
    );
  }
  simulateDice() {
    return this.dice.map(() => sample([1, 2, 3, 4, 5, 6]));
  }
}

interface CasualtyRollArgs extends RollArgs {
  isFoul: boolean,
  activePlayer: Player,
}
export class CasualtyRoll extends Roll {
  isFoul: boolean;
  activePlayer: Player;
  get actionName() { return "Casualty"; }
  get handledSkills(): SKILL[] { return [SKILL.NurglesRot, SKILL.Decay] };
  // TODO: Handle skills
  // TODO: Selecting the Apo result seems to read as a separate roll
  get diceSeparator() { return ''; }

  constructor(args: CasualtyRollArgs) {
    super(args);
    this.isFoul = args.isFoul;
    this.activePlayer = args.activePlayer;
  }
  static fromBB2(xml: ActionXML) {
    return new this(this.casualtyArgsFromBB2(xml));
  }
  static casualtyArgsFromBB2(xml: ActionXML): CasualtyRollArgs {
    assert('resultPosition' in xml);
    let { result, action } = xml.resultPosition;
    let args = super.rollArgsFromBB2(xml);
    return {
      ...args,
      // Casualty dice are also doubled up, and also both rolls appear when an apoc is used (so the last one is the valid one)
      dice: args.dice.slice(0, args.dice.length / 2).slice(-1),
      isFoul: 'ActionType' in action && action.ActionType == ACTION_TYPE.Foul,
      activePlayer: args.activePlayer!,
    };
  }

  casName(dice: number[]): string {
    if (dice[0] < 40) {
      return "Badly Hurt";
    } else if (dice[0] < 50) {
      return "Miss Next Game";
    } else if (dice[0] <= 52) {
      return "Niggling Injury";
    } else if (dice[0] <= 54) {
      return "-MA";
    } else if (dice[0] <= 56) {
      return "-AV";
    } else if (dice[0] <= 57) {
      return "-AG";
    } else if (dice[0] <= 58) {
      return "-ST";
    } else if (dice[0] <= 68) {
      return "Dead!";
    }
    return `Unknown Injury ${dice}`
  }
  value(dice: number[], expected: boolean): Distribution {
    return new SingleValue("CAS", 0); // Need to figure out how to grade losing player value for multiple matches
  }
  get _possibleOutcomes() {
    var outcomes = [];
    for (var type = 1; type <= 6; type++) {
      for (var subtype = 1; subtype <= 8; subtype++) {
        outcomes.unshift({
          name: `${type}${subtype}`,
          value: this.value([type, subtype], true),
          weight: 1
        });
      }
    }
    return new SimpleDistribution(outcomes);
  }
  simulateDice() {
    return sample([1, 2, 3, 4, 5, 6]) * 10 + sample([1, 2, 3, 4, 5, 6, 7, 8]);
  }
}

class RegenerationRoll extends PlayerD6Roll {
  get actionName() { return "Regeneration"; }
  get handledSkills(): SKILL[] { return [SKILL.Regeneration] };

  passValue(expected: boolean, rollTotal: number, modifiedTarget: number) {
    return this.koValue(this.activePlayer).product(-0.5).named('Regeneration');
  }
}

type MoveActionArgs = ConstructorParameters<typeof Action>[0] & {
  cellFrom: Internal.Cell,
  cellTo: Internal.Cell,
  activePlayer: Player,
}

export class MoveAction extends Action {
  cellFrom: Internal.Cell;
  cellTo: Internal.Cell;
  activePlayer: Player;
  get actionName() { return "Move"; }
  get dependentConditions(): DependentCondition[] { return [sameTeamMove]; }
  get handledSkills(): SKILL[] { return [SKILL.JumpUp] };

  get ignore() {
    return false;
  }

  constructor(attrs: MoveActionArgs) {
    super(attrs);
    this.activePlayer = attrs.activePlayer;
    this.cellFrom = attrs.cellFrom;
    this.cellTo = attrs.cellTo;
  };

  static fromBB2(xml: ActionXML): MoveAction {
    return new this(this.moveArgsFromBB2(xml));
  }
  static moveArgsFromBB2(xml: ActionXML): MoveActionArgs {
    assert('resultPosition' in xml);
    let { result, action } = xml.resultPosition;
    let args = super.actionArgsFromBB2(xml);
    return {
      ...args,
      activePlayer: args.activePlayer!,
      cellFrom: convertCell(action.Order.CellFrom),
      cellTo: convertCell(BB2.ensureKeyedList('Cell', action.Order.CellTo)[0]),
    };
  }

  get description() {
    const from = this.cellFrom;
    const to = this.cellTo;
    return `Move: [${this.activePlayer.team.shortName}] ${this.activePlayer.name} - (${from.x}, ${from.y}) \u2192 (${to.x}, ${to.y})`;
  }

  get shortDescription() {
    const from = this.cellFrom;
    const to = this.cellTo;
    return `Move: ${this.activePlayer.name} - (${from.x}, ${from.y}) \u2192 (${to.x}, ${to.y})`;
  }
  value() {
    if (this.activePlayer && this.activePlayer.isBallCarrier) {
      return ballPositionValue(this.activePlayer.team, this.cellTo).subtract(
        ballPositionValue(this.activePlayer.team, this.cellFrom)
      );
    } else {
      return new SingleValue("Move", 0);
    }
  }
  get _possibleOutcomes() {
    return this.value().add(...this.dependentActions.map(roll => roll.value()))
  }
}

class NoValueAction extends Action {
  get ignore() {
    return true;
  }
  value() {
    return new SingleValue("No Value", 0);
  }
  get expectedValue() {
    return 0;
  }
  simulateDice() {
    return undefined;
  }
  get _possibleOutcomes() {
    return new SingleValue("No Value", 0);
  }
}

function isKickoffRoll(roll: Action, dependent: Action) {
  return dependent instanceof KickoffEventRoll;
}

export class KickoffRoll extends Roll {
  kickoffTeam: Internal.Side;
  diceSum: KICKOFF_RESULT;

  constructor(args: RollArgs & {
    diceSum: KICKOFF_RESULT,
    kickoffTeam: Internal.Side,
  }) {
    super(args);
    this.kickoffTeam = args.kickoffTeam;
    this.diceSum = args.diceSum;
  }

  get actionName() { return "Kickoff"; }
  get dependentConditions(): DependentCondition[] { return [isKickoffRoll]; }

  static fromBB2(xml: ActionXML) {
    return new this(this.kickoffArgsFromBB2(xml));
  }
  static kickoffArgsFromBB2(xml: ActionXML): ConstructorParameters<typeof KickoffRoll>[0] {
    assert('kickoffPosition' in xml);
    let { step, stepIdx, kickoff } = xml.kickoffPosition;
    assert('BoardState' in step);
    let dice = BB2.translateStringNumberList(kickoff.ListDice);
    return {
      gameState: GameState.fromBB2(xml.initialBoard, step.BoardState),
      dice,
      diceSum: dice[0] + dice[1],
      startIndex: xml.positionIdx,
      kickoffTeam: convertSide(step.BoardState.KickOffTeam || 0),
      skillsInEffect: [],
      rollStatus: ROLL_STATUS.NoStatus,
      activePlayer: undefined,
      rollType: ROLL.KickoffEvent,
      actionType: ACTION_TYPE.KickoffTarget,
      resultType: RESULT_TYPE.Passed,
      isReroll: false,
    };
  }
  get description() {
    return `${this.actionName}: ${KICKOFF_RESULT_NAMES[this.diceSum]}`;
  }
  get shortDescription() {
    return this.description;
  }

  // TODO: Handle skills
  kickoffValue(total: KICKOFF_RESULT): Distribution {
    switch (total) {
      case KICKOFF_RESULT.GetTheRef:
        return new SingleValue("GetTheRef", 0);
      case KICKOFF_RESULT.Riot:
        return new SingleValue("Riot", 0);
      case KICKOFF_RESULT.PerfectDefence:
        return new SingleValue("PerfectDefence", 0);
      case KICKOFF_RESULT.HighKick:
        return new SingleValue("HighKick", 0);
      case KICKOFF_RESULT.CheeringFans:
        return new SingleValue("CheeringFans", 0);
      case KICKOFF_RESULT.ChangingWeather:
        return new SingleValue("ChangingWeather", 0);
      case KICKOFF_RESULT.BrilliantCoaching:
        return new SingleValue("BrilliantCoaching", 0);
      case KICKOFF_RESULT.QuickSnap:
        return new SingleValue("QuickSnap", 0);
      case KICKOFF_RESULT.Blitz:
        return new SingleValue("Blitz", 0);
      case KICKOFF_RESULT.ThrowARock:
        return new SingleValue("ThrowARock", 0);
      case KICKOFF_RESULT.PitchInvasion:
        return new SingleValue("PitchInvasion", 0);
    }
  }

  get improbability(): number {
    let { pass, fail } = this.diceCombinations.reduce((acc: { pass: number, fail: number }, dice: KICKOFF_RESULT[]) => {
      let total = dice[0] + dice[1];
      switch (total) {
        case KICKOFF_RESULT.GetTheRef:
        case KICKOFF_RESULT.Riot:
        case KICKOFF_RESULT.CheeringFans:
        case KICKOFF_RESULT.ChangingWeather:
        case KICKOFF_RESULT.BrilliantCoaching:
        case KICKOFF_RESULT.ThrowARock:
        case KICKOFF_RESULT.PitchInvasion:
          acc.pass += 0.5;
          acc.fail += 0.5;
          break;
        case KICKOFF_RESULT.PerfectDefence:
        case KICKOFF_RESULT.HighKick:
          acc.fail += 1;
          break;
        case KICKOFF_RESULT.QuickSnap:
        case KICKOFF_RESULT.Blitz:
          acc.pass += 1;
          break;
      }
      return acc;
    }, { pass: 0, fail: 0 });


    let total: KICKOFF_RESULT = this.dice[0] + this.dice[1];
    switch (total) {
      case KICKOFF_RESULT.GetTheRef:
      case KICKOFF_RESULT.Riot:
      case KICKOFF_RESULT.CheeringFans:
      case KICKOFF_RESULT.ChangingWeather:
      case KICKOFF_RESULT.BrilliantCoaching:
      case KICKOFF_RESULT.ThrowARock:
      case KICKOFF_RESULT.PitchInvasion:
        return 0;
      case KICKOFF_RESULT.PerfectDefence:
      case KICKOFF_RESULT.HighKick:
        return (-pass) / (pass + fail);
      case KICKOFF_RESULT.QuickSnap:
      case KICKOFF_RESULT.Blitz:
        return 1 - (pass / (pass + fail));
    }
  }

  get diceCombinations(): [KICKOFF_RESULT, KICKOFF_RESULT][] {
    var combinations = [];
    for (var first = 1; first <= 6; first++) {
      for (var second = 1; second <= 6; second++) {
        combinations.push([first, second]);
      }
    }
    Object.defineProperty(this, 'diceCombinations', { value: combinations });
    return this.diceCombinations;
  }

  value(dice: KICKOFF_RESULT[]): Distribution {
    var total = dice[0] + dice[1];
    var value = this.kickoffValue(total);
    return value;
  }

  get _possibleOutcomes() {
    var outcomesByName: Record<string, { name: string, value: Distribution }[]> = {};
    for (var combination of this.diceCombinations) {
      var outcomeList = outcomesByName[this.value(combination).name];
      if (!outcomeList) {
        outcomeList = outcomesByName[this.value(combination).name] = [];
      }
      outcomeList.unshift({
        name: (combination[0] + combination[1]).toString(),
        value: this.value(combination)
      });
    }
    return new SimpleDistribution(
      Object.values(outcomesByName).map((outcomes) => {
        const minOutcome = Math.min(
          ...outcomes.map((outcome) => parseInt(outcome.name))
        );
        const maxOutcome = Math.max(...outcomes.map((outcome) => parseInt(outcome.name)));
        return {
          name: minOutcome === maxOutcome ? minOutcome.toString() : `${minOutcome}-${maxOutcome}`,
          weight: outcomes.length,
          value: outcomes[0].value
        }
      })
    );
  }

  simulateDice() {
    return this.dice.map(() => sample([1, 2, 3, 4, 5, 6]));
  }
}

interface KickoffEventRollXML {
  initialBoard: BB2.BoardState,
  positionIdx: number,
  kickoffPosition: BB2.KickoffPosition,
  messageData: BB2.KickoffEventMessageData,
}
// Cheating on types here because KickoffEvent wants a bunch of ModifiedD6SumRoll stuff
// @ts-ignore
class KickoffEventRoll extends ModifiedD6SumRoll {
  kickoffTeam: Internal.Side;
  messageData: any;

  constructor(args: ModifiedD6SumRollArgs & {
    kickoffTeam: Internal.Side,
    messageData: BB2.KickoffEventMessageData,
  }) {
    super(args);
    this.kickoffTeam = args.kickoffTeam;
    this.messageData = args.messageData;
  }

  get activeTeam() {
    return this.gameState.teams[this.kickoffTeam];
  }

  static fromBB2(xml: KickoffEventRollXML): KickoffEventRoll {
    return new this(this.kickoffEventArgsFromBB2(xml));
  }
  static kickoffEventArgsFromBB2(xml: KickoffEventRollXML): ConstructorParameters<typeof KickoffEventRoll>[0] {
    const { step } = xml.kickoffPosition;
    const gameState = GameState.fromBB2(step.BoardState, step.BoardState);
    const kickoffTeam = convertSide(step.BoardState.KickOffTeam || SIDE.home);

    return {
      gameState,
      startIndex: xml.positionIdx,
      messageData: xml.messageData,
      kickoffTeam,
      target: 0,
      modifier: 0,
      skillsInEffect: [],
      rollStatus: ROLL_STATUS.NoStatus,
      rollType: ROLL.KickoffEvent,
      actionType: ACTION_TYPE.KickoffTarget,
      activePlayer: undefined,
      dice: [],
      resultType: RESULT_TYPE.Passed,
      isReroll: false,
    };
  }
}

export class PitchInvasionRoll extends KickoffEventRoll {
  messageData: BB2.PitchInvasionMessage;
  stunned: boolean;
  activePlayer: Player;

  get actionName() { return "Pitch Invasion"; }
  constructor(args: ConstructorParameters<typeof KickoffEventRoll>[0] & {
    messageData: BB2.PitchInvasionMessage,
  }) {
    super(args);
    this.messageData = args.messageData;
    this.activePlayer = this.gameState.playerById(this.messageData.RulesEventPlayerInvaded.PlayerId)!;
    this.dice = [this.messageData.RulesEventPlayerInvaded.Die];
    this.stunned = this.messageData.RulesEventPlayerInvaded.Stunned == 1;
    let playerTeam = this.activePlayer.team;
    let opposingTeam = this.gameState.teams[this.activePlayer.team.id == 'home' ? 'away' : 'home'];
    this.target = 6;
    this.modifier = opposingTeam.fame;
  }

  get description() {
    return `${this.actionName}: ${this.activePlayer.name} ${this.stunned ? 'stunned!' : 'safe'} - ${this.dice[0]} (${this.target})`;
  }

  passValue(expected: boolean, rollTotal: number, modifiedTarget: number) {
    return this.stunValue(this.activePlayer);
  }

  get improbability() {
    if (this.onActiveTeam(this.activePlayer)) {
      let safeChance = (5 - this.modifier) / 6;
      let safe = !this.stunned;
      return (safe ? 1 : 0) - safeChance;
    } else {
      let stunnedChance = (1 + this.modifier) / 6;
      return (this.stunned ? 1 : 0) - stunnedChance;
    }
  }
}


export class SetupAction extends NoValueAction {
  constructor({ gameState, startIndex }: { gameState: GameState, startIndex: number }) {
    super({ gameState, startIndex, actionType: ACTION_TYPE.SetupAction });
  }
  get actionName() { return "Setup"; }
  get dependentConditions(): DependentCondition[] { return [setup]; }
  get hideDependents() { return true; }
  get ignore() {
    return false;
  }

  get description() {
    return `Setup`;
  }

  get jointDescription() {
    return "Setup";
  }

  get shortDescription() {
    return this.description;
  }

  static fromInternal(definition: Internal.GameDefinition, position: Internal.SetupActionPosition, positionIdx: number) {
    return new this({
      gameState: GameState.fromInternal(position.gameState, definition),
      startIndex: positionIdx,
    });
  }
  static fromBB2(xml: ActionXML) {
    return new this(this.setupArgsFromBB2(xml));
  }
  static setupArgsFromBB2(xml: ActionXML): ConstructorParameters<typeof SetupAction>[0] {
    assert('setupPosition' in xml);
    return {
      gameState: GameState.fromBB2(xml.initialBoard, xml.setupPosition.step.BoardState),
      startIndex: xml.positionIdx,
    };
  }
}

class PushChoice extends NoValueAction {
  get actionName() { return "Push"; }
  get handledSkills(): SKILL[] { return [SKILL.SideStep] };
}

class FollowUpChoice extends NoValueAction {
  get actionName() { return "Follow Up"; }
  get handledSkills(): SKILL[] { return [SKILL.Frenzy] };
}

class FoulPenaltyRoll extends NoValueAction { }

export class UnknownAction {
  ignore: boolean;
  actions?: (Action | UnknownAction)[];

  constructor(public name: string, public xml: any) {
    this.ignore = true;
  }
}

const ROLL_TYPES: Record<ROLL, string | typeof Action | undefined> = {
  [ROLL.AlwaysHungry]: "Always Hungry",
  [ROLL.Animosity]: "Animosity",
  [ROLL.Armor]: ArmorRoll,
  [ROLL.BallAndChain]: "Ball And Chain",
  [ROLL.Bite]: "Bite",
  [ROLL.Block]: BlockRoll,
  [ROLL.Bloodlust]: "Bloodlust",
  [ROLL.BombKD]: "Bomb KD",
  [ROLL.BoneHead]: BoneHeadRoll,
  [ROLL.Bribe]: "Bribe",
  [ROLL.Casualty]: CasualtyRoll,
  [ROLL.Catch]: CatchRoll,
  [ROLL.ChainsawArmor]: "Chainsaw Armor",
  [ROLL.ChainsawKickback]: "Chainsaw (Kickback?)",
  [ROLL.Dauntless]: DauntlessRoll,
  [ROLL.DivingTackle]: "Diving Tackle",
  [ROLL.Dodge]: DodgeRoll,
  [ROLL.DodgePick]: "Dodge Pick",
  [ROLL.EatTeammate]: "Eat Teammate",
  [ROLL.Fans]: undefined, // Fans
  [ROLL.Fireball]: FireballRoll,
  [ROLL.FollowUp]: undefined, //FollowUpChoice,
  [ROLL.FoulAppearance]: FoulAppearanceRoll,
  [ROLL.FoulPenalty]: FoulPenaltyRoll,
  [ROLL.GFI]: GFIRoll,
  [ROLL.HailMaryPass]: "Hail Mary Pass",
  [ROLL.HalflingChef]: "Halfling Chef",
  [ROLL.HypnoticGaze]: "Hypnotic Gaze",
  [ROLL.InaccuratePassScatter]: undefined, // Inaccurate Pass Scatter
  [ROLL.Injury]: InjuryRoll,
  [ROLL.Interception]: InterceptionRoll,
  [ROLL.Juggernaut]: undefined, // Juggernaut
  [ROLL.JumpUp]: JumpUpRoll,
  [ROLL.KickoffEvent]: KickoffRoll,
  [ROLL.KickoffGust]: undefined, // Kickoff Gust
  [ROLL.KickoffScatter]: undefined, // Kickoff Scatter
  [ROLL.Landing]: LandingRoll,
  [ROLL.Leap]: LeapRoll,
  [ROLL.LightningBolt]: LightningBoltRoll,
  [ROLL.Loner]: "Loner",
  [ROLL.Multiblock]: "Multiblock",
  [ROLL.Pass]: PassRoll,
  [ROLL.Pickup]: PickupRoll,
  [ROLL.PileOnArmorRoll]: ArmorRoll, // Armor Roll with Pile On. If followed by a RollType 59 w/ IsOrderCompleted, then PO happened. Otherwise, no PO
  [ROLL.PileOnInjuryRoll]: InjuryRoll, // Injury Roll with Pile On. If followed by a RollType 60 w/ IsOrderCompleted, then PO happened, otherwise, no PO?
  [ROLL.Pro]: "Pro",
  [ROLL.Push]: undefined, //PushChoice,
  [ROLL.RaiseDead]: "Raise Dead",
  [ROLL.ReallyStupid]: ReallyStupidRoll,
  [ROLL.Regeneration]: RegenerationRoll,
  [ROLL.SafeThrow]: "Safe Throw",
  [ROLL.Shadowing]: "Shadowing",
  [ROLL.Stab]: "Stab",
  [ROLL.StandFirm]: undefined, // Choice to use Stand Firm
  [ROLL.StandFirm2]: "Stand Firm 2",
  [ROLL.StandUp]: StandUpRoll,
  [ROLL.SwealteringHeat]: "Swealtering Heat",
  [ROLL.TakeRoot]: TakeRootRoll,
  [ROLL.Tentacles]: "Tentacles",
  [ROLL.ThrowIn]: undefined, // Throw-in Roll
  [ROLL.ThrowTeammate]: ThrowTeammateRoll,
  [ROLL.TouchBack]: undefined, // Touch Back
  [ROLL.WakeUp]: WakeUpRoll,
  [ROLL.Weather]: undefined, // Weather
  [ROLL.WildAnimal]: WildAnimalRoll,
  [ROLL.Wrestle2]: undefined, // Some sort of wrestle roll that doesn't do anything
};

const KICKOFF_RESULT_TYPES: Record<KICKOFF_RESULT, typeof KickoffEventRoll | string> = {
  [KICKOFF_RESULT.PitchInvasion]: PitchInvasionRoll,
  [KICKOFF_RESULT.Blitz]: "Blitz",
  [KICKOFF_RESULT.BrilliantCoaching]: "Brilliant Coaching",
  [KICKOFF_RESULT.ChangingWeather]: "Changing Weather",
  [KICKOFF_RESULT.CheeringFans]: "Cheering Fans",
  [KICKOFF_RESULT.GetTheRef]: "Get The Ref",
  [KICKOFF_RESULT.HighKick]: "High Kick",
  [KICKOFF_RESULT.PerfectDefence]: "Perfect Defense",
  [KICKOFF_RESULT.QuickSnap]: "Quick Snap",
  [KICKOFF_RESULT.Riot]: "Riot",
  [KICKOFF_RESULT.ThrowARock]: "Throw A Rock",
};

function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}