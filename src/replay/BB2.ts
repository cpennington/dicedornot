
import { ACTION_TYPE, RESULT_TYPE, ROLL, SUB_RESULT_TYPE, SIDE, ROLL_STATUS, RESULT_REQUEST_TYPE, ACTION_REQUEST_TYPE, RACE_ID, SITUATION, WAITING_REQUEST_TYPE, SKILL, WEATHER, PLAYER_TYPE, MODIFIER_TYPE } from "../constants.js";

export enum Bool {
    false = 0,
    true = 1,
}

export type Cell = {
    x?: number;
    y?: number;
} | "";

export type MList<T> = T | T[];
type UnMList<T> = T extends any[] ? T[number] : T;
export type KeyedMList<K extends string, T> = "" | { [key in K]: MList<T> };

export interface Inducement {
    InducementSave: MList<{
        Category: number
        Bonus?: number,
    }>
}

export interface PitchPlayer {
    CanDeclareBlitz?: Bool,//>1</CanDeclareBlitz>
    Gfi?: number,//>2</Gfi>
    Rooted?: Bool,
    Id: PlayerId,//>1</Id>
    Disabled?: Bool,
    ListUsedSkills?: string,
    CanBlock?: Bool,//>1</CanBlock>
    CanAct?: Bool,//>1</CanAct>
    Cell: Cell,
    CanHandOff?: Bool,//>1</CanHandOff>
    TackleZone?: Bool,//>1</TackleZone>
    MovePoint?: number,//>4</MovePoint>
    Status?: number,
    Data: {
        LobbyId?: string,//>RowId:52220269-Server:ONLINE-StoreName:Main</LobbyId>
        Ma: number,//>4</Ma>
        Name: string | number,//>blood</Name>
        Contract?: number,
        Value?: number,
        Ag: number,//>2</Ag>
        Number?: number,//>1</Number>
        Experience?: number,
        IdHead?: number,//>1</IdHead>
        ListCasualties?: string,
        Level?: number,
        TeamId?: 1,
        Av: number,//>9</Av>
        St: number,//>4</St>
        ListSkills?: string,//>(33,10,82,19)</ListSkills>
        Id: number,//>1</Id>
        IdPlayerTypes: number,//>93</IdPlayerTypes>
    },
    CanPass?: Bool,//>1</CanPass>
    HasJumpUp?: Bool,
    ListCasualties?: string,
    Situation?: SITUATION,
    ExperienceGained?: number,
    Statistics?: any,
}

export interface Mercenary {
    Category: number,
    PlayerId: PlayerId,
    PlayerType: number,
}

export interface TeamState {
    Igor?: Bool,
    GameTurn?: number,
    BribeNumber?: number,
    RerollNumber?: number,
    NecromancerAvailable?: Bool,
    ApothecaryNumber?: number,
    KickOffTurn: 0 | 1,
    IgorNumber?: number,
    HandOfferId: PlayerId,
    Touchdown?: number,
    FoulAvailable?: Bool,
    PasserId: PlayerId,
    BlitzerId: PlayerId,
    HalflingChef?: Bool,
    Wizard?: Bool,
    LeaderReroll?: number,
    Babes?: number,
    Fame?: number,
    WizardEndsTurn?: Bool,
    InducementsTurn?: 1,
    ListInducements: "" | MList<Inducement>,
    TeamRerollAvailable?: number,
    Bribes?: number,
    ListPitchPlayers: "" | KeyedMList<'PlayerState', PitchPlayer>,
    ListMercenaries: "" | { MercenarySave: MList<Mercenary> },
    SetUpTurn?: 1,
    NbSupporters: number, //>10000</NbSupporters>
    ListNewRotters?: string,
    Side?: SIDE.away, //>1</Side>
    ApothecaryAvailable: Bool, //>1</ApothecaryAvailable>
    Data: {
        LobbyId: string, // RowId:4484152-Server:ONLINE-StoreName:Main</LobbyId>
        Value: number, // 1090</Value>
        Cheerleaders?: number,
        AssistantCoaches?: number,
        TreasuryBeforeInducements?: number,
        Name: string, // Memeotaur Madness</Name>
        Popularity?: number, // 2</Popularity>
        Apothecary?: number, // 1</Apothecary>
        IdCheerleadersRace: number, // 1</IdCheerleadersRace>
        TeamId?: 1, // 1</TeamId>
        IdRace: RACE_ID, // 21</IdRace>
        Treasury?: number,
        Reroll: number, // 2</Reroll>
        Logo: string, // ChaosDwarf_04</Logo>
        CoachSlot?: 1, // 1</CoachSlot>
        TeamColor: number, // 2101110</TeamColor>
    }
}

export interface SkillInfo {
    SkillId: SKILL,
    PlayerId: PlayerId,
}

