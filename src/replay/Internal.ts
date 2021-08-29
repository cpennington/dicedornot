import type {ACTION_TYPE, RACE_ID, BLOCK, SKILL, ROLL, PLAYER_TYPE, WEATHER, STATUS, SITUATION, MODIFIER_TYPE} from '../constants.js';
import type * as BB2 from './BB2.js';

export type ByTeam<T> = {
    home: T,
    away: T
};

export interface Cell {
    x: number,
    y: number,
}

export function cellEq(a: Cell, b: Cell) {
    return a.x == b.x && a.y == b.y;
}

export interface ModifiedD6SumRoll {
    player: PlayerId,
    roll: number[],
    target: number,
}

export interface Replay {
    teams: ByTeam<Team>,
    stadium: {
        name: string,
        type: string,
        enhancement?: string,
    },
    gameLength: number,
    drives: Drive[],
    unhandledSteps: BB2.ReplayStep[],
    finalScore: ByTeam<number>,
    metadata: {
        url?: string,
        filename?: string,
        league?: string,
        datePlayed: Date,
    }
    fans: ByTeam<Roll>,
    initialWeather: WEATHER,
    coinFlipWinner: Side,
    initialKickingTeam: Side,
}

export interface Team {
    players: Map<PlayerNumber, Player>,
    inducements: Inducements,
    race: RACE_ID,
    coach: string,
    name: string,
    logo: string,
}

export interface Inducements {
    mercenaries: Map<PlayerNumber, Player>,
}

export type Side = "home" | "away";
export function other(side: Side): Side {
    return side == "home" ? "away" : "home";
}
export type PlayerNumber = number;
export type KickoffOrder<T> = {first: Side, home: T, away: T};
export interface PlayerId {
    side: Side,
    number: PlayerNumber;
}

export interface DiceRoll {
    dice: number[],
    modifiers: DiceModifier[],
    target?: number,
};

export interface WithPileOn {
    pileOn?: DiceRoll,
}

export interface Damage {
    player: PlayerId,
    injury?: DiceRoll,
    armor?: DiceRoll & WithPileOn,
    casualty?: DiceRoll & WithPileOn,
    regeneration?: DiceRoll,
    raiseDead?: boolean,
}

export interface Player {
    id: PlayerId,
    skills: SKILL[],
    type: PLAYER_TYPE,
    name: string,
    stats: {
        ma: number,
        st: number,
        ag: number,
        av: number,
    }
    casualties?: number[],
}

export interface PlayerState {
    usedSkills: SKILL[],
    canAct: boolean,
    status: STATUS,
    disabled: boolean,
    blitzer: boolean,
    situation: SITUATION,
    casualties?: number[],
}
export interface Checkpoint {
    playerPositions: Map<PlayerNumber, Cell>
}

export type KickoffRoll = {
    dice: number[],
};
export type SetupAction = {
    checkpoint: Checkpoint,
    movedPlayers: Map<PlayerNumber, Cell>,
};
export type CatchRoll = any;
export type PassRoll = any;
export type FoulRoll = any;
export interface TakeDamageRoll {
    player: PlayerId;
    dice: number[];
};

export interface Drive {
    initialScore: ByTeam<number>;
    wakeups: KickoffOrder<WakeupRoll[]>;
    setups: KickoffOrder<SetupAction[]>;
    kickoff: {
        eventRoll: KickoffRoll,
        target: Cell,
        scatters: Cell[],
        rockDamage?: TakeDamageRoll[],
    };
    turns: Turn[];
    touchdownScorer?: Player;
    finalScore: ByTeam<number>;
}

export interface WakeupRoll extends ModifiedD6SumRoll {
}

export enum WizardType {
    fireball = "fireball",
    bolt = "bolt",
}
export interface WizardRoll {
    type: WizardType,
    target: Cell,
    effects: ModifiedD6SumRoll[],
} 

export interface Turn extends Checkpoint {
    number: number,
    side: keyof ByTeam<any>,
    activations: Activation[],
    startWizard?: WizardRoll,
    endWizard?: WizardRoll
}

export interface Activation extends Checkpoint {
    playerId: PlayerId,
    test?: ActivationTest,
    action: Action,
    actionSteps: ActionStep[],
}

export type Action =
    | BlockAction
    | BlitzAction
    | PassAction
    | MoveAction
    | FoulAction
    | HandoffAction

export type ActionStep = null;

export type MovePath = Cell[];

export interface ActivationTest extends ModifiedD6SumRoll {
}

export interface RollAction<R> {
    player: PlayerId,
    roll: R,
}

export interface MoveAndRollAction<R> extends RollAction<R> {
    before?: MovePath,
}

export interface BlockAction extends RollAction<BlockRoll> {
    actionType: ACTION_TYPE.Block,
    target: PlayerId,
}

export interface BlitzAction extends MoveAndRollAction<BlockRoll> {
    actionType: ACTION_TYPE.Blitz,
    target: PlayerId,
    after?: MovePath,
}

export interface PassAction extends MoveAndRollAction<PassRoll> {
    actionType: ACTION_TYPE.Pass,
    targetSquare: Cell,
}

export interface MoveAction {
    actionType: ACTION_TYPE.Move,
    player: PlayerId,
    path: MovePath,
}

export interface HandoffAction extends MoveAndRollAction<CatchRoll> {
    actionType: ACTION_TYPE.Handoff,
}

export interface FoulAction extends MoveAndRollAction<FoulRoll> {
    actionType: ACTION_TYPE.Foul,
}

export interface BlockRoll {
    roll: Reroll<BLOCK[]>,
    uphill: boolean,
    target: PlayerId,
    selectedOutcome: BLOCK,
    assistingPlayers: PlayerId[],
    push?: PushOutcome,
    knockdown: boolean,
    armor?: ArmorRoll,
}

export interface PushOutcome {
    pushChoices: Cell[],
    follow: boolean,
    skillsUsed: {
        player: PlayerId,
        skill: SKILL,
    }
}

export interface CasualtyRoll {}

export interface ArmorRoll {
    rollType: ROLL.Armor,
    roll: Reroll<number[]>,
    casualty?: CasualtyRoll,
}

export interface Reroll<R> {
    roll: R,
    reroll?: R,
    rerollSource: "team" | SKILL
}

export interface Roll {
    dice: number[],
    total: number,
}

export interface DiceModifier {
    skill?: SKILL,
    value?: number,
    cell?: Cell,
    type?: MODIFIER_TYPE,
}