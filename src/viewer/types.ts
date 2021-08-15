
import type * as BB2 from "../replay/BB2.js";
import type * as Internal from "../replay/Internal.js";
import type {
    ReplayPosition,
    ReplayPreview,
} from "../replay-utils.js";
import type { ProcessedReplay } from '../replay.js';
import type {
    SIDE,
    SITUATION,
} from "../constants.js";
import type {crossfade} from 'svelte/transition';
import type {Color} from 'chroma-js';

export type CrossFadeFn = ReturnType<typeof crossfade>[number];

export interface Dugout {
    cas: Internal.PlayerNumber[],
    ko: Internal.PlayerNumber[],
    reserve: Internal.PlayerNumber[],
}

export interface Team {
    logo: string,
    dugout: Dugout,
    score: number,
    name: string,
    turn: number,
    active: boolean,
    rerolls: {
        available: number,
        total: number,
    },
    inducements: {
        wizard: boolean,
        babes: number,
        apo: {
          available: number,
          total: number
        },
        chef: boolean,
        bribes: {
          available: number,
          total: number,
        },
        igor: boolean,
      },
}

export interface BallProps {
    held: boolean;
}

export interface CellProps {
    active: boolean;
    target: boolean;
    pushbackChoice: boolean;
    moved: boolean;
    plus?: number;
}

export interface BloodProps {
    blood: number;
}

export interface PitchCellProps {
    cell?: CellProps;
    dice?: number[];
    player?: Internal.PlayerNumber;
    ball?: BallProps;
    foul?: boolean;
    blood?: BloodProps;
}

export type Pitch = Map<string, PitchCellProps>;
export type PlayerStates = Map<Internal.PlayerNumber, Internal.PlayerState>;
export type PlayerDefinitions = Map<Internal.PlayerNumber, Internal.Player>;
export type PlayerProperties = Map<Internal.PlayerNumber, PlayerProps>;

export interface PlayerProps {
    blitz?: boolean;
    moving?: boolean;
    prone?: boolean;
    stunned?: boolean;
    stupidity?: string;
}

export interface WakeConditions {
    replayPreview: ReplayPreview | undefined,
    playing: boolean,
    replayTarget: number | undefined,
    replay: ProcessedReplay | undefined,
}

export interface Preview {
    teams: Internal.ByTeam<Team>,
    pitch: Map<string, PitchCellProps>,
    playerStates: PlayerStates,
    playerProperties: PlayerProperties,
    playing: boolean,
    current: number,
}

export interface Colors {
  color: Color;
  textColor: Color;
  oppColor: Color;
}