export interface BoardState {
    CampaignSpecifics: {
        ListDangerousCells: "" | {}[],
        ListPoisonnedPlayers: "" | {}[],
    },
    Bomb: {
        Cell: Cell,
        Destination: Cell,
    },
    ActiveTeam?: SIDE,
    Meteo?: WEATHER,
    Statistics?: any,
    CurrentPhase?: number,
    ListSecretWeapons?: string,
    ListTeams: { TeamState: TeamState[] },
    Ball: { Cell: Cell, Destination: Cell, IsHeld?: 1 },
    KickOffTeam?: SIDE | -1,
    StadiumStructure?: string,
};

export type PlayerId = number;

export interface CoachInfo {
    Slot?: 1,//>1</Slot>
    Login: string,//>EllYeahBrother</Login>
    UserId: string,//>EllYeahBrother</UserId>
}
export interface GameInfos {
    AnswerClock: number,//>-1</AnswerClock>
    ServerReconnectionAllowedTime: number,//>360000</ServerReconnectionAllowedTime>
    ClientDelayDetectionPingIntervall: number,//>3000</ClientDelayDetectionPingIntervall>
    TurnClockDuration: number,//>180000</TurnClockDuration>
    CoachesInfos: { CoachInfos: MList<CoachInfo> },
    Id: string,//>Coach-224326-54d295cfb07037fa13e580bd3e272df6</Id>
    LevelCabalVision?: number,//>1</LevelCabalVision>
    Clock: number,//>5600</Clock>
    LocalCoachSlot: number,//>-1</LocalCoachSlot>
    State: number,//>1</State>
    Stadium: string,//>Skaven</Stadium>
    NameStadium: string,//>The disease ward</NameStadium>
    LevelStadium: number,//>1</LevelStadium>
    StructStadium?: string,
    BallType: string,//>BALL_CLASSIC</BallType>
    TurnClock: number,//>120000</TurnClock>
    PlayingCoachSlot?: number,//>1</PlayingCoachSlot>
    ServerDelayDetectionThreshold: number,//>6000</ServerDelayDetectionThreshold>
    ClientReconnectionIntervall: number,//>20000</ClientReconnectionIntervall>
    RowLeague: {
        Edition?: number, //>1</Edition>
        IdOwner?: number, //>211063</IdOwner>
        Logo?: string, //>Neutre_01</Logo>
        Id: "" | {
            Value: string
        },
        Description?: string
        Phase?: number, //>1</Phase>
        Name?: string, //>RRL spin and win league</Name>
        Websites?: string, //>https://www.reddit.com/r/rebbrl/</Websites>
        NbRegisteredTeams?: number, //>4251</NbRegisteredTeams>
        Official?: Bool,
        TreasurySp?: number,
        Flags?: number, //>33</Flags>
    },
    RowCompetition: {
        IdPreviousEdition: "" | {
            Value: string, //>RowId:0-Server:ONLINE-StoreName:Main</Value>
        },
        IdOwner?: number, //>97356</IdOwner>
        Id: "" | {
            Value: string, //>RowId:61632-Server:ONLINE-StoreName:Main</Value>
        },
        LeaguePhase?: number, //>1</LeaguePhase>
        IdLeague: "" | {
            Value: string, //>RowId:25682-Server:ONLINE-StoreName:Main</Value>
        },
        PrematchEvents?: number, //>1</PrematchEvents>
        Flags?: number, //>33</Flags>
        IdCompetitionTypes?: number, //>3</IdCompetitionTypes>
        RegistrationMode?: number, //>1</RegistrationMode>
        NbRounds?: number,
        NbTeamsMax?: number,
        CompetitionStatus?: number, //>1</CompetitionStatus>
        Name?: string, //>RRL MM S2</Name>
        LeagueEdition?: number, //>1</LeagueEdition>
        CurrentRound?: number,
        NbRegisteredTeams?: number, //>3979</NbRegisteredTeams>
        AcceptTicketRequest?: 1, //>1</AcceptTicketRequest>
        TurnDuration?: number, //>2</TurnDuration>
    }
}
export interface Replay {
    ClientVersion: string,
    filename?: string,
    url?: string,
    ReplayStep: ReplayStep[],
}

export interface InducementPlayerData {
    Ma: number,
    Name: string,
    Ag: number,
    Contract: number,
    TeamId?: 1,
    Value: number,
    Av: number,
    St: number,
    ListSkills: string,
    IdPlayerTypes: number,
}

export interface InducementsCategory {
    Max: number,
    Cost: number,
    Type: number,
    Players?: "" | { PlayerData: MList<InducementPlayerData> },
}

export interface RulesEventInducementInfos {
    TeamInducements: {
        TeamInducements: MList<{
            InducementsCash?: number,
            InducementsCategories: "" | { InducementsCategory: MList<InducementsCategory> },
        }>,
    }
    FirstTeam?: 1,
}

export interface RulesEventAddInducement {
    Bonus?: number,
    InducementsCash?: number,
    CoachSlot: 0 | 1,
    InducementCategory: number,
    Treasury?: number,
}

export interface RulesEventRemoveInducement {
    Number?: number,
    InducementsCash?: number,
    InducementCategory: number,
    Treasury?: number,
}

export interface RulesEventAddMercenary {
    MercenaryId: PlayerId,
    MercenaryType: PLAYER_TYPE,
    InducementCategory: number,
    InducementsCash?: number,
    Treasury?: number,
    SkillCost?: number,
}

export interface RulesEventSetUpAction {
    PlayerPosition: Cell,
    NewPosition: Cell,
    ValidAction?: Bool,
    SetUpState: {
        ScrimmageValid?: Bool,
        BotWideZoneValid?: Bool,
        PlayersNumberValid?: Bool,
        TopWideZoneValid?: Bool,
        ValidSetup?: Bool,
    }
    Substitute?: PlayerId,
}

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>>
    & {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
    }[Keys];

type RequireOnlyOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>>
    & {
        [K in Keys]-?:
        Required<Pick<T, K>>
        & Partial<Record<Exclude<Keys, K>, undefined>>
    }[Keys];

export type RulesEventGameFinished = any;
export type RulesEventWaitingRequest = '' | { RequestType?: WAITING_REQUEST_TYPE, ConcernedTeam?: SIDE };
export interface RulesEventSetUpConfiguration {
    SetUpState: {
        ScrimmageValid?: Bool,
        BotWideZoneValid?: Bool,
        PlayersNumberValid?: Bool,
        TopWideZoneValid?: Bool,
        ValidSetup?: Bool,
    },
    ListPlayersPositions: {
        PlayerPosition: {
            PlayerId: PlayerId,
            Position: Cell,
        }[],
    }
}

export interface GameFinishedStep { RulesEventGameFinished: RulesEventGameFinished };
export interface AddInducementSkillStep {
    BoardState: BoardState,
    RulesEventAddInducementSkill: {
        Treasury?: number,
        MercenaryId: PlayerId,
        SkillId: SKILL
    }
};
export interface GameInfoStep {
    BoardState: BoardState,
    GameInfos: GameInfos,
    RulesEventWaitingRequest: RulesEventWaitingRequest,
};
export interface SetUpActionStep {
    BoardState: BoardState,
    RulesEventSetUpAction: RulesEventSetUpAction,
    RulesEventWaitingRequest: RulesEventWaitingRequest,
}
export interface SetUpConfigurationStep {
    BoardState: BoardState,
    RulesEventSetUpConfiguration: RulesEventSetUpConfiguration,
    RulesEventWaitingRequest: RulesEventWaitingRequest,
}
export interface GenPersonalityStep {
    BoardState: BoardState,
    RulesEventSetGeneratedPersonnalities: "",
}
export type AddInducementStep = RequireAtLeastOne<
    {
        RulesEventApplyInducements?: "" | {
            NextTeam?: 1,
            InducementValue?: number,
        },
        RulesEventAddMercenary?: MList<RulesEventAddMercenary>,
        RulesEventAddInducement?: RulesEventAddInducement,
        RulesEventRemoveInducement?: RulesEventRemoveInducement,
        RulesEventInducementsInfos?: RulesEventInducementInfos,
        RulesEventWaitingRequest?: RulesEventWaitingRequest,
    },
    'RulesEventApplyInducements' |
    'RulesEventAddMercenary' |
    'RulesEventAddInducement' |
    'RulesEventInducementsInfos' |
    'RulesEventRemoveInducement'
> & {
    BoardState: BoardState
};
export interface GameTurnStep {
    RulesEventEndTurn?: RulesEventEndTurn,
    RulesEventBoardAction?: MList<RulesEventBoardAction>,
    RulesEventKickOffTable?: RulesEventKickOffTable,
    RulesEventKickOffChoice?: "" | {
        ChosingTeam?: SIDE,
        KickOffTeam?: SIDE,
    },
    RulesEventForcedDices?: "",
    RulesEventCoachChoice?: "" | {
        IndexChosen: number
    }
    RulesEventSpecialAction?: RulesEventSpecialAction,
    RulesEventWaitingRequest?: RulesEventWaitingRequest,
    RulesEventKickOffEventCancelled?: {
        StadiumStructure: string,
        EventCancelled: number,
    },
    RulesEventLoadGame?: {
        BoardState: BoardState
    }
    BoardState: BoardState
};

export type ReplayStep =
    | GameFinishedStep
    | AddInducementSkillStep
    | GameInfoStep
    | SetUpActionStep
    | SetUpConfigurationStep
    | GenPersonalityStep
    | AddInducementStep
    | GameTurnStep

export interface RulesEventSpecialAction {
    PlayerId: PlayerId,
    ActionType: number,
}

export interface RulesEventKickOffTable {
    Event?: number
    EventResults: KeyedMList<"StringMessage", { Name: string, MessageData: string }>,
    ListDice: string,
}

export type KickoffEventMessageData = | PitchInvasionMessage
export interface PitchInvasionMessage {
    RulesEventPlayerInvaded: RulesEventPlayerInvaded,
}

export interface RulesEventPlayerInvaded {
    PlayerId: PlayerId,
    Die: number,
    Stunned?: number,
}

interface OrderT<F, T> extends BaseAction {
    Order: { CellFrom: F, CellTo: T }
}

interface NoOrderAction extends OrderT<"", ""> { }
interface OrderAction extends OrderT<Cell, { Cell: Cell }> { }

interface PlayerAction extends BaseAction {
    PlayerId?: PlayerId
}


// export function isDiceRollResult(result: BoardActionResult): result is DiceRollResult<R> {
//     return (result as DiceRollResult<R>).RollStatus !== undefined;
// }

export interface BaseResult {
    ResultType?: RESULT_TYPE,
    SubResultType?: SUB_RESULT_TYPE,
    IsOrderCompleted?: Bool,
    RequestType?: RESULT_REQUEST_TYPE,
    ListModifiers: "" | { DiceModifier: MList<DiceModifier> },
}

export interface Choices<S = Skills, C = Cells> extends BaseResult {
    CoachChoices: {
        ConcernedTeam?: 1,
        ListSkills: S,
        ListCells: C,
        Reroll?: 1,
    }
}

export interface DiceChoices<S extends Skills = Skills, C extends Cells = Cells> extends BaseResult {
    CoachChoices: {
        ConcernedTeam?: 1,
        ListSkills: S,
        ListCells: C,
        ListDices: Dices,
        Reroll?: 1,
    }
}

export type Dices = string | number;
export type Skills = KeyedMList<"SkillInfo", SkillInfo>;
export type Cells = KeyedMList<"Cell", Cell>;
interface NoChoicesResult extends BaseResult {
    IsOrderCompleted: 1,
    ListModifiers: "",
    CoachChoices: {
        ConcernedTeam?: 1,
        ListCells: "",
        ListSkills: Skills,
    }
};

export interface DiceModifier {
    Cell?: Cell,
    Skill?: -1 | SKILL,
    Type?: MODIFIER_TYPE,
    Value?: number
}
export interface RollResult<R> extends BaseResult {
    Requirement?: number,
    RollStatus?: ROLL_STATUS,
    RollType: R,
}

export interface DiceRollResult<R, S extends Skills = Skills, C extends Cells = Cells> extends RollResult<R>, DiceChoices<S, C> { }

// GFI = 1,
export type GFIResult = DiceRollResult<ROLL.GFI, Skills, "">;
// Dodge = 2,
export type DodgeResult = DiceRollResult<ROLL.Dodge>
export interface NoRollDodgeResult extends RollResult<ROLL.Dodge>, Choices<Skills, Cells> { };
// Armor = 3,
export type ArmorResult = DiceRollResult<ROLL.Armor, Skills, "">;
// Injury = 4,
export type InjuryResult = DiceRollResult<ROLL.Injury, Skills, "">;
// Block = 5,
export type BlockResult = DiceRollResult<ROLL.Block>;
// StandUp = 6,
export type StandUpResult = DiceRollResult<ROLL.StandUp, "", "">;
// Pickup = 7,
export type PickupResult = DiceRollResult<ROLL.Pickup, Skills, "">;
// Casualty = 8,
export type CasualtyResult = DiceRollResult<ROLL.Casualty, Skills, "">;
// Catch = 9,
export type CatchResult = DiceRollResult<ROLL.Catch, Skills, "">;
// KickoffScatter = 10,
export type KickoffScatterResult = DiceRollResult<ROLL.KickoffScatter>;
// ThrowIn = 11,
export type ThrowInResult = DiceRollResult<ROLL.ThrowIn, "">;
// Pass = 12,
export type PassResult = DiceRollResult<ROLL.Pass, Skills, Cells>;
// Push = 13,
export interface PushResult extends BaseResult, Choices { RollType: ROLL.Push };
// FollowUp = 14,
export interface FollowUpResult extends BaseResult, Choices {
    RollType: ROLL.FollowUp,
};
// FoulPenalty = 15,
export interface FoulRefResult extends BaseResult {
    CoachChoices: {
        ConcernedTeam?: 1,
        ListSkills: "",
        ListCells: "",
        ListDices?: Dices,
        Reroll?: Bool,
    }
    IsOrderCompleted?: 1,
    Requirement?: number,
    RollStatus?: ROLL_STATUS,
    RollType: ROLL.FoulPenalty,
}
// Interception = 16,
export type InterceptionResult = RollResult<ROLL.Interception> & Choices | DiceRollResult<ROLL.Interception>;
// WakeUp = 17,
export type WakeUpResult = DiceRollResult<ROLL.WakeUp, "", "">;
// TouchBack = 19,
export type TouchBackResult = RollResult<ROLL.TouchBack> & Choices<"">;
// BoneHead = 20,
// ReallyStupid = 21,
// WildAnimal = 22,
// TakeRoot = 40,
export type ActivationTestResult = DiceRollResult<ROLL.BoneHead | ROLL.ReallyStupid | ROLL.WildAnimal | ROLL.TakeRoot, Skills, "">;
// Loner = 23,
export type LonerResult = DiceRollResult<ROLL.Loner, Skills, "">;
// Landing = 24,
export type LandingResult = DiceRollResult<ROLL.Landing, "", "">;
// Regeneration = 25,
export type RegenerationResult = DiceRollResult<ROLL.Regeneration, Skills, "">;
// InaccuratePassScatter = 26,
export type InaccuratePassScatterResult = DiceRollResult<ROLL.InaccuratePassScatter>;
// AlwaysHungry = 27,
export type AlwaysHungryResult = DiceRollResult<ROLL.AlwaysHungry, Skills, "">;
// EatTeammate = 28,
export type EatTeammateResult = DiceRollResult<ROLL.EatTeammate, Skills, "">;
// Dauntless = 29,
export type DauntlessResult = DiceRollResult<ROLL.Dauntless, Skills, "">;
// SafeThrow = 30,
export type SafeThrowResult = DiceRollResult<ROLL.SafeThrow>;
// JumpUp = 31,
export type JumpUpResult = DiceRollResult<ROLL.JumpUp, Skills, "">;
// Shadowing = 32,
export type ShadowingResult = RollResult<ROLL.Shadowing> & Choices<"", Cells> | DiceRollResult<ROLL.Shadowing>;
// Stab = 34,
export type StabResult = DiceRollResult<ROLL.Stab, Skills, "">;
// Leap = 36,
export type LeapResult = DiceRollResult<ROLL.Leap, Skills, "">;
// FoulAppearance = 37,
export type FoulAppearanceResult = DiceRollResult<ROLL.FoulAppearance, Skills, "">;
// Tentacles = 38,
export type TentaclesResult = DiceRollResult<ROLL.Tentacles, Skills, "">;
// ChainsawKickback = 39,
export type ChainsawKickbackResult = DiceRollResult<ROLL.ChainsawKickback, Skills, "">;
// BallAndChain = 41,
export type BallAndChainResult = DiceRollResult<ROLL.BallAndChain>;
// HailMaryPass = 42,
export type HailMaryPassResult = DiceRollResult<ROLL.HailMaryPass>;
// DivingTackle = 44,
export type DivingTackleResult = DiceRollResult<ROLL.DivingTackle>;
// Pro = 45,
export type ProResult = DiceRollResult<ROLL.Pro, "", "">;
// HypnoticGaze = 46,
export type HypnoticGazeResult = DiceRollResult<ROLL.HypnoticGaze>;
// Animosity = 49,
export type AnimosityResult = DiceRollResult<ROLL.Animosity>;
// Bloodlust = 50,
export type BloodlustResult = DiceRollResult<ROLL.Bloodlust>;
// Bite = 51,
export type BiteResult = DiceRollResult<ROLL.Bite, Skills, Cells>;
// Bribe = 52,
export type BribeResult = DiceRollResult<ROLL.Bribe, "", "">;
// HalflingChef = 53,
export type HalflingChefResult = RollResult<ROLL.HalflingChef> & Choices<"", ""> | DiceRollResult<ROLL.HalflingChef, "", "">;
// Fireball = 54,
export type FireballResult = DiceRollResult<ROLL.Fireball, "", "">;
// LightningBolt = 55,
export type LightningBoltResult = DiceRollResult<ROLL.LightningBolt, "", "">;
// ThrowTeammate = 56,
export type ThrowTeammateResult = DiceRollResult<ROLL.ThrowTeammate>;
// Multiblock = 57,
export type MultiblockResult = RollResult<ROLL.Multiblock> & Choices<"", Cells>;
// KickoffGust = 58,
export type KickoffGustResult = DiceRollResult<ROLL.KickoffGust, "">;
// PileOnArmorRoll = 59,
export interface CompletePOArmorResult extends BaseResult, Choices {
    IsOrderCompleted: 1,
    Requirement?: number,
    RollStatus?: ROLL_STATUS,
    RollType: ROLL.PileOnArmorRoll,
}
export type POArmorResult = DiceRollResult<ROLL.PileOnArmorRoll> | CompletePOArmorResult;
// PileOnInjuryRoll = 60,
export interface CompletePOInjuryResult extends BaseResult, Choices {
    IsOrderCompleted: 1,
    Requirement?: number,
    RollStatus?: ROLL_STATUS,
    RollType: ROLL.PileOnInjuryRoll,
}
export type POInjuryResult = DiceRollResult<ROLL.PileOnInjuryRoll> | CompletePOInjuryResult;
// Wrestle2 = 61, // Some sort of wrestle roll that doesn't do anything,
export type WrestleResult = DiceRollResult<ROLL.Wrestle2>;
// DodgePick = 62,
export type DodgePickResult = DiceRollResult<ROLL.DodgePick>
// StandFirm = 63,
export type StandFirmResult = DiceRollResult<ROLL.StandFirm>;
// Juggernaut = 64,
export type JuggernautResult = DiceRollResult<ROLL.Juggernaut>;
// StandFirm2 = 65,
export type StandFirm2Result = DiceRollResult<ROLL.StandFirm2>;
// RaiseDead = 66,
export type RaiseDeadResult = RollResult<ROLL.RaiseDead> & Choices<"", "">;
// Fans = 69,
export type FansResult = DiceRollResult<ROLL.Fans, "", "">;
// Weather = 70,
export type WeatherResult = DiceRollResult<ROLL.Weather, "", "">;
// SwealteringHeat = 71,
export type SwealteringHeatResult = DiceRollResult<ROLL.SwealteringHeat, "", "">;
// BombKD = 72,
export type BombKDResult = DiceRollResult<ROLL.BombKD, "", "">;
// ChainsawArmor = 73,
export type ChainsawArmorResult = DiceRollResult<ROLL.ChainsawArmor, "", "">;

export type PitchInvasionResult = {};

interface BaseAction {
    RequestType?: ACTION_REQUEST_TYPE,
}
export interface ResultsAction<T> extends BaseAction {
    Results: KeyedMList<"BoardActionResult", T>
}

export type ActionResult<A extends RulesEventBoardAction> = UnMList<Exclude<A["Results"], "">["BoardActionResult"]>;

// Move = 0, //Move
export type MoveResults = NoChoicesResult | DodgeResult | DodgePickResult | NoRollDodgeResult | GFIResult | LonerResult | StandUpResult | DivingTackleResult | TentaclesResult;
export interface MoveAction extends PlayerAction, OrderAction, ResultsAction<MoveResults> { }
// Block = 1, //Block
export type BlockResults = BlockResult | PushResult | FollowUpResult | FoulAppearanceResult | DauntlessResult | StandFirmResult | WrestleResult | LonerResult | DodgePickResult | ChainsawKickbackResult | JumpUpResult;
export interface BlockAction extends PlayerAction, OrderAction, ResultsAction<BlockResults> { ActionType: ACTION_TYPE.Block }
// Blitz = 2, //Blitz
export type BlitzResults = DodgePickResult | BlockResult | PushResult | FollowUpResult | FoulAppearanceResult | DauntlessResult | StandFirmResult | WrestleResult | LonerResult | NoChoicesResult | DodgeResult | NoRollDodgeResult | GFIResult | LonerResult | StandUpResult | DivingTackleResult | JuggernautResult | TentaclesResult | ChainsawKickbackResult;
export interface BlitzAction extends PlayerAction, OrderAction, ResultsAction<BlitzResults> { ActionType: ACTION_TYPE.Blitz }
// Pass = 3, //Pass
export interface PassAction extends PlayerAction, OrderT<Cell, { Cell: MList<Cell> }>, ResultsAction<PassResult | InterceptionResult | SafeThrowResult | LonerResult | AnimosityResult | AlwaysHungryResult | ThrowTeammateResult | InaccuratePassScatterResult | EatTeammateResult> { ActionType: ACTION_TYPE.Pass }
// Handoff = 4, //Ball handoff
export interface HandoffAction extends PlayerAction, OrderAction, ResultsAction<NoChoicesResult | AnimosityResult> { ActionType: ACTION_TYPE.Handoff }
// Foul = 5, //Foul
export interface FoulAction extends OrderAction, PlayerAction, ResultsAction<NoChoicesResult | ArmorResult | InjuryResult | CasualtyResult | RegenerationResult> { ActionType: ACTION_TYPE.Foul }

// TakeDamage = 6, //Armor
type TakeDamageResults = ArmorResult | InjuryResult | CasualtyResult | RegenerationResult | POArmorResult | POInjuryResult | ChainsawArmorResult | RaiseDeadResult;
export interface TakeDamageAction extends PlayerAction, OrderT<Cell, { Cell: "" | MList<Cell> }>, ResultsAction<TakeDamageResults> { ActionType: ACTION_TYPE.TakeDamage }
// Kickoff = 7, //Pick Kickoff Location
export interface KickoffAction extends PlayerAction, OrderAction, ResultsAction<NoChoicesResult> { ActionType: ACTION_TYPE.KickoffTarget }
// Scatter = 8, //Pick Kickoff Scatter KickSkill
export interface ScatterAction extends PlayerAction, OrderT<Cell, { Cell: Cell }>, ResultsAction<KickoffScatterResult | ThrowInResult | TouchBackResult | KickoffGustResult> { ActionType: ACTION_TYPE.KickoffScatter };
// Catch = 9, //Catch
export interface CatchAction extends PlayerAction, OrderAction, ResultsAction<CatchResult | LonerResult> { ActionType: ACTION_TYPE.Catch }
// TouchDown = 10, //Touchdown?
export interface TouchDownAction extends PlayerAction, OrderAction, ResultsAction<NoChoicesResult> { ActionType: ACTION_TYPE.TouchDown };
// StunWake = 11, //End Turn Stun release?
export interface StunWakeAction extends PlayerAction, OrderAction, ResultsAction<NoChoicesResult> { ActionType: ACTION_TYPE.StunWake }
// WakeUp = 12, //Wake up after KO
export interface WakeUpAction extends PlayerAction, OrderAction, ResultsAction<WakeUpResult> { ActionType: ACTION_TYPE.WakeUp }
// EventPitchInv = 13,
export interface PitchInvasionAction extends PlayerAction, NoOrderAction, ResultsAction<NoChoicesResult> { ActionType: ACTION_TYPE.EventPitchInv }
// Pickup = 14, //Pickup Ball
export interface PickupAction extends PlayerAction, OrderAction, ResultsAction<PickupResult | LonerResult> { ActionType: ACTION_TYPE.Pickup }
// ActivationTest = 15, //Activation Test
export interface ActivationTestAction extends PlayerAction, OrderAction, ResultsAction<ActivationTestResult | LonerResult> { ActionType: ACTION_TYPE.ActivationTest }
// Landing = 16,
export interface LandingAction extends PlayerAction, OrderAction, ResultsAction<LandingResult> { ActionType: ACTION_TYPE.Landing }
// EatTeamMate = 17,
export interface EatTeamMateAction extends PlayerAction, OrderAction, ResultsAction<EatTeammateResult> { ActionType: ACTION_TYPE.EatTeamMate }
// Shadowing = 18,
export interface ShadowingAction extends PlayerAction, OrderT<Cell, { Cell: Cell }>, ResultsAction<ShadowingResult | NoChoicesResult> { ActionType: ACTION_TYPE.Shadowing }
// Stab = 19,
// FrenzyStab = 20,
export interface StabAction extends PlayerAction, OrderAction, ResultsAction<StabResult> { ActionType: ACTION_TYPE.Stab | ACTION_TYPE.FrenzyStab }

// Leap = 21,
export type LeapResults = LeapResult | LonerResult | GFIResult;
export interface LeapAction extends PlayerAction, OrderAction, ResultsAction<LeapResults> { ActionType: ACTION_TYPE.Leap }
// Chainsaw = 22,
export interface ChainsawAction extends PlayerAction, OrderAction, ResultsAction<ChainsawArmorResult | ChainsawKickbackResult | LonerResult> { ActionType: ACTION_TYPE.Chainsaw }
// BallChain = 23,
export interface BallChainAction extends PlayerAction, OrderAction, ResultsAction<BallAndChainResult> { ActionType: ACTION_TYPE.BallChain }
// HailMaryPass = 24,
export interface HailMaryPassAction extends PlayerAction, OrderAction, ResultsAction<HailMaryPassResult> { ActionType: ACTION_TYPE.HailMaryPass }
// PilingOn = 25,
export interface PilingOnAction extends PlayerAction, OrderAction, ResultsAction<TakeDamageResults> { ActionType: ACTION_TYPE.PilingOn }
// MultiBlock = 26,
export interface MultiBlockAction extends PlayerAction, OrderT<Cell, "" | { Cell: Cell }>, ResultsAction<MultiblockResult | ProResult | BlockResult | PushResult | FollowUpResult | FoulAppearanceResult | DauntlessResult | StandFirmResult | WrestleResult | LonerResult | DodgePickResult> { ActionType: ACTION_TYPE.MultiBlock }
// HypnoticGaze = 27,
export interface HypnoticGazeAction extends PlayerAction, OrderAction, ResultsAction<HypnoticGazeResult | ProResult> { ActionType: ACTION_TYPE.HypnoticGaze }
// KickOffReturn = 28,
export interface KickOffReturnAction extends PlayerAction, OrderAction, ResultsAction<NoChoicesResult> { ActionType: ACTION_TYPE.KickOffReturn }
// PassBlock = 29,
export interface PassBlockAction extends PlayerAction, OrderAction, ResultsAction<NoChoicesResult> { ActionType: ACTION_TYPE.PassBlock }
// HalflingChef = 30,
export interface HalflingChefAction extends NoOrderAction, ResultsAction<HalflingChefResult> { ActionType: ACTION_TYPE.HalflingChef }
// WizardFireBallCast = 31,
export interface WizardFireBallCastAction extends PlayerAction, OrderT<"", { Cell: Cell }>, ResultsAction<NoChoicesResult> { ActionType: ACTION_TYPE.WizardFireBallCast }
// WizardFireball = 32,
export interface WizardFireballAction extends PlayerAction, OrderAction, ResultsAction<FireballResult> { ActionType: ACTION_TYPE.WizardFireball }
// WizardLightning = 33, //Wizard Lightning
export interface WizardLightningAction extends PlayerAction, OrderT<"", { Cell: Cell }>, ResultsAction<LightningBoltResult> { ActionType: ACTION_TYPE.WizardLightning }
// FoulRefCheck = 34, //Foul - Comes After Armor roll - maybe ref?
export interface FoulRefCheckAction extends OrderAction, PlayerAction, ResultsAction<FoulRefResult | BribeResult> { ActionType: ACTION_TYPE.FoulRefCheck }
// ScatterPlayer = 35,
// QuickSnap = 36,
// FreeMove = 37, //Move after High Kick
export interface FreeMoveAction extends PlayerAction, OrderAction, ResultsAction<NoChoicesResult> { ActionType: ACTION_TYPE.FreeMove };
// DumpOff = 38,
// DodgeAgDivingTackle = 39,
export interface DodgeAgDivingTackleAction extends PlayerAction, OrderAction, ResultsAction<DodgeResult> { ActionType: ACTION_TYPE.DodgeAgDivingTackle };
// ThrowTeamMate = 40,
// MultiStab = 41,
// ActivatePlayer = 42, //Select Active Player
export interface ActivatePlayerAction extends PlayerAction, OrderAction, ResultsAction<NoChoicesResult> { ActionType: ACTION_TYPE.ActivatePlayer };
// PassBlockMoveLeap = 43,
// PassBlockLeapMove = 44,
// PassBlockLeap = 45,
// FansNumber = 46, //After Kickoff Choice, has 2 BoardActionResults with RT 69
export interface FansAction extends NoOrderAction, ResultsAction<FansResult> { ActionType: ACTION_TYPE.FansNumber };
// InitialWeather = 47, //After Kickoff Choice, has 1 BoardActionResult with RT 70
export interface WeatherAction extends NoOrderAction, ResultsAction<WeatherResult> { ActionType: ACTION_TYPE.InitialWeather }
// SwelteringHeat = 48,
export interface SwealteringHeatAction extends PlayerAction, NoOrderAction, ResultsAction<SwealteringHeatResult> { ActionType: ACTION_TYPE.SwelteringHeat }
// Feed = 49,
// BombKnockDown = 50,
// BombHalfDown = 51,
// BombThrow = 52,
// BombCatch = 53,
// BombScatter = 54, // (Bomb) Scatter after HailMary pass ?
// BombThrowDestination = 55, // Pick the throw destination after a Bomb Catch(Intercept?)
// HailMaryBomb = 56,
// Turnover = 58,
export interface TurnoverAction extends ResultsAction<NoChoicesResult> {
    ActionType: ACTION_TYPE.Turnover,
    Turnover?: Bool
}

export type RulesEventBoardAction =
    | MoveAction
    | BlockAction
    | BlitzAction
    | PassAction
    | HandoffAction
    | FoulAction
    | TakeDamageAction
    | KickoffAction
    | ScatterAction
    | CatchAction
    | TouchDownAction
    | StunWakeAction
    | WakeUpAction
    // | PitchInvasionAction
    | PickupAction
    | ActivationTestAction
    | LandingAction
    | EatTeamMateAction
    | ShadowingAction
    | StabAction
    | LeapAction
    | ChainsawAction
    | BallChainAction
    | HailMaryPassAction
    | PilingOnAction
    | MultiBlockAction
    | HypnoticGazeAction
    | KickOffReturnAction
    | PassBlockAction
    | HalflingChefAction
    | WizardFireBallCastAction
    | WizardFireballAction
    | WizardLightningAction
    | FoulRefCheckAction
    | FreeMoveAction
    | DodgeAgDivingTackleAction
    | ActivatePlayerAction
    | FansAction
    | WeatherAction
    | SwealteringHeatAction
// | TurnoverAction

// export type BoardActionResult = DiceRollResult | CellChoiceResult | NoChoicesResult | KickoffScatterResult

export interface RulesEventEndTurn {
    PlayingTeam?: 1,
    TouchdownScorer?: PlayerId,
    ListTeamInfos: "",
    NewDrive?: Bool,
    Turnover?: 1,
    NextTurnType?: 1 | 2,
    NextPhase?: 6
}

export function playerIdSide(id: PlayerId): SIDE {
    return id < 21 ? SIDE.home : SIDE.away;
}