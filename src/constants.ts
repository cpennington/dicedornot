export enum SKILL {
  StripBall = 1,
  IncreaseStrength = 2,
  IncreaseAgility = 3,
  IncreaseMovement = 4,
  IncreaseArmour = 5,
  Catch = 6,
  Dodge = 7,
  Sprint = 8,
  PassBlock = 9,
  FoulAppearance = 10,
  Leap = 11,
  ExtraArms = 12,
  MightyBlow = 13,
  Leader = 14,
  Horns = 15,
  TwoHeads = 16,
  StandFirm = 17,
  AlwaysHungry = 18,
  Regeneration = 19,
  TakeRoot = 20,
  Accurate = 21,
  BreakTackle = 22,
  SneakyGit = 23,
  Chainsaw = 25,
  Dauntless = 26,
  DirtyPlayer = 27,
  DivingCatch = 28,
  DumpOff = 29,
  Block = 30,
  BoneHead = 31,
  VeryLongLegs = 32,
  DisturbingPresence = 33,
  DivingTackle = 34,
  Fend = 35,
  Frenzy = 36,
  Grab = 37,
  Guard = 38,
  HailMaryPass = 39,
  Juggernaut = 40,
  JumpUp = 41,
  Loner = 44,
  NervesOfSteel = 45,
  NoHands = 46,
  Pass = 47,
  PilingOn = 48,
  PrehensileTail = 49,
  Pro = 50,
  ReallyStupid = 51,
  RightStuff = 52,
  SafeThrow = 53,
  SecretWeapon = 54,
  Shadowing = 55,
  SideStep = 56,
  Tackle = 57,
  StrongArm = 58,
  Stunty = 59,
  SureFeet = 60,
  SureHands = 61, // Shows up on the second roll (the automatic reroll)
  ThickSkull = 63,
  ThrowTeamMate = 64,
  Unknown_65 = 65, // ??
  WildAnimal = 67,
  Wrestle = 68,
  Tentacles = 69,
  MultipleBlock = 70,
  Kick = 71,
  KickOffReturn = 72,
  BigHand = 74,
  Claw = 75,
  BallAndChain = 76,
  Stab = 77,
  HypnoticGaze = 78,
  Stakes = 79,
  Bombardier = 80,
  Decay = 81,
  NurglesRot = 82,
  Titchy = 83,
  BloodLust = 84,
  FanFavourite = 85,
  Animosity = 86
};

export const SKILL_CATEGORY: Record<SKILL, string> = {
  [SKILL.Accurate]: 'P',
  [SKILL.AlwaysHungry]: 'E',
  [SKILL.Animosity]: 'E',
  [SKILL.BallAndChain]: 'E',
  [SKILL.BigHand]: 'M',
  [SKILL.Block]: 'G',
  [SKILL.BloodLust]: 'E',
  [SKILL.Bombardier]: 'E',
  [SKILL.BoneHead]: 'E',
  [SKILL.BreakTackle]: 'S',
  [SKILL.Catch]: 'A',
  [SKILL.Chainsaw]: 'E',
  [SKILL.Claw]: 'M',
  [SKILL.Dauntless]: 'G',
  [SKILL.Decay]: 'E',
  [SKILL.DirtyPlayer]: 'G',
  [SKILL.DisturbingPresence]: 'M',
  [SKILL.DivingCatch]: 'A',
  [SKILL.DivingTackle]: 'A',
  [SKILL.Dodge]: 'A',
  [SKILL.DumpOff]: 'P',
  [SKILL.ExtraArms]: 'M',
  [SKILL.FanFavourite]: 'E',
  [SKILL.Fend]: 'G',
  [SKILL.FoulAppearance]: 'M',
  [SKILL.Frenzy]: 'G',
  [SKILL.Grab]: 'S',
  [SKILL.Guard]: 'S',
  [SKILL.HailMaryPass]: 'P',
  [SKILL.Horns]: 'M',
  [SKILL.HypnoticGaze]: 'E',
  [SKILL.Juggernaut]: 'S',
  [SKILL.JumpUp]: 'A',
  [SKILL.Kick]: 'G',
  [SKILL.KickOffReturn]: 'G',
  [SKILL.Leader]: 'P',
  [SKILL.Leap]: 'A',
  [SKILL.Loner]: 'E',
  [SKILL.MightyBlow]: 'S',
  [SKILL.MultipleBlock]: 'S',
  [SKILL.NervesOfSteel]: 'P',
  [SKILL.NoHands]: 'E',
  [SKILL.NurglesRot]: 'E',
  [SKILL.Pass]: 'P',
  [SKILL.PassBlock]: 'G',
  [SKILL.PilingOn]: 'S',
  [SKILL.PrehensileTail]: 'M',
  [SKILL.Pro]: 'G',
  [SKILL.ReallyStupid]: 'E',
  [SKILL.Regeneration]: 'E',
  [SKILL.RightStuff]: 'E',
  [SKILL.SafeThrow]: 'P',
  [SKILL.SecretWeapon]: 'E',
  [SKILL.Shadowing]: 'G',
  [SKILL.SideStep]: 'A',
  [SKILL.SneakyGit]: 'A',
  [SKILL.Sprint]: 'A',
  [SKILL.Stab]: 'E',
  [SKILL.Stakes]: 'E',
  [SKILL.StandFirm]: 'S',
  [SKILL.StripBall]: 'G',
  [SKILL.StrongArm]: 'S',
  [SKILL.Stunty]: 'E',
  [SKILL.SureFeet]: 'A',
  [SKILL.SureHands]: 'G',
  [SKILL.Tackle]: 'G',
  [SKILL.TakeRoot]: 'E',
  [SKILL.Tentacles]: 'M',
  [SKILL.ThickSkull]: 'S',
  [SKILL.ThrowTeamMate]: 'E',
  [SKILL.Titchy]: 'E',
  [SKILL.TwoHeads]: 'M',
  [SKILL.VeryLongLegs]: 'M',
  [SKILL.WildAnimal]: 'E',
  [SKILL.Wrestle]: 'G',
  [SKILL.Unknown_65]: 'E',
  [SKILL.IncreaseStrength]: 'E',
  [SKILL.IncreaseAgility]: 'E',
  [SKILL.IncreaseMovement]: 'E',
  [SKILL.IncreaseArmour]: 'E',
}

export const SKILL_NAME: Record<SKILL, string> = {
  [SKILL.StripBall]: 'Strip Ball',
  [SKILL.IncreaseStrength]: 'ST+',
  [SKILL.IncreaseAgility]: 'AG+',
  [SKILL.IncreaseMovement]: 'MA+',
  [SKILL.IncreaseArmour]: 'AV+',
  [SKILL.Catch]: 'Catch',
  [SKILL.Dodge]: 'Dodge',
  [SKILL.Sprint]: 'Sprint',
  [SKILL.PassBlock]: 'Pass Block',
  [SKILL.FoulAppearance]: 'Foul Appearance',
  [SKILL.Leap]: 'Leap',
  [SKILL.ExtraArms]: 'Extra Arms',
  [SKILL.MightyBlow]: 'Mighty Blow',
  [SKILL.Leader]: 'Leader',
  [SKILL.Horns]: 'Horns',
  [SKILL.TwoHeads]: 'Two-Heads',
  [SKILL.StandFirm]: 'Stand Firm',
  [SKILL.AlwaysHungry]: 'Always Hungry',
  [SKILL.Regeneration]: 'Regeneration',
  [SKILL.TakeRoot]: 'Take Root',
  [SKILL.Accurate]: 'Accurate',
  [SKILL.BreakTackle]: 'Break Tackle',
  [SKILL.SneakyGit]: 'Sneaky Git',
  [SKILL.Chainsaw]: 'Chainsaw',
  [SKILL.Dauntless]: 'Dauntless',
  [SKILL.DirtyPlayer]: 'Dirty Player',
  [SKILL.DivingCatch]: 'Diving Catch',
  [SKILL.DumpOff]: 'Dump-Off',
  [SKILL.Block]: 'Block',
  [SKILL.BoneHead]: 'Bone-Head',
  [SKILL.VeryLongLegs]: 'Very Long Legs',
  [SKILL.DisturbingPresence]: 'Disturbing Presence',
  [SKILL.DivingTackle]: 'Diving Tackle',
  [SKILL.Fend]: 'Fend',
  [SKILL.Frenzy]: 'Frenzy',
  [SKILL.Grab]: 'Grab',
  [SKILL.Guard]: 'Guard',
  [SKILL.HailMaryPass]: 'Hail-Mary Pass',
  [SKILL.Juggernaut]: 'Juggernaut',
  [SKILL.JumpUp]: 'Jump-Up',
  [SKILL.Loner]: 'Loner',
  [SKILL.NervesOfSteel]: 'Nerves Of Steel',
  [SKILL.NoHands]: 'No Hands',
  [SKILL.Pass]: 'Pass',
  [SKILL.PilingOn]: 'Piling On',
  [SKILL.PrehensileTail]: 'Prehensile Tail',
  [SKILL.Pro]: 'Pro',
  [SKILL.ReallyStupid]: 'Really Stupid',
  [SKILL.RightStuff]: 'Right Stuff',
  [SKILL.SafeThrow]: 'Safe Throw',
  [SKILL.SecretWeapon]: 'Secret Weapon',
  [SKILL.Shadowing]: 'Shadowing',
  [SKILL.SideStep]: 'Side Step',
  [SKILL.Tackle]: 'Tackle',
  [SKILL.StrongArm]: 'Strong Arm',
  [SKILL.Stunty]: 'Stunty',
  [SKILL.SureFeet]: 'Sure Feet',
  [SKILL.SureHands]: 'Sure Hands',
  [SKILL.ThickSkull]: 'Thick Skull',
  [SKILL.ThrowTeamMate]: 'Throw Team Mate',
  [SKILL.WildAnimal]: 'Wild Animal',
  [SKILL.Wrestle]: 'Wrestle',
  [SKILL.Tentacles]: 'Tentacles',
  [SKILL.MultipleBlock]: 'Multiple Block',
  [SKILL.Kick]: 'Kick',
  [SKILL.KickOffReturn]: 'Kick-Off Return',
  [SKILL.BigHand]: 'Big Hand',
  [SKILL.Claw]: 'Claw',
  [SKILL.BallAndChain]: 'Ball and Chain',
  [SKILL.Stab]: 'Stab',
  [SKILL.HypnoticGaze]: 'Hypnotic Gaze',
  [SKILL.Stakes]: 'Stakes',
  [SKILL.Bombardier]: 'Bombardier',
  [SKILL.Decay]: 'Decay',
  [SKILL.NurglesRot]: 'Nurgles Rot',
  [SKILL.Titchy]: 'Titchy',
  [SKILL.BloodLust]: 'Blood-Lust',
  [SKILL.FanFavourite]: 'Fan Favourite',
  [SKILL.Animosity]: 'Animosity',
  [SKILL.Unknown_65]: 'Unknown Skill 65',
};

export const SKILL_CSS: Record<string, string> = Object.fromEntries(
  Object.entries(SKILL).map(([key, value]) => [value.toString(), key])
);

export enum SITUATION {
  Active = 0,
  Reserves = 1,
  KO = 2,
  Casualty = 4,
  SentOff = 5,
};

export const BLOCK_OUTCOME = {
  AtDownDeInPlace: 0,
  AtDownDeDown: 1,
  WrestleDown: 2, //Before use wrestle choice!
  AtInPlaceDeInPlace: 3,
  AtMoveDePush: 4,
  AtInPlaceDeDown: 5, //block down De in Place -> Fend has no 2nd dice afterpush?
  AtMoveDePushDown: 6
};

export enum RESULT_REQUEST_TYPE {
  // Unknown_0 = 0,
  ForCoach = 1, //Coach / Player,
  Unknown_2 = 2,
  PushFollow = 3,
  UseSkillReroll = 4, // Use a Skill-reroll?
  // Unknown_7 = 7,
  // Unknown_8 = 8,
  // Unknown_13 = 13,
  Unknown_5 = 5,
};

export enum ACTION_REQUEST_TYPE {
  // Unknown_0 = 0,
  ForCoach = 1, //Coach / Player,
  // Unknown_2 = 2,
  // PushFollow = 3,
  // UseSkillReroll = 4, // Use a Skill-reroll?
  // Unknown_7 = 7,
  // Unknown_8 = 8,
  // Unknown_13 = 13,

}

export enum WAITING_REQUEST_TYPE {
  // Unknown_0 = 0,
  // ForCoach = 1, //Coach / Player,
  // Unknown_2 = 2,
  // PushFollow = 3,
  // UseSkillReroll = 4, // Use a Skill-reroll?
  // Unknown_7 = 7,
  // Unknown_8 = 8,
  // Unknown_13 = 13,

}

export enum ROLL_STATUS {
  NoStatus = 0,
  RerollTaken = 1,
  RerollNotTaken = 2,
  RerollWithSkill = 3,
  RerollWithSkillChoice = 4,
  RerollWithFailedOutcome = 5,
};

export enum WEATHER {
  Nice = 0,
  SwelteringHeat = 1,
  VerySunny = 2,
  PouringRain = 3,
  Blizzard = 4,
};

export enum ACTION_TYPE {
  Move = 0, //Move
  Block = 1, //Block
  Blitz = 2, //Blitz
  Pass = 3, //Pass
  Handoff = 4, //Ball handoff
  Foul = 5, //Foul
  TakeDamage = 6, //Armor
  KickoffTarget = 7, //Pick Kickoff Location
  KickoffScatter = 8, //Pick Kickoff Scatter KickSkill
  Catch = 9, //Catch
  TouchDown = 10, //Touchdown?
  StunWake = 11, //End Turn Stun release?
  WakeUp = 12, //Wake up after KO
  EventPitchInv = 13,
  Pickup = 14, //Pickup Ball
  ActivationTest = 15, //Activation Test
  Landing = 16,
  EatTeamMate = 17,
  Shadowing = 18,
  Stab = 19,
  FrenzyStab = 20,
  Leap = 21,
  Chainsaw = 22,
  BallChain = 23,
  HailMaryPass = 24,
  PilingOn = 25,
  MultiBlock = 26,
  HypnoticGaze = 27,
  KickOffReturn = 28,
  PassBlock = 29,
  HalflingChef = 30,
  WizardFireBallCast = 31,
  WizardFireball = 32,
  WizardLightning = 33, //Wizard Lightning
  FoulRefCheck = 34, //Foul - Comes After Armor roll - maybe ref?
  ScatterPlayer = 35,
  QuickSnap = 36,
  FreeMove = 37, //Move after High Kick
  DumpOff = 38,
  DodgeAgDivingTackle = 39,
  ThrowTeamMate = 40,
  MultiStab = 41,
  ActivatePlayer = 42, //Select Active Player
  PassBlockMoveLeap = 43,
  PassBlockLeapMove = 44,
  PassBlockLeap = 45,
  FansNumber = 46, //After Kickoff Choice, has 2 BoardActionResults with RT 69
  InitialWeather = 47, //After Kickoff Choice, has 1 BoardActionResult with RT 70
  SwelteringHeat = 48,
  Feed = 49,
  BombKnockDown = 50,
  BombHalfDown = 51,
  BombThrow = 52,
  BombCatch = 53,
  BombScatter = 54, // (Bomb) Scatter after HailMary pass ?
  BombThrowDestination = 55, // Pick the throw destination after a Bomb Catch(Intercept?)
  HailMaryBomb = 56,
  Turnover = 58,
};

export enum KICKOFF_RESULT {
  GetTheRef = 2,
  Riot = 3,
  PerfectDefence = 4,
  HighKick = 5,
  CheeringFans = 6,
  ChangingWeather = 7,
  BrilliantCoaching = 8,
  QuickSnap = 9,
  Blitz = 10,
  ThrowARock = 11,
  PitchInvasion = 12,
}

export const KICKOFF_RESULT_NAMES = {
  [KICKOFF_RESULT.GetTheRef]: "Get The Ref",
  [KICKOFF_RESULT.Riot]: "Riot",
  [KICKOFF_RESULT.PerfectDefence]: "Perfect Defence",
  [KICKOFF_RESULT.HighKick]: "High Kick",
  [KICKOFF_RESULT.CheeringFans]: "Cheering Fans",
  [KICKOFF_RESULT.ChangingWeather]: "Changing Weather",
  [KICKOFF_RESULT.BrilliantCoaching]: "Brilliant Coaching",
  [KICKOFF_RESULT.QuickSnap]: "Quick Snap",
  [KICKOFF_RESULT.Blitz]: "Blitz",
  [KICKOFF_RESULT.ThrowARock]: "Throw A Rock",
  [KICKOFF_RESULT.PitchInvasion]: "Pitch Invasion",
}


export enum RESULT_TYPE {
  Passed = 0, //Skilltest Passed
  FailNoTurnover = 1, //Failed with Skill Reroll -> Failed no Turnover (Wild Animal Fail ect)
  FailTeamRR = 2, //Failed with Possible Reroll
  FailFinal = 3 //Failed No Reroll -> Final!
};

export enum SUB_RESULT_TYPE {
  Unknown_N2 = -2,
  Unknown_N1 = -1,
  ArmorNoBreak = 1, //Not sure - after rlArmor (3) - Only after Block?
  InjuryStun = 2,
  InjuryKO = 3,
  InjuryCAS = 4,
  Unknown_5 = 5,
  Unknown_6 = 6, // On Casualty Result
  ChoiceUseDodgeSkill = 7, //Pick Dodge skill use?
  Unknown_8 = 8, // From Casualty Roll
  Unknown_9 = 9, // From Casualty Roll
  Unknown_10 = 10, // From Casualty Roll
  Unknown_11 = 11,
  Unknown_12 = 12,
  Unknown_13 = 13,
  Unknown_14 = 14,
  Unknown_15 = 15, // From Casualty Roll
  CASDecay = 16,
  Unknown_17 = 17,
  CASResult = 18, //Final CAS Result
  Unknown_22 = 22, // During Dodge Roll
  Fend = 35, //Blockdice against Fend, no 2nd Dice.
  Unknown_40 = 40,
  Unknown_49 = 49,
  Unknown_56 = 56, // Push roll
  ChoiceUseDodgeTackle = 57, //Dodge vs Tackle before RR Pick
  Unknown_68 = 68, //Pick Wrestle skill use?
  Unknown_100 = 100, // Happens on Kickoff Scatters
  Unknown_101 = 101, // Happens during Foul Penalty
  Unknown_102 = 102, // Happens during Foul Penalty
};

export enum BLOCK {
  AttackerDown = "AD",
  BothDown = "BD",
  Push = "P",
  DefenderStumbles = "DS",
  DefenderDown = "DD",
}

export const BLOCK_DIE: Record<number, BLOCK> = {
  0: BLOCK.AttackerDown,
  1: BLOCK.BothDown,
  2: BLOCK.Push,
  3: BLOCK.DefenderStumbles,
  4: BLOCK.DefenderDown,
}

export enum RACE_ID {
  Human = 1,
  Dwarf = 2,
  Skaven = 3,
  Orc = 4,
  Lizardman = 5,
  Goblin = 6,
  WoodElf = 7,
  Chaos = 8,
  DarkElf = 9,
  Undead = 10,
  Halfling = 11,
  Norse = 12,
  Amazon = 13,
  ProElf = 14,
  HighElf = 15,
  Khemri = 16,
  Necromantic = 17,
  Nurgle = 18,
  Ogre = 19,
  Vampire = 20,
  ChaosDwarf = 21,
  Underworld = 22,
  Bretonnian = 24,
  Kislev = 25,
  //AllianceOfGoodness= ,
  AfterlifeUnited = 42,
  //UnionOfSmallPeople= ,
  ViolenceTogether = 40,
  //SuperiorBeingRing= ,
  //Chaos Gods Selection,
  FarEastAssociation = 35,
  AntiFurSociety = 37,
  //Human League,
  ChaosPact = 33,
  ElficGrandCoalition = 36,
}

export const RACE_NAMES: Record<RACE_ID, string> = {
  [RACE_ID.Amazon]: "Amazon",
  [RACE_ID.Bretonnian]: "Bretonnian",
  [RACE_ID.Chaos]: "Chaos",
  [RACE_ID.ChaosDwarf]: "Chaos Dwarf",
  [RACE_ID.ChaosPact]: "Chaos Pact",
  [RACE_ID.DarkElf]: "Dark Elf",
  [RACE_ID.Dwarf]: "Dwarf",
  [RACE_ID.Goblin]: "Goblin",
  [RACE_ID.Halfling]: "Halfling",
  [RACE_ID.HighElf]: "High Elf",
  [RACE_ID.Human]: "Human",
  [RACE_ID.Khemri]: "Khemri",
  [RACE_ID.Kislev]: "Kislev",
  [RACE_ID.Lizardman]: "Lizardman",
  [RACE_ID.Necromantic]: "Necromantic",
  [RACE_ID.Norse]: "Norse",
  [RACE_ID.Nurgle]: "Nurgle",
  [RACE_ID.Orc]: "Orc",
  [RACE_ID.Ogre]: "Ogre",
  [RACE_ID.ProElf]: "Pro Elf",
  [RACE_ID.Skaven]: "Skaven",
  [RACE_ID.Undead]: "Undead",
  [RACE_ID.Underworld]: "Underworld",
  [RACE_ID.Vampire]: "Vampire",
  [RACE_ID.WoodElf]: "Wood Elf",
  [RACE_ID.ElficGrandCoalition]: "Elfic Grand Coalition",
  [RACE_ID.AfterlifeUnited]: "Afterlife United",
  [RACE_ID.FarEastAssociation]: "Far East Association",
  [RACE_ID.ViolenceTogether]: "Violence Together",
  [RACE_ID.AntiFurSociety]: "Anti-Fur Society",
}


export enum PLAYER_TYPE {
  AmazonBlitzer = 'AmazonBlitzer',
  AmazonCatcher = 'AmazonCatcher',
  AmazonLinewoman = 'AmazonLinewoman',
  AmazonThrower = 'AmazonThrower',
  ChaosBeastman = 'ChaosBeastman',
  ChaosMinotaur = 'ChaosMinotaur',
  ChaosWarrior = 'ChaosWarrior',
  ChaosdwarfBlocker = 'ChaosdwarfBlocker',
  ChaosdwarfBullcentaur = 'ChaosdwarfBullcentaur',
  ChaosdwarfHobgoblin = 'ChaosdwarfHobgoblin',
  ChaosdwarfMinotaur = 'ChaosdwarfMinotaur',
  DarkelfLineman = 'DarkelfLineman',
  DarkelfRunner = 'DarkelfRunner',
  DarkelfAssasin = 'DarkelfAssasin',
  DarkelfBlitzer = 'DarkelfBlitzer',
  DarkelfWitchelf = 'DarkelfWitchelf',
  DwarfLongbeard = 'DwarfLongbeard',
  DwarfBlitzer = 'DwarfBlitzer',
  DwarfRunner = 'DwarfRunner',
  DwarfTrollslayer = 'DwarfTrollslayer',
  DwarfDeathroller = 'DwarfDeathroller',
  GoblinGoblin = 'GoblinGoblin',
  GoblinLooney = 'GoblinLooney',
  GoblinTroll = 'GoblinTroll',
  GoblinPogo = 'GoblinPogo',
  GoblinFanatic = 'GoblinFanatic',
  GoblinBomber = 'GoblinBomber',
  HalflingHalfling = 'HalflingHalfling',
  HalflingTreeman = 'HalflingTreeman',
  HighelfLineman = 'HighelfLineman',
  HighelfThrower = 'HighelfThrower',
  HighelfCatch = 'HighelfCatch',
  HighelfBlitzer = 'HighelfBlitzer',
  HumanLineman = 'HumanLineman',
  HumanCatcher = 'HumanCatcher',
  HumanThrower = 'HumanThrower',
  HumanBlitzer = 'HumanBlitzer',
  HumanOgre = 'HumanOgre',
  KhemriLineman = 'KhemriLineman',
  KhemriThrower = 'KhemriThrower',
  KhemriBlitzer = 'KhemriBlitzer',
  KhemriMummy = 'KhemriMummy',
  LizardmanSkink = 'LizardmanSkink',
  LizardmanSaurus = 'LizardmanSaurus',
  LizardmanKroxigor = 'LizardmanKroxigor',
  NecromanticZombie = 'NecromanticZombie',
  NecromanticGhoul = 'NecromanticGhoul',
  NecromanticWight = 'NecromanticWight',
  NecromanticGolem = 'NecromanticGolem',
  NecromanticWerewolf = 'NecromanticWerewolf',
  NorseLineman = 'NorseLineman',
  NorseThrower = 'NorseThrower',
  NorseRunner = 'NorseRunner',
  NorseBerserker = 'NorseBerserker',
  NorseUlfwerener = 'NorseUlfwerener',
  NorseYhetee = 'NorseYhetee',
  NurgleRotter = 'NurgleRotter',
  NurglePestigor = 'NurglePestigor',
  NurgleWarrior = 'NurgleWarrior',
  NurgleBeast = 'NurgleBeast',
  OgreSnotling = 'OgreSnotling',
  OgreOgre = 'OgreOgre',
  OrcLineman = 'OrcLineman',
  OrcGoblin = 'OrcGoblin',
  OrcThrower = 'OrcThrower',
  OrcBlocker = 'OrcBlocker',
  OrcBlitzer = 'OrcBlitzer',
  OrcTroll = 'OrcTroll',
  ProelfLineman = 'ProelfLineman',
  ProelfThrower = 'ProelfThrower',
  ProelfCatcher = 'ProelfCatcher',
  ProelfBlitzer = 'ProelfBlitzer',
  SkavenLineman = 'SkavenLineman',
  SkavenThrower = 'SkavenThrower',
  SkavenRunner = 'SkavenRunner',
  SkavenBlitzer = 'SkavenBlitzer',
  SkavenRatogre = 'SkavenRatogre',
  UndeadSkeleton = 'UndeadSkeleton',
  UndeadZombie = 'UndeadZombie',
  UndeadGhoul = 'UndeadGhoul',
  UndeadWight = 'UndeadWight',
  UndeadMummy = 'UndeadMummy',
  UnderworldGoblin = 'UnderworldGoblin',
  UnderworldLineman = 'UnderworldLineman',
  UnderworldThrower = 'UnderworldThrower',
  UnderworldBlitzer = 'UnderworldBlitzer',
  UnderworldTroll = 'UnderworldTroll',
  VampireThrall = 'VampireThrall',
  VampireVampire = 'VampireVampire',
  WoodelfLineman = 'WoodelfLineman',
  WoodelfCatcher = 'WoodelfCatcher',
  WoodelfThrower = 'WoodelfThrower',
  WoodelfWardancer = 'WoodelfWardancer',
  WoodelfTree = 'WoodelfTree',
  KislevLineman = 'KislevLineman',
  KislevCatcher = 'KislevCatcher',
  KislevBlitzer = 'KislevBlitzer',
  KislevBear = 'KislevBear',
  BretonniaPeasant = 'BretonniaPeasant',
  BretonniaBlocker = 'BretonniaBlocker',
  BretonniaKnight = 'BretonniaKnight',
  StarBarikFarblast = 'StarBarikFarblast',
  StarBerthaBigfist = 'StarBerthaBigfist',
  StarBomberDribblesnot = 'StarBomberDribblesnot',
  StarBoomerEziasson = 'StarBoomerEziasson',
  StarBrickFarth = 'StarBrickFarth',
  StarCountLuthorvonDrakenborg = 'StarCountLuthorvonDrakenborg',
  StarCrazyIgor = 'StarCrazyIgor',
  StarDeeprootStrongbranch = 'StarDeeprootStrongbranch',
  StarDolfarLongstride = 'StarDolfarLongstride',
  StarEldrilSidewinder = 'StarEldrilSidewinder',
  StarFezglitch = 'StarFezglitch',
  StarFlintChurnblade = 'StarFlintChurnblade',
  StarFungusTheLoon = 'StarFungusTheLoon',
  StarGlartSmashripJr = 'StarGlartSmashripJr',
  StarGrashnakBlackhoof = 'StarGrashnakBlackhoof',
  StarGriffOberwald = 'StarGriffOberwald',
  StarGrimIronjaw = 'StarGrimIronjaw',
  StarGrotty = 'StarGrotty',
  StarHackEnslash = 'StarHackEnslash',
  StarHakflemSkuttlespike = 'StarHakflemSkuttlespike',
  StarHeadsplitter = 'StarHeadsplitter',
  StarHelmutWulf = 'StarHelmutWulf',
  StarHemlock = 'StarHemlock',
  StarHorkonHeartripper = 'StarHorkonHeartripper',
  StarHtharkTheUnstoppable = 'StarHtharkTheUnstoppable',
  StarHubrisRakarth = 'StarHubrisRakarth',
  StarHumerusCarpal = 'StarHumerusCarpal',
  StarIcepeltHammerblow = 'StarIcepeltHammerblow',
  StarIthacaBenoin = 'StarIthacaBenoin',
  StarJEarlice = 'StarJEarlice',
  StarJordelFreshbreeze = 'StarJordelFreshbreeze',
  StarLewdgripWhiparm = 'StarLewdgripWhiparm',
  StarLordBorakTheDespoiler = 'StarLordBorakTheDespoiler',
  StarLottabottol = 'StarLottabottol',
  StarMaxSpleenripper = 'StarMaxSpleenripper',
  StarMightyZug = 'StarMightyZug',
  StarMorgNThorg = 'StarMorgNThorg',
  StarNobblaBlackwart = 'StarNobblaBlackwart',
  StarPrinceMoranion = 'StarPrinceMoranion',
  StarPuggyBaconbreath = 'StarPuggyBaconbreath',
  StarQuetzalLeap = 'StarQuetzalLeap',
  StarRamtutIII = 'StarRamtutIII',
  StarRashnakBackstabber = 'StarRashnakBackstabber',
  StarRipper = 'StarRipper',
  StarRoxannaDarknail = 'StarRoxannaDarknail',
  StarScrappaSorehead = 'StarScrappaSorehead',
  StarSetekh = 'StarSetekh',
  StarSinnedbad = 'StarSinnedbad',
  StarSkitterStabStab = 'StarSkitterStabStab',
  StarSlibli = 'StarSlibli',
  StarSoarenHightower = 'StarSoarenHightower',
  StarUgrothBolgrot = 'StarUgrothBolgrot',
  StarVaragGhoulChewer = 'StarVaragGhoulChewer',
  StarWilhelmChaney = 'StarWilhelmChaney',
  StarWillowRosebark = 'StarWillowRosebark',
  StarZaraTheSlayer = 'StarZaraTheSlayer',
  StarZzhargMadeye = 'StarZzhargMadeye',
  Unknown = 'UNKNOWN',
}

type PlayerId = number;
type PlayerTypeId = number;

export function getPlayerType(playerTypeId: PlayerId): PLAYER_TYPE {

  switch (playerTypeId) {
    case 71: case 414: case 459: return PLAYER_TYPE.AmazonBlitzer;
    case 70: case 413: case 458: return PLAYER_TYPE.AmazonCatcher;
    case 68: case 411: case 456: return PLAYER_TYPE.AmazonLinewoman;
    case 69: case 457: case 412: return PLAYER_TYPE.AmazonThrower;
    case 32: case 336: case 355: return PLAYER_TYPE.ChaosBeastman;
    case 34: case 338: case 357: return PLAYER_TYPE.ChaosMinotaur;
    case 33: case 337: case 356: return PLAYER_TYPE.ChaosWarrior;
    case 330: case 363: case 109: return PLAYER_TYPE.ChaosdwarfBlocker;
    case 331: case 364: case 110: return PLAYER_TYPE.ChaosdwarfBullcentaur;
    case 329: case 362: case 108: return PLAYER_TYPE.ChaosdwarfHobgoblin;
    case 332: case 365: case 111: return PLAYER_TYPE.ChaosdwarfMinotaur;
    case 47: case 345: case 391: return PLAYER_TYPE.DarkelfLineman;
    case 48: case 347: case 392: return PLAYER_TYPE.DarkelfRunner;
    case 49: case 346: case 394: return PLAYER_TYPE.DarkelfAssasin;
    case 50: case 344: case 393: return PLAYER_TYPE.DarkelfBlitzer;
    case 51: case 348: case 395: return PLAYER_TYPE.DarkelfWitchelf;
    case 6: case 426: return PLAYER_TYPE.DwarfLongbeard;
    case 8: case 427: return PLAYER_TYPE.DwarfBlitzer;
    case 7: case 429: return PLAYER_TYPE.DwarfRunner;
    case 9: case 428: return PLAYER_TYPE.DwarfTrollslayer;
    case 10: case 430: return PLAYER_TYPE.DwarfDeathroller;
    case 30: case 372: case 466: case 479: return PLAYER_TYPE.GoblinGoblin;
    case 31: case 373: case 467: case 481: return PLAYER_TYPE.GoblinLooney;
    case 44: case 377: case 471: case 484: return PLAYER_TYPE.GoblinTroll;
    case 45: case 374: case 468: case 482: return PLAYER_TYPE.GoblinPogo;
    case 46: case 376: case 470: case 483: return PLAYER_TYPE.GoblinFanatic;
    case 107: case 375: case 469: case 480: return PLAYER_TYPE.GoblinBomber;
    case 60: case 431: case 485: return PLAYER_TYPE.HalflingHalfling;
    case 61: case 432: case 486: return PLAYER_TYPE.HalflingTreeman;
    case 77: case 323: case 387: return PLAYER_TYPE.HighelfLineman;
    case 78: case 325: case 390: return PLAYER_TYPE.HighelfThrower;
    case 79: case 389: case 326: return PLAYER_TYPE.HighelfCatch;
    case 80: case 324: case 388: return PLAYER_TYPE.HighelfBlitzer;
    case 1: case 422: case 438: return PLAYER_TYPE.HumanLineman;
    case 2: case 423: case 440: return PLAYER_TYPE.HumanCatcher;
    case 3: case 424: case 441: return PLAYER_TYPE.HumanThrower;
    case 4: case 421: case 439: return PLAYER_TYPE.HumanBlitzer;
    case 5: case 425: case 442: return PLAYER_TYPE.HumanOgre;
    case 81: case 499: return PLAYER_TYPE.KhemriLineman;
    case 82: case 500: return PLAYER_TYPE.KhemriThrower;
    case 83: case 501: return PLAYER_TYPE.KhemriBlitzer;
    case 84: case 502: return PLAYER_TYPE.KhemriMummy;
    case 27: case 415: case 472: return PLAYER_TYPE.LizardmanSkink;
    case 28: case 416: case 473: return PLAYER_TYPE.LizardmanSaurus;
    case 29: case 417: case 474: return PLAYER_TYPE.LizardmanKroxigor;
    case 86: return PLAYER_TYPE.NecromanticZombie;
    case 87: return PLAYER_TYPE.NecromanticGhoul;
    case 88: return PLAYER_TYPE.NecromanticWight;
    case 89: case 498: return PLAYER_TYPE.NecromanticGolem;
    case 90: case 497: return PLAYER_TYPE.NecromanticWerewolf;
    case 62: case 405: case 450: return PLAYER_TYPE.NorseLineman;
    case 63: case 406: case 452: return PLAYER_TYPE.NorseThrower;
    case 64: case 407: case 451: return PLAYER_TYPE.NorseRunner;
    case 65: case 408: case 453: return PLAYER_TYPE.NorseBerserker;
    case 66: case 409: case 454: return PLAYER_TYPE.NorseUlfwerener;
    case 67: case 410: case 455: return PLAYER_TYPE.NorseYhetee;
    case 91: case 358: return PLAYER_TYPE.NurgleRotter;
    case 92: case 359: return PLAYER_TYPE.NurglePestigor;
    case 93: case 360: return PLAYER_TYPE.NurgleWarrior;
    case 94: case 361: return PLAYER_TYPE.NurgleBeast;
    case 95: case 476: case 478: case 737: return PLAYER_TYPE.OgreSnotling;
    case 96: case 475: case 477: case 738: return PLAYER_TYPE.OgreOgre;
    case 21: case 366: case 460: return PLAYER_TYPE.OrcLineman;
    case 22: case 369: case 463: return PLAYER_TYPE.OrcGoblin;
    case 23: case 368: case 462: return PLAYER_TYPE.OrcThrower;
    case 24: case 370: case 464: return PLAYER_TYPE.OrcBlocker;
    case 25: case 367: case 461: return PLAYER_TYPE.OrcBlitzer;
    case 26: case 371: case 465: return PLAYER_TYPE.OrcTroll;
    case 72: case 739: return PLAYER_TYPE.ProelfLineman;
    case 73: case 741: return PLAYER_TYPE.ProelfThrower;
    case 74: case 749: return PLAYER_TYPE.ProelfCatcher;
    case 75: case 740: return PLAYER_TYPE.ProelfBlitzer;
    case 16: case 339: case 378: return PLAYER_TYPE.SkavenLineman;
    case 17: case 340: case 380: return PLAYER_TYPE.SkavenThrower;
    case 18: case 341: case 381: return PLAYER_TYPE.SkavenRunner;
    case 19: case 342: case 379: return PLAYER_TYPE.SkavenBlitzer;
    case 20: case 343: case 382: return PLAYER_TYPE.SkavenRatogre;
    case 54: case 492: return PLAYER_TYPE.UndeadSkeleton;
    case 55: case 493: return PLAYER_TYPE.UndeadZombie;
    case 56: case 494: return PLAYER_TYPE.UndeadGhoul;
    case 57: case 495: return PLAYER_TYPE.UndeadWight;
    case 58: case 496: return PLAYER_TYPE.UndeadMummy;
    case 123: case 732: return PLAYER_TYPE.UnderworldGoblin;
    case 124: case 733: return PLAYER_TYPE.UnderworldLineman;
    case 125: case 734: return PLAYER_TYPE.UnderworldThrower;
    case 126: case 735: return PLAYER_TYPE.UnderworldBlitzer;
    case 127: case 736: return PLAYER_TYPE.UnderworldTroll;
    case 97: case 327: case 503: return PLAYER_TYPE.VampireThrall;
    case 98: case 328: case 504: return PLAYER_TYPE.VampireVampire;
    case 11: case 396: case 433: return PLAYER_TYPE.WoodelfLineman;
    case 12: case 397: case 434: return PLAYER_TYPE.WoodelfCatcher;
    case 13: case 398: case 435: return PLAYER_TYPE.WoodelfThrower;
    case 14: case 399: case 436: return PLAYER_TYPE.WoodelfWardancer;
    case 15: case 400: case 437: return PLAYER_TYPE.WoodelfTree;
    case 142: case 401: case 446: return PLAYER_TYPE.KislevLineman;
    case 143: case 403: case 448: return PLAYER_TYPE.KislevCatcher;
    case 144: case 402: case 447: return PLAYER_TYPE.KislevBlitzer;
    case 145: case 404: case 449: return PLAYER_TYPE.KislevBear;
    case 139: case 333: case 420: case 443: return PLAYER_TYPE.BretonniaPeasant;
    case 140: case 335: case 419: case 445: return PLAYER_TYPE.BretonniaBlocker;
    case 141: case 334: case 418: case 444: return PLAYER_TYPE.BretonniaKnight;
    case 146: case 239: case 617: case 618: return PLAYER_TYPE.StarBarikFarblast;
    case 293: case 294: case 619: case 620: return PLAYER_TYPE.StarBerthaBigfist;
    case 133: case 233: case 621: case 622: return PLAYER_TYPE.StarBomberDribblesnot;
    case 309: case 310: case 623: case 624: return PLAYER_TYPE.StarBoomerEziasson;
    case 164: case 256: case 625: case 626: return PLAYER_TYPE.StarBrickFarth;
    case 224: case 59: case 627: case 628: return PLAYER_TYPE.StarCountLuthorvonDrakenborg;
    case 301: case 302: case 629: case 630: return PLAYER_TYPE.StarCrazyIgor;
    case 103: case 229: case 631: case 632: return PLAYER_TYPE.StarDeeprootStrongbranch;
    case 147: case 240: case 633: case 634: return PLAYER_TYPE.StarDolfarLongstride;
    case 101: case 227: case 635: case 636: return PLAYER_TYPE.StarEldrilSidewinder;
    case 154: case 247: case 637: case 638: return PLAYER_TYPE.StarFezglitch;
    case 313: case 314: case 639: case 640: return PLAYER_TYPE.StarFlintChurnblade;
    case 303: case 304: case 641: case 642: return PLAYER_TYPE.StarFungusTheLoon;
    case 149: case 242: case 643: case 644: return PLAYER_TYPE.StarGlartSmashripJr;
    case 214: case 36: case 645: case 646: return PLAYER_TYPE.StarGrashnakBlackhoof;
    case 215: case 37: case 647: case 648: return PLAYER_TYPE.StarGriffOberwald;
    case 216: case 38: case 649: case 650: return PLAYER_TYPE.StarGrimIronjaw;
    case 148: case 241: case 651: case 652: return PLAYER_TYPE.StarGrotty;
    case 315: case 316: case 653: case 654: return PLAYER_TYPE.StarHackEnslash;
    case 138: case 238: case 655: case 656: return PLAYER_TYPE.StarHakflemSkuttlespike;
    case 217: case 39: case 657: case 658: return PLAYER_TYPE.StarHeadsplitter;
    case 317: case 318: case 659: case 660: return PLAYER_TYPE.StarHelmutWulf;
    case 275: case 276: case 661: case 662: return PLAYER_TYPE.StarHemlock;
    case 222: case 52: case 663: case 664: return PLAYER_TYPE.StarHorkonHeartripper;
    case 299: case 300: case 665: case 666: return PLAYER_TYPE.StarHtharkTheUnstoppable;
    case 137: case 237: case 667: case 668: return PLAYER_TYPE.StarHubrisRakarth;
    case 307: case 308: case 669: case 670: return PLAYER_TYPE.StarHumerusCarpal;
    case 106: case 232: case 671: case 672: return PLAYER_TYPE.StarIcepeltHammerblow;
    case 157: case 250: case 673: case 674: return PLAYER_TYPE.StarIthacaBenoin;
    case 136: case 236: case 675: case 676: return PLAYER_TYPE.StarJEarlice;
    case 218: case 40: case 677: case 678: return PLAYER_TYPE.StarJordelFreshbreeze;
    case 158: case 251: case 679: case 680: return PLAYER_TYPE.StarLewdgripWhiparm;
    case 102: case 228: case 683: case 684: return PLAYER_TYPE.StarLordBorakTheDespoiler;
    case 281: case 282: case 681: case 682: return PLAYER_TYPE.StarLottabottol;
    case 160: case 252: case 685: case 686: return PLAYER_TYPE.StarMaxSpleenripper;
    case 135: case 235: case 687: case 688: return PLAYER_TYPE.StarMightyZug;
    case 223: case 53: case 689: case 690: return PLAYER_TYPE.StarMorgNThorg;
    case 305: case 306: case 693: case 694: return PLAYER_TYPE.StarNobblaBlackwart;
    case 150: case 243: case 691: case 692: return PLAYER_TYPE.StarPrinceMoranion;
    case 161: case 253: case 695: case 696: return PLAYER_TYPE.StarPuggyBaconbreath;
    case 283: case 284: case 697: case 698: return PLAYER_TYPE.StarQuetzalLeap;
    case 231: case 699: case 700: case 105: return PLAYER_TYPE.StarRamtutIII;
    case 295: case 296: case 701: case 702: return PLAYER_TYPE.StarRashnakBackstabber;
    case 219: case 41: case 703: case 704: return PLAYER_TYPE.StarRipper;
    case 151: case 244: case 705: case 706: return PLAYER_TYPE.StarRoxannaDarknail;
    case 100: case 226: case 707: case 708: return PLAYER_TYPE.StarScrappaSorehead;
    case 104: case 230: case 709: case 710: return PLAYER_TYPE.StarSetekh;
    case 319: case 320: case 711: case 712: return PLAYER_TYPE.StarSinnedbad;
    case 162: case 254: case 713: case 714: return PLAYER_TYPE.StarSkitterStabStab;
    case 220: case 42: case 715: case 716: return PLAYER_TYPE.StarSlibli;
    case 152: case 245: case 717: case 718: return PLAYER_TYPE.StarSoarenHightower;
    case 163: case 255: case 719: case 720: return PLAYER_TYPE.StarUgrothBolgrot;
    case 221: case 43: case 721: case 722: return PLAYER_TYPE.StarVaragGhoulChewer;
    case 277: case 278: case 725: case 726: return PLAYER_TYPE.StarWilhelmChaney;
    case 279: case 280: case 723: case 724: return PLAYER_TYPE.StarWillowRosebark;
    case 225: case 727: case 728: case 99: return PLAYER_TYPE.StarZaraTheSlayer;
    case 134: case 234: case 729: case 730: return PLAYER_TYPE.StarZzhargMadeye;
  }
  return PLAYER_TYPE.Unknown;
}

export interface PlayerSprite {
  race: string,
  model: string,
}

function badPlayerType(playerType: never): never
function badPlayerType(playerType: PLAYER_TYPE) {
  console.error(`Unexpected player type ${playerType}`);
}

export function getPlayerSprite(playerId: PlayerId, playerType: PLAYER_TYPE): PlayerSprite {
  switch (playerType) {
    case PLAYER_TYPE.AmazonBlitzer: return { race: 'amazon', model: `blitzer${playerId % 2 + 1}` };
    case PLAYER_TYPE.AmazonCatcher: return { race: 'amazon', model: `catcher${playerId % 2 + 1}` };
    case PLAYER_TYPE.AmazonLinewoman: return { race: 'amazon', model: `lineman${playerId % 2 + 1}` };
    case PLAYER_TYPE.AmazonThrower: return { race: 'amazon', model: `thrower` };
    case PLAYER_TYPE.ChaosBeastman: return { race: 'chaos', model: `beastman${playerId % 4 + 1}` };
    case PLAYER_TYPE.ChaosMinotaur: return { race: 'chaos', model: `minotaur${playerId % 3 + 1}` };
    case PLAYER_TYPE.ChaosWarrior: return { race: 'chaos', model: `warrior${playerId % 6 + 1}` };
    case PLAYER_TYPE.ChaosdwarfBlocker: return { race: 'chaosdwarf', model: `blocker${playerId % 4 + 1}` };
    case PLAYER_TYPE.ChaosdwarfBullcentaur: return { race: 'chaosdwarf', model: `bullcentaur${playerId % 2 + 1}` };
    case PLAYER_TYPE.ChaosdwarfHobgoblin: return { race: 'chaosdwarf', model: `hobgoblin${playerId % 4 + 1}` };
    case PLAYER_TYPE.ChaosdwarfMinotaur: return { race: 'chaosdwarf', model: `minotaur` };
    case PLAYER_TYPE.DarkelfLineman: return { race: 'darkelf', model: `lineman` };
    case PLAYER_TYPE.DarkelfRunner: return { race: 'darkelf', model: `runner` };
    case PLAYER_TYPE.DarkelfAssasin: return { race: 'darkelf', model: `assasin` };
    case PLAYER_TYPE.DarkelfBlitzer: return { race: 'darkelf', model: `blitzer` };
    case PLAYER_TYPE.DarkelfWitchelf: return { race: 'darkelf', model: `witchelf` };
    case PLAYER_TYPE.DwarfLongbeard: return { race: 'dwarf', model: `longbeard${playerId % 3 + 1}` };
    case PLAYER_TYPE.DwarfBlitzer: return { race: 'dwarf', model: `blitzer${playerId % 2 + 1}` };
    case PLAYER_TYPE.DwarfRunner: return { race: 'dwarf', model: `runner${playerId % 3 + 1}` };
    case PLAYER_TYPE.DwarfTrollslayer: return { race: 'dwarf', model: `trollslayer${playerId % 2 + 1}` };
    case PLAYER_TYPE.DwarfDeathroller: return { race: 'dwarf', model: `deathroller` };
    case PLAYER_TYPE.GoblinGoblin: return { race: 'goblin', model: `goblin${playerId % 7 + 1}` };
    case PLAYER_TYPE.GoblinLooney: return { race: 'goblin', model: `looney${playerId % 2 + 1}` };
    case PLAYER_TYPE.GoblinTroll: return { race: 'goblin', model: `troll${playerId % 3 + 1}` };
    case PLAYER_TYPE.GoblinPogo: return { race: 'goblin', model: `pogo${playerId % 2 + 1}` };
    case PLAYER_TYPE.GoblinFanatic: return { race: 'goblin', model: `fanatic${playerId % 2 + 1}` };
    case PLAYER_TYPE.GoblinBomber: return { race: 'goblin', model: `bomber${playerId % 2 + 1}` };
    case PLAYER_TYPE.HalflingHalfling: return { race: 'halfling', model: `halfling${playerId % 5 + 1}` };
    case PLAYER_TYPE.HalflingTreeman: return { race: 'halfling', model: `treeman${playerId % 3 + 1}` };
    case PLAYER_TYPE.HighelfLineman: return { race: 'highelf', model: `lineman${playerId % 2 + 1}` };
    case PLAYER_TYPE.HighelfThrower: return { race: 'highelf', model: `thrower` };
    case PLAYER_TYPE.HighelfCatch: return { race: 'highelf', model: `catch${playerId % 2 + 1}` };
    case PLAYER_TYPE.HighelfBlitzer: return { race: 'highelf', model: `blitzer` };
    case PLAYER_TYPE.HumanLineman: return { race: 'human', model: `lineman${playerId % 2 + 1}` };
    case PLAYER_TYPE.HumanCatcher: return { race: 'human', model: `catcher` };
    case PLAYER_TYPE.HumanThrower: return { race: 'human', model: `thrower` };
    case PLAYER_TYPE.HumanBlitzer: return { race: 'human', model: `blitzer` };
    case PLAYER_TYPE.HumanOgre: return { race: 'human', model: `ogre` };
    case PLAYER_TYPE.KhemriLineman: return { race: 'khemri', model: `lineman${playerId % 4 + 1}` };
    case PLAYER_TYPE.KhemriThrower: return { race: 'khemri', model: `thrower${playerId % 2 + 1}` };
    case PLAYER_TYPE.KhemriBlitzer: return { race: 'khemri', model: `blitzer${playerId % 2 + 1}` };
    case PLAYER_TYPE.KhemriMummy: return { race: 'khemri', model: `mummy${playerId % 2 + 1}` };
    case PLAYER_TYPE.LizardmanSkink: return { race: 'lizardman', model: `skink${playerId % 4 + 1}` };
    case PLAYER_TYPE.LizardmanSaurus: return { race: 'lizardman', model: `saurus${playerId % 4 + 1}` };
    case PLAYER_TYPE.LizardmanKroxigor: return { race: 'lizardman', model: `kroxigor${playerId % 2 + 1}` };
    case PLAYER_TYPE.NecromanticZombie: return { race: 'necromantic', model: `zombie${playerId % 4 + 1}` };
    case PLAYER_TYPE.NecromanticGhoul: return { race: 'necromantic', model: `ghoul${playerId % 2 + 1}` };
    case PLAYER_TYPE.NecromanticWight: return { race: 'necromantic', model: `wight${playerId % 2 + 1}` };
    case PLAYER_TYPE.NecromanticGolem: return { race: 'necromantic', model: `golem${playerId % 2 + 1}` };
    case PLAYER_TYPE.NecromanticWerewolf: return { race: 'necromantic', model: `werewolf${playerId % 2 + 1}` };
    case PLAYER_TYPE.NorseLineman: return { race: 'norse', model: `lineman${playerId % 4 + 1}` };
    case PLAYER_TYPE.NorseThrower: return { race: 'norse', model: `thrower` };
    case PLAYER_TYPE.NorseRunner: return { race: 'norse', model: `runner` };
    case PLAYER_TYPE.NorseBerserker: return { race: 'norse', model: `berserker${playerId % 2 + 1}` };
    case PLAYER_TYPE.NorseUlfwerener: return { race: 'norse', model: `ulfwerener${playerId % 2 + 1}` };
    case PLAYER_TYPE.NorseYhetee: return { race: 'norse', model: `yhetee` };
    case PLAYER_TYPE.NurgleRotter: return { race: 'nurgle', model: `rotter${playerId % 6 + 1}` };
    case PLAYER_TYPE.NurglePestigor: return { race: 'nurgle', model: `pestigor${playerId % 4 + 1}` };
    case PLAYER_TYPE.NurgleWarrior: return { race: 'nurgle', model: `warrior${playerId % 4 + 1}` };
    case PLAYER_TYPE.NurgleBeast: return { race: 'nurgle', model: "beast-of-nurgle" };
    case PLAYER_TYPE.OgreSnotling: return { race: 'ogre', model: `snotling${playerId % 7 + 1}` };
    case PLAYER_TYPE.OgreOgre: return { race: 'ogre', model: `ogre${playerId % 6 + 1}` };
    case PLAYER_TYPE.OrcLineman: return { race: 'orc', model: `lineman${playerId % 3 + 1}` };
    case PLAYER_TYPE.OrcGoblin: return { race: 'orc', model: `goblin${playerId % 2 + 1}` };
    case PLAYER_TYPE.OrcThrower: return { race: 'orc', model: `thrower${playerId % 2 + 1}` };
    case PLAYER_TYPE.OrcBlocker: return { race: 'orc', model: `blocker${playerId % 4 + 1}` };
    case PLAYER_TYPE.OrcBlitzer: return { race: 'orc', model: `blitzer${playerId % 3 + 1}` };
    case PLAYER_TYPE.OrcTroll: return { race: 'orc', model: `troll` };
    case PLAYER_TYPE.ProelfLineman: return { race: 'proelf', model: `lineman${playerId % 2 + 1}` };
    case PLAYER_TYPE.ProelfThrower: return { race: 'proelf', model: `thrower` };
    case PLAYER_TYPE.ProelfCatcher: return { race: 'proelf', model: `catcher${playerId % 2 + 1}` };
    case PLAYER_TYPE.ProelfBlitzer: return { race: 'proelf', model: `blitzer${playerId % 2 + 1}` };
    case PLAYER_TYPE.SkavenLineman: return { race: 'skaven', model: `lineman${playerId % 3 + 1}` };
    case PLAYER_TYPE.SkavenThrower: return { race: 'skaven', model: `thrower` };
    case PLAYER_TYPE.SkavenRunner: return { race: 'skaven', model: `runner${playerId % 2 + 1}` };
    case PLAYER_TYPE.SkavenBlitzer: return { race: 'skaven', model: `blitzer${playerId % 2 + 1}` };
    case PLAYER_TYPE.SkavenRatogre: return { race: 'skaven', model: `ratogre` };
    case PLAYER_TYPE.UndeadSkeleton: return { race: 'undead', model: `skeleton${playerId % 3 + 1}` };
    case PLAYER_TYPE.UndeadZombie: return { race: 'undead', model: `zombie${playerId % 4 + 1}` };
    case PLAYER_TYPE.UndeadGhoul: return { race: 'undead', model: `ghoul${playerId % 2 + 1}` };
    case PLAYER_TYPE.UndeadWight: return { race: 'undead', model: `wight${playerId % 2 + 1}` };
    case PLAYER_TYPE.UndeadMummy: return { race: 'undead', model: `mummy${playerId % 2 + 1}` };
    case PLAYER_TYPE.UnderworldGoblin: return { race: 'underworld', model: `goblin${playerId % 5 + 1}` };
    case PLAYER_TYPE.UnderworldLineman: return { race: 'underworld', model: `lineman${playerId % 4 + 1}` };
    case PLAYER_TYPE.UnderworldThrower: return { race: 'underworld', model: `thrower${playerId % 2 + 1}` };
    case PLAYER_TYPE.UnderworldBlitzer: return { race: 'underworld', model: `blitzer${playerId % 2 + 1}` };
    case PLAYER_TYPE.UnderworldTroll: return { race: 'underworld', model: `troll` };
    case PLAYER_TYPE.VampireThrall: return { race: 'vampire', model: `thrall${playerId % 3 + 1}` };
    case PLAYER_TYPE.VampireVampire: return {
      race: 'vampire', model: `vampire${playerId % 3 + 1}`
    };
    case PLAYER_TYPE.WoodelfLineman: return { race: 'woodelf', model: `lineman${playerId % 4 + 1}` };
    case PLAYER_TYPE.WoodelfCatcher: return { race: 'woodelf', model: `catcher${playerId % 4 + 1}` };
    case PLAYER_TYPE.WoodelfThrower: return { race: 'woodelf', model: `thrower${playerId % 2 + 1}` };
    case PLAYER_TYPE.WoodelfWardancer: return { race: 'woodelf', model: `wardancer${playerId % 2 + 1}` };
    case PLAYER_TYPE.WoodelfTree: return { race: 'woodelf', model: `tree` };
    case PLAYER_TYPE.KislevLineman: return { race: 'kislev', model: `lineman${playerId % 4 + 1}` };
    case PLAYER_TYPE.KislevCatcher: return { race: 'kislev', model: `catcher${playerId % 2 + 1}` };
    case PLAYER_TYPE.KislevBlitzer: return { race: 'kislev', model: `blitzer${playerId % 2 + 1}` };
    case PLAYER_TYPE.KislevBear: return { race: 'kislev', model: `bear` };
    case PLAYER_TYPE.BretonniaPeasant: return {
      race: 'bretonnia', model: `peasant${playerId % 3 + 1}`
    };
    case PLAYER_TYPE.BretonniaBlocker: return {
      race: 'bretonnia', model: `blocker${playerId % 2 + 1}`
    };
    case PLAYER_TYPE.BretonniaKnight: return {
      race: 'bretonnia', model: `knight${playerId % 2 + 1}`
    };
    case PLAYER_TYPE.StarBarikFarblast: return { model: 'barik-farblast', race: 'starplayer' };
    case PLAYER_TYPE.StarBerthaBigfist: return { model: 'bertha-bigfist', race: 'starplayer' };
    case PLAYER_TYPE.StarBomberDribblesnot: return { model: 'bomber-dribblesnot', race: 'starplayer' };
    case PLAYER_TYPE.StarBoomerEziasson: return { model: 'boomer-eziasson', race: 'starplayer' };
    case PLAYER_TYPE.StarBrickFarth: return { model: 'brick-farth', race: 'starplayer' };
    case PLAYER_TYPE.StarCountLuthorvonDrakenborg: return { model: 'count-luthorvon-drakenborg', race: 'starplayer' };
    case PLAYER_TYPE.StarCrazyIgor: return { model: 'crazy-igor', race: 'starplayer' };
    case PLAYER_TYPE.StarDeeprootStrongbranch: return { model: 'deeproot-strongbranch', race: 'starplayer' };
    case PLAYER_TYPE.StarDolfarLongstride: return { model: 'dolfar-longstride', race: 'starplayer' };
    case PLAYER_TYPE.StarEldrilSidewinder: return { model: 'eldril-sidewinder', race: 'starplayer' };
    case PLAYER_TYPE.StarFezglitch: return { model: 'fezglitch', race: 'starplayer' };
    case PLAYER_TYPE.StarFlintChurnblade: return { model: 'flint-churnblade', race: 'starplayer' };
    case PLAYER_TYPE.StarFungusTheLoon: return { model: 'fungus-the-loon', race: 'starplayer' };
    case PLAYER_TYPE.StarGlartSmashripJr: return { model: 'glart-smashrip-jr', race: 'starplayer' };
    case PLAYER_TYPE.StarGrashnakBlackhoof: return { model: 'grashnak-blackhoof', race: 'starplayer' };
    case PLAYER_TYPE.StarGriffOberwald: return { model: 'griff-oberwald', race: 'starplayer' };
    case PLAYER_TYPE.StarGrimIronjaw: return { model: 'grim-ironjaw', race: 'starplayer' };
    case PLAYER_TYPE.StarGrotty: return { model: 'grotty', race: 'starplayer' };
    case PLAYER_TYPE.StarHackEnslash: return { model: 'hack-enslash', race: 'starplayer' };
    case PLAYER_TYPE.StarHakflemSkuttlespike: return { model: 'hakflem-skuttlespike', race: 'starplayer' };
    case PLAYER_TYPE.StarHeadsplitter: return { model: 'headsplitter', race: 'starplayer' };
    case PLAYER_TYPE.StarHelmutWulf: return { model: 'helmut-wulf', race: 'starplayer' };
    case PLAYER_TYPE.StarHemlock: return { model: 'hemlock', race: 'starplayer' };
    case PLAYER_TYPE.StarHorkonHeartripper: return { model: 'horkon-heartripper', race: 'starplayer' };
    case PLAYER_TYPE.StarHtharkTheUnstoppable: return { model: 'hthark-the-unstoppable', race: 'starplayer' };
    case PLAYER_TYPE.StarHubrisRakarth: return { model: 'hubris-rakarth', race: 'starplayer' };
    case PLAYER_TYPE.StarHumerusCarpal: return { model: 'humerus-carpal', race: 'starplayer' };
    case PLAYER_TYPE.StarIcepeltHammerblow: return { model: 'icepelt-hammerblow', race: 'starplayer' };
    case PLAYER_TYPE.StarIthacaBenoin: return { model: 'ithaca-benoin', race: 'starplayer' };
    case PLAYER_TYPE.StarJEarlice: return { model: 'j-earlice', race: 'starplayer' };
    case PLAYER_TYPE.StarJordelFreshbreeze: return { model: 'jordel-freshbreeze', race: 'starplayer' };
    case PLAYER_TYPE.StarLewdgripWhiparm: return { model: 'lewdgrip-whiparm', race: 'starplayer' };
    case PLAYER_TYPE.StarLordBorakTheDespoiler: return { model: 'lord-borak-the-despoiler', race: 'starplayer' };
    case PLAYER_TYPE.StarLottabottol: return { model: 'lottabottol', race: 'starplayer' };
    case PLAYER_TYPE.StarMaxSpleenripper: return { model: 'max-spleenripper', race: 'starplayer' };
    case PLAYER_TYPE.StarMightyZug: return { model: 'mighty-zug', race: 'starplayer' };
    case PLAYER_TYPE.StarMorgNThorg: return { model: 'morg-n-thorg', race: 'starplayer' };
    case PLAYER_TYPE.StarNobblaBlackwart: return { model: 'nobbla-blackwart', race: 'starplayer' };
    case PLAYER_TYPE.StarPrinceMoranion: return { model: 'prince-moranion', race: 'starplayer' };
    case PLAYER_TYPE.StarPuggyBaconbreath: return { model: 'puggy-baconbreath', race: 'starplayer' };
    case PLAYER_TYPE.StarQuetzalLeap: return { model: 'quetzal-leap', race: 'starplayer' };
    case PLAYER_TYPE.StarRamtutIII: return { model: 'ramtut-iii', race: 'starplayer' };
    case PLAYER_TYPE.StarRashnakBackstabber: return { model: 'rashnak-backstabber', race: 'starplayer' };
    case PLAYER_TYPE.StarRipper: return { model: 'ripper', race: 'starplayer' };
    case PLAYER_TYPE.StarRoxannaDarknail: return { model: 'roxanna-darknail', race: 'starplayer' };
    case PLAYER_TYPE.StarScrappaSorehead: return { model: 'scrappa-sorehead', race: 'starplayer' };
    case PLAYER_TYPE.StarSetekh: return { model: 'setekh', race: 'starplayer' };
    case PLAYER_TYPE.StarSinnedbad: return { model: 'sinnedbad', race: 'starplayer' };
    case PLAYER_TYPE.StarSkitterStabStab: return { model: 'skitter-stab-stab', race: 'starplayer' };
    case PLAYER_TYPE.StarSlibli: return { model: 'slibli', race: 'starplayer' };
    case PLAYER_TYPE.StarSoarenHightower: return { model: 'soaren-hightower', race: 'starplayer' };
    case PLAYER_TYPE.StarUgrothBolgrot: return { model: 'ugroth-bolgrot', race: 'starplayer' };
    case PLAYER_TYPE.StarVaragGhoulChewer: return { model: 'varag-ghoul-chewer', race: 'starplayer' };
    case PLAYER_TYPE.StarWilhelmChaney: return { model: 'wilhelm-chaney', race: 'starplayer' };
    case PLAYER_TYPE.StarWillowRosebark: return { model: 'willow-rosebark', race: 'starplayer' };
    case PLAYER_TYPE.StarZaraTheSlayer: return { model: 'zara-the-slayer', race: 'starplayer' };
    case PLAYER_TYPE.StarZzhargMadeye: return { model: 'zzharg-madeye', race: 'starplayer' };
    case PLAYER_TYPE.Unknown: return { model: 'lineman', race: 'human' };
    default:
      badPlayerType(playerType);
  }
}

export type PlayerTV =
  | {
    tv: number,
    normals: string,
    doubles: string,
    free: SKILL[],
    star: false,
  }
  | {
    tv: number,
    star: true,
  }

export const PLAYER_TVS: Record<PLAYER_TYPE, PlayerTV> = {
  [PLAYER_TYPE.AmazonBlitzer]: { star: false, tv: 90, normals: 'GS', doubles: 'AP', free: [SKILL.Block, SKILL.Dodge] },
  [PLAYER_TYPE.AmazonCatcher]: { star: false, tv: 70, normals: 'GA', doubles: 'PS', free: [SKILL.Dodge, SKILL.Catch] },
  [PLAYER_TYPE.AmazonLinewoman]: { star: false, tv: 50, normals: 'G', doubles: 'APS', free: [SKILL.Dodge] },
  [PLAYER_TYPE.AmazonThrower]: { star: false, tv: 70, normals: 'GP', doubles: 'AS', free: [SKILL.Dodge, SKILL.Pass] },
  [PLAYER_TYPE.ChaosBeastman]: { star: false, tv: 60, normals: 'GSM', doubles: 'AP', free: [SKILL.Horns] },
  [PLAYER_TYPE.ChaosMinotaur]: { star: false, tv: 150, normals: 'SM', doubles: 'GAP', free: [SKILL.ThickSkull, SKILL.MightyBlow, SKILL.Horns, SKILL.Frenzy, SKILL.Loner, SKILL.WildAnimal] },
  [PLAYER_TYPE.ChaosWarrior]: { star: false, tv: 100, normals: 'GSM', doubles: 'AP', free: [] },
  [PLAYER_TYPE.ChaosdwarfBlocker]: { star: false, tv: 70, normals: 'GS', doubles: 'APM', free: [SKILL.Block, SKILL.Tackle, SKILL.ThickSkull] },
  [PLAYER_TYPE.ChaosdwarfBullcentaur]: { star: false, tv: 130, normals: 'GS', doubles: 'AP', free: [SKILL.Sprint, SKILL.SureFeet, SKILL.ThickSkull] },
  [PLAYER_TYPE.ChaosdwarfHobgoblin]: { star: false, tv: 40, normals: 'G', doubles: 'APS', free: [] },
  [PLAYER_TYPE.ChaosdwarfMinotaur]: { star: false, tv: 150, normals: 'S', doubles: 'GAPM', free: [SKILL.Loner, SKILL.Frenzy, SKILL.Horns, SKILL.MightyBlow, SKILL.ThickSkull, SKILL.WildAnimal] },
  [PLAYER_TYPE.DarkelfLineman]: { star: false, tv: 70, normals: 'GA', doubles: 'PS', free: [] },
  [PLAYER_TYPE.DarkelfRunner]: { star: false, tv: 80, normals: 'GAP', doubles: 'S', free: [SKILL.DumpOff] },
  [PLAYER_TYPE.DarkelfAssasin]: { star: false, tv: 90, normals: 'GA', doubles: 'PS', free: [SKILL.Shadowing, SKILL.Stab] },
  [PLAYER_TYPE.DarkelfBlitzer]: { star: false, tv: 100, normals: 'GA', doubles: 'PS', free: [SKILL.Block] },
  [PLAYER_TYPE.DarkelfWitchelf]: { star: false, tv: 110, normals: 'GA', doubles: 'PS', free: [SKILL.Frenzy, SKILL.Dodge, SKILL.JumpUp] },
  [PLAYER_TYPE.DwarfLongbeard]: { star: false, tv: 70, normals: 'GS', doubles: 'AP', free: [SKILL.Block, SKILL.ThickSkull, SKILL.Tackle] },
  [PLAYER_TYPE.DwarfBlitzer]: { star: false, tv: 80, normals: 'PS', doubles: 'AP', free: [SKILL.Block, SKILL.ThickSkull] },
  [PLAYER_TYPE.DwarfRunner]: { star: false, tv: 80, normals: 'GP', doubles: 'AS', free: [SKILL.SureHands, SKILL.ThickSkull] },
  [PLAYER_TYPE.DwarfTrollslayer]: { star: false, tv: 90, normals: 'GS', doubles: 'AP', free: [SKILL.Block, SKILL.ThickSkull, SKILL.Dauntless, SKILL.Frenzy] },
  [PLAYER_TYPE.DwarfDeathroller]: { star: false, tv: 160, normals: 'S', doubles: 'GAP', free: [SKILL.BreakTackle, SKILL.DirtyPlayer, SKILL.Juggernaut, SKILL.MightyBlow, SKILL.NoHands, SKILL.SecretWeapon, SKILL.StandFirm, SKILL.Loner] },
  [PLAYER_TYPE.GoblinGoblin]: { star: false, tv: 40, normals: 'A', doubles: 'GPS', free: [SKILL.RightStuff, SKILL.Dodge, SKILL.Stunty] },
  [PLAYER_TYPE.GoblinLooney]: { star: false, tv: 40, normals: 'A', doubles: 'GPS', free: [SKILL.SecretWeapon, SKILL.Stunty, SKILL.Chainsaw] },
  [PLAYER_TYPE.GoblinTroll]: { star: false, tv: 110, normals: 'S', doubles: 'GAP', free: [SKILL.AlwaysHungry, SKILL.Loner, SKILL.MightyBlow, SKILL.ReallyStupid, SKILL.Regeneration, SKILL.ThrowTeamMate] },
  [PLAYER_TYPE.GoblinPogo]: { star: false, tv: 70, normals: 'A', doubles: 'GPS', free: [SKILL.Dodge, SKILL.Leap, SKILL.VeryLongLegs, SKILL.Stunty] },
  [PLAYER_TYPE.GoblinFanatic]: { star: false, tv: 70, normals: 'S', doubles: 'GAP', free: [SKILL.SecretWeapon, SKILL.BallAndChain, SKILL.NoHands, SKILL.Stunty] },
  [PLAYER_TYPE.GoblinBomber]: { star: false, tv: 40, normals: 'A', doubles: 'GPS', free: [SKILL.Bombardier, SKILL.Dodge, SKILL.Stunty, SKILL.SecretWeapon] },
  [PLAYER_TYPE.HalflingHalfling]: { star: false, tv: 30, normals: 'A', doubles: 'GPS', free: [SKILL.Dodge, SKILL.RightStuff, SKILL.Stunty] },
  [PLAYER_TYPE.HalflingTreeman]: { star: false, tv: 120, normals: 'S', doubles: 'GAP', free: [SKILL.MightyBlow, SKILL.StandFirm, SKILL.StrongArm, SKILL.ThickSkull, SKILL.ThrowTeamMate, SKILL.TakeRoot] },
  [PLAYER_TYPE.HighelfLineman]: { star: false, tv: 70, normals: 'GA', doubles: 'PS', free: [] },
  [PLAYER_TYPE.HighelfThrower]: { star: false, tv: 90, normals: 'GAP', doubles: 'S', free: [SKILL.Pass, SKILL.SafeThrow] },
  [PLAYER_TYPE.HighelfCatch]: { star: false, tv: 90, normals: 'GA', doubles: 'PS', free: [SKILL.Catch] },
  [PLAYER_TYPE.HighelfBlitzer]: { star: false, tv: 100, normals: 'GA', doubles: 'PS', free: [SKILL.Block] },
  [PLAYER_TYPE.HumanLineman]: { star: false, tv: 50, normals: 'G', doubles: 'APS', free: [] },
  [PLAYER_TYPE.HumanCatcher]: { star: false, tv: 70, normals: 'GA', doubles: 'PS', free: [SKILL.Dodge, SKILL.Catch] },
  [PLAYER_TYPE.HumanThrower]: { star: false, tv: 70, normals: 'GP', doubles: 'AS', free: [SKILL.Pass, SKILL.SureHands] },
  [PLAYER_TYPE.HumanBlitzer]: { star: false, tv: 90, normals: 'GS', doubles: 'AP', free: [SKILL.Block] },
  [PLAYER_TYPE.HumanOgre]: { star: false, tv: 130, normals: 'S', doubles: 'GAP', free: [SKILL.BoneHead, SKILL.MightyBlow, SKILL.ThickSkull, SKILL.ThrowTeamMate, SKILL.Loner] },
  [PLAYER_TYPE.KhemriLineman]: { star: false, tv: 40, normals: 'G', doubles: 'APS', free: [SKILL.Regeneration, SKILL.ThickSkull] },
  [PLAYER_TYPE.KhemriThrower]: { star: false, tv: 70, normals: 'GP', doubles: 'AS', free: [SKILL.Pass, SKILL.Regeneration, SKILL.SureHands] },
  [PLAYER_TYPE.KhemriBlitzer]: { star: false, tv: 90, normals: 'GS', doubles: 'AP', free: [SKILL.Block, SKILL.Regeneration] },
  [PLAYER_TYPE.KhemriMummy]: { star: false, tv: 100, normals: 'S', doubles: 'GAP', free: [SKILL.Decay, SKILL.Regeneration] },
  [PLAYER_TYPE.LizardmanSkink]: { star: false, tv: 60, normals: 'A', doubles: 'GPS', free: [SKILL.Stunty, SKILL.MightyBlow] },
  [PLAYER_TYPE.LizardmanSaurus]: { star: false, tv: 80, normals: 'GS', doubles: 'AP', free: [] },
  [PLAYER_TYPE.LizardmanKroxigor]: { star: false, tv: 140, normals: 'S', doubles: 'GAP', free: [SKILL.Loner, SKILL.MightyBlow, SKILL.BoneHead, SKILL.PrehensileTail, SKILL.ThickSkull] },
  [PLAYER_TYPE.NecromanticZombie]: { star: false, tv: 40, normals: 'G', doubles: 'APS', free: [SKILL.Regeneration] },
  [PLAYER_TYPE.NecromanticGhoul]: { star: false, tv: 70, normals: 'GA', doubles: 'PS', free: [SKILL.Dodge] },
  [PLAYER_TYPE.NecromanticWight]: { star: false, tv: 90, normals: 'GS', doubles: 'AP', free: [SKILL.Block, SKILL.Regeneration] },
  [PLAYER_TYPE.NecromanticGolem]: { star: false, tv: 110, normals: 'GS', doubles: 'AP', free: [SKILL.Regeneration, SKILL.StandFirm, SKILL.ThickSkull] },
  [PLAYER_TYPE.NecromanticWerewolf]: { star: false, tv: 120, normals: 'GA', doubles: 'PS', free: [SKILL.Regeneration, SKILL.Claw, SKILL.Frenzy] },
  [PLAYER_TYPE.NorseLineman]: { star: false, tv: 50, normals: 'G', doubles: 'APS', free: [SKILL.Block] },
  [PLAYER_TYPE.NorseThrower]: { star: false, tv: 70, normals: 'GP', doubles: 'AS', free: [SKILL.Block, SKILL.Pass] },
  [PLAYER_TYPE.NorseRunner]: { star: false, tv: 90, normals: 'GA', doubles: 'PS', free: [SKILL.Block, SKILL.Dauntless] },
  [PLAYER_TYPE.NorseBerserker]: { star: false, tv: 90, normals: 'GS', doubles: 'AP', free: [SKILL.Block, SKILL.Frenzy, SKILL.JumpUp] },
  [PLAYER_TYPE.NorseUlfwerener]: { star: false, tv: 110, normals: 'GS', doubles: 'AP', free: [SKILL.Frenzy] },
  [PLAYER_TYPE.NorseYhetee]: { star: false, tv: 140, normals: 'S', doubles: 'GAP', free: [SKILL.Loner, SKILL.Claw, SKILL.DisturbingPresence, SKILL.Frenzy, SKILL.WildAnimal] },
  [PLAYER_TYPE.NurgleRotter]: { star: false, tv: 40, normals: 'GM', doubles: 'APS', free: [SKILL.Decay, SKILL.NurglesRot] },
  [PLAYER_TYPE.NurglePestigor]: { star: false, tv: 80, normals: 'GSM', doubles: 'AP', free: [SKILL.Horns, SKILL.NurglesRot, SKILL.Regeneration] },
  [PLAYER_TYPE.NurgleWarrior]: { star: false, tv: 110, normals: 'GSM', doubles: 'AP', free: [SKILL.DisturbingPresence, SKILL.FoulAppearance, SKILL.NurglesRot, SKILL.Regeneration] },
  [PLAYER_TYPE.NurgleBeast]: { star: false, tv: 140, normals: 'S', doubles: 'GAPM', free: [SKILL.Loner, SKILL.DisturbingPresence, SKILL.FoulAppearance, SKILL.MightyBlow, SKILL.NurglesRot, SKILL.ReallyStupid, SKILL.Regeneration, SKILL.Tentacles] },
  [PLAYER_TYPE.OgreSnotling]: { star: false, tv: 20, normals: 'A', doubles: 'GPS', free: [SKILL.Dodge, SKILL.RightStuff, SKILL.SideStep, SKILL.Stunty, SKILL.Titchy] },
  [PLAYER_TYPE.OgreOgre]: { star: false, tv: 140, normals: 'S', doubles: 'GAP', free: [SKILL.BoneHead, SKILL.MightyBlow, SKILL.ThickSkull, SKILL.ThrowTeamMate] },
  [PLAYER_TYPE.OrcLineman]: { star: false, tv: 50, normals: 'G', doubles: 'APS', free: [] },
  [PLAYER_TYPE.OrcGoblin]: { star: false, tv: 40, normals: 'A', doubles: 'GPS', free: [SKILL.RightStuff, SKILL.Dodge, SKILL.Stunty] },
  [PLAYER_TYPE.OrcThrower]: { star: false, tv: 70, normals: 'GP', doubles: 'AS', free: [SKILL.Pass, SKILL.SureHands] },
  [PLAYER_TYPE.OrcBlocker]: { star: false, tv: 80, normals: 'GS', doubles: 'AP', free: [] },
  [PLAYER_TYPE.OrcBlitzer]: { star: false, tv: 80, normals: 'GS', doubles: 'AP', free: [SKILL.Block] },
  [PLAYER_TYPE.OrcTroll]: { star: false, tv: 110, normals: 'S', doubles: 'GAP', free: [SKILL.Loner, SKILL.AlwaysHungry, SKILL.MightyBlow, SKILL.ReallyStupid, SKILL.Regeneration, SKILL.ThrowTeamMate] },
  [PLAYER_TYPE.ProelfLineman]: { star: false, tv: 60, normals: 'GA', doubles: 'PS', free: [] },
  [PLAYER_TYPE.ProelfThrower]: { star: false, tv: 70, normals: 'GAP', doubles: 'S', free: [SKILL.Pass] },
  [PLAYER_TYPE.ProelfCatcher]: { star: false, tv: 100, normals: 'GA', doubles: 'PS', free: [SKILL.Catch, SKILL.NervesOfSteel] },
  [PLAYER_TYPE.ProelfBlitzer]: { star: false, tv: 110, normals: 'GA', doubles: 'PS', free: [SKILL.Block, SKILL.SideStep] },
  [PLAYER_TYPE.SkavenLineman]: { star: false, tv: 50, normals: 'G', doubles: 'APSM', free: [] },
  [PLAYER_TYPE.SkavenThrower]: { star: false, tv: 70, normals: 'GP', doubles: 'ASM', free: [SKILL.Pass, SKILL.SureHands] },
  [PLAYER_TYPE.SkavenRunner]: { star: false, tv: 80, normals: 'GA', doubles: 'PSM', free: [SKILL.Dodge] },
  [PLAYER_TYPE.SkavenBlitzer]: { star: false, tv: 90, normals: 'GS', doubles: 'APM', free: [SKILL.Block] },
  [PLAYER_TYPE.SkavenRatogre]: { star: false, tv: 150, normals: 'S', doubles: 'GAPM', free: [SKILL.Frenzy, SKILL.MightyBlow, SKILL.Loner, SKILL.PrehensileTail, SKILL.WildAnimal] },
  [PLAYER_TYPE.UndeadSkeleton]: { star: false, tv: 40, normals: 'G', doubles: 'ASP', free: [SKILL.Regeneration, SKILL.ThickSkull] },
  [PLAYER_TYPE.UndeadZombie]: { star: false, tv: 40, normals: 'G', doubles: 'APS', free: [SKILL.Regeneration] },
  [PLAYER_TYPE.UndeadGhoul]: { star: false, tv: 70, normals: 'GA', doubles: 'SP', free: [SKILL.Dodge] },
  [PLAYER_TYPE.UndeadWight]: { star: false, tv: 90, normals: 'GS', doubles: 'AP', free: [SKILL.Regeneration, SKILL.Block] },
  [PLAYER_TYPE.UndeadMummy]: { star: false, tv: 120, normals: 'S', doubles: 'GAP', free: [SKILL.Regeneration, SKILL.MightyBlow] },
  [PLAYER_TYPE.UnderworldGoblin]: { star: false, tv: 40, normals: 'AM', doubles: 'GPS', free: [SKILL.RightStuff, SKILL.Dodge, SKILL.Stunty] },
  [PLAYER_TYPE.UnderworldLineman]: { star: false, tv: 50, normals: 'GM', doubles: 'APS', free: [SKILL.Animosity] },
  [PLAYER_TYPE.UnderworldThrower]: { star: false, tv: 70, normals: 'GPM', doubles: 'AS', free: [SKILL.Animosity, SKILL.Pass, SKILL.SureHands] },
  [PLAYER_TYPE.UnderworldBlitzer]: { star: false, tv: 90, normals: 'GSM', doubles: 'AP', free: [SKILL.Animosity, SKILL.Block] },
  [PLAYER_TYPE.UnderworldTroll]: { star: false, tv: 110, normals: 'SM', doubles: 'GAP', free: [SKILL.Loner, SKILL.AlwaysHungry, SKILL.MightyBlow, SKILL.ReallyStupid, SKILL.Regeneration, SKILL.ThrowTeamMate] },
  [PLAYER_TYPE.VampireThrall]: { star: false, tv: 40, normals: 'G', doubles: 'ASP', free: [] },
  [PLAYER_TYPE.VampireVampire]: { star: false, tv: 110, normals: 'GAS', doubles: 'P', free: [SKILL.BloodLust, SKILL.HypnoticGaze, SKILL.Regeneration] },
  [PLAYER_TYPE.WoodelfLineman]: { star: false, tv: 70, normals: 'GA', doubles: 'PS', free: [] },
  [PLAYER_TYPE.WoodelfCatcher]: { star: false, tv: 90, normals: 'GA', doubles: 'PS', free: [SKILL.Catch, SKILL.Dodge, SKILL.Sprint] },
  [PLAYER_TYPE.WoodelfThrower]: { star: false, tv: 90, normals: 'GAP', doubles: 'S', free: [SKILL.Pass] },
  [PLAYER_TYPE.WoodelfWardancer]: { star: false, tv: 120, normals: 'GA', doubles: 'PS', free: [SKILL.Block, SKILL.Dodge, SKILL.Leap] },
  [PLAYER_TYPE.WoodelfTree]: { star: false, tv: 120, normals: 'S', doubles: 'GAP', free: [SKILL.MightyBlow, SKILL.Loner, SKILL.StandFirm, SKILL.StrongArm, SKILL.ThickSkull, SKILL.ThrowTeamMate, SKILL.TakeRoot] },
  [PLAYER_TYPE.KislevLineman]: { star: false, tv: 60, normals: 'G', doubles: 'APS', free: [SKILL.Leap, SKILL.VeryLongLegs] },
  [PLAYER_TYPE.KislevCatcher]: { star: false, tv: 80, normals: 'GA', doubles: 'PS', free: [SKILL.Leap, SKILL.VeryLongLegs, SKILL.DivingCatch] },
  [PLAYER_TYPE.KislevBlitzer]: { star: false, tv: 110, normals: 'GAS', doubles: 'P', free: [SKILL.Leap, SKILL.VeryLongLegs, SKILL.JumpUp, SKILL.DivingTackle] },
  [PLAYER_TYPE.KislevBear]: { star: false, tv: 140, normals: 'S', doubles: 'GAP', free: [SKILL.PrehensileTail, SKILL.MightyBlow, SKILL.ThickSkull, SKILL.BoneHead, SKILL.Loner] },
  [PLAYER_TYPE.BretonniaPeasant]: { star: false, tv: 40, normals: 'G', doubles: 'APS', free: [SKILL.Fend] },
  [PLAYER_TYPE.BretonniaBlocker]: { star: false, tv: 70, normals: 'GS', doubles: 'AP', free: [SKILL.Wrestle] },
  [PLAYER_TYPE.BretonniaKnight]: { star: false, tv: 110, normals: 'GAP', doubles: 'S', free: [SKILL.Block, SKILL.Catch, SKILL.Dauntless] },
  [PLAYER_TYPE.StarBarikFarblast]: { tv: 60, star: true },
  [PLAYER_TYPE.StarBerthaBigfist]: { tv: 290, star: true },
  [PLAYER_TYPE.StarBomberDribblesnot]: { tv: 60, star: true },
  [PLAYER_TYPE.StarBoomerEziasson]: { tv: 60, star: true },
  [PLAYER_TYPE.StarBrickFarth]: { tv: 250, star: true },
  [PLAYER_TYPE.StarCountLuthorvonDrakenborg]: { tv: 390, star: true },
  [PLAYER_TYPE.StarCrazyIgor]: { tv: 120, star: true },
  [PLAYER_TYPE.StarDeeprootStrongbranch]: { tv: 300, star: true },
  [PLAYER_TYPE.StarDolfarLongstride]: { tv: 150, star: true },
  [PLAYER_TYPE.StarEldrilSidewinder]: { tv: 200, star: true },
  [PLAYER_TYPE.StarFezglitch]: { tv: 100, star: true },
  [PLAYER_TYPE.StarFlintChurnblade]: { tv: 130, star: true },
  [PLAYER_TYPE.StarFungusTheLoon]: { tv: 80, star: true },
  [PLAYER_TYPE.StarGlartSmashripJr]: { tv: 210, star: true },
  [PLAYER_TYPE.StarGrashnakBlackhoof]: { tv: 310, star: true },
  [PLAYER_TYPE.StarGriffOberwald]: { tv: 320, star: true },
  [PLAYER_TYPE.StarGrimIronjaw]: { tv: 220, star: true },
  [PLAYER_TYPE.StarGrotty]: { tv: 40, star: true },
  [PLAYER_TYPE.StarHackEnslash]: { tv: 120, star: true },
  [PLAYER_TYPE.StarHakflemSkuttlespike]: { tv: 200, star: true },
  [PLAYER_TYPE.StarHeadsplitter]: { tv: 340, star: true },
  [PLAYER_TYPE.StarHelmutWulf]: { tv: 110, star: true },
  [PLAYER_TYPE.StarHemlock]: { tv: 170, star: true },
  [PLAYER_TYPE.StarHorkonHeartripper]: { tv: 210, star: true },
  [PLAYER_TYPE.StarHtharkTheUnstoppable]: { tv: 330, star: true },
  [PLAYER_TYPE.StarHubrisRakarth]: { tv: 260, star: true },
  [PLAYER_TYPE.StarHumerusCarpal]: { tv: 130, star: true },
  [PLAYER_TYPE.StarIcepeltHammerblow]: { tv: 330, star: true },
  [PLAYER_TYPE.StarIthacaBenoin]: { tv: 220, star: true },
  [PLAYER_TYPE.StarJEarlice]: { tv: 180, star: true },
  [PLAYER_TYPE.StarJordelFreshbreeze]: { tv: 260, star: true },
  [PLAYER_TYPE.StarLewdgripWhiparm]: { tv: 150, star: true },
  [PLAYER_TYPE.StarLordBorakTheDespoiler]: { tv: 300, star: true },
  [PLAYER_TYPE.StarLottabottol]: { tv: 220, star: true },
  [PLAYER_TYPE.StarMaxSpleenripper]: { tv: 130, star: true },
  [PLAYER_TYPE.StarMightyZug]: { tv: 260, star: true },
  [PLAYER_TYPE.StarMorgNThorg]: { tv: 430, star: true },
  [PLAYER_TYPE.StarNobblaBlackwart]: { tv: 130, star: true },
  [PLAYER_TYPE.StarPrinceMoranion]: { tv: 230, star: true },
  [PLAYER_TYPE.StarPuggyBaconbreath]: { tv: 140, star: true },
  [PLAYER_TYPE.StarQuetzalLeap]: { tv: 250, star: true },
  [PLAYER_TYPE.StarRamtutIII]: { tv: 380, star: true },
  [PLAYER_TYPE.StarRashnakBackstabber]: { tv: 200, star: true },
  [PLAYER_TYPE.StarRipper]: { tv: 270, star: true },
  [PLAYER_TYPE.StarRoxannaDarknail]: { tv: 250, star: true },
  [PLAYER_TYPE.StarScrappaSorehead]: { tv: 270, star: true },
  [PLAYER_TYPE.StarSetekh]: { tv: 220, star: true },
  [PLAYER_TYPE.StarSinnedbad]: { tv: 80, star: true },
  [PLAYER_TYPE.StarSkitterStabStab]: { tv: 160, star: true },
  [PLAYER_TYPE.StarSlibli]: { tv: 250, star: true },
  [PLAYER_TYPE.StarSoarenHightower]: { tv: 180, star: true },
  [PLAYER_TYPE.StarUgrothBolgrot]: { tv: 100, star: true },
  [PLAYER_TYPE.StarVaragGhoulChewer]: { tv: 290, star: true },
  [PLAYER_TYPE.StarWilhelmChaney]: { tv: 240, star: true },
  [PLAYER_TYPE.StarWillowRosebark]: { tv: 150, star: true },
  [PLAYER_TYPE.StarZaraTheSlayer]: { tv: 270, star: true },
  [PLAYER_TYPE.StarZzhargMadeye]: { tv: 90, star: true },
  [PLAYER_TYPE.Unknown]: { tv: 0, star: true },
};

export interface Casualty {
  dice: number,
  icon: string,
  result: string,
  effect: string
}

export const Casualties: Casualty[] = [
  { dice: 38, icon: "BadlyHurt", result: "Badly Hurt", effect: "No long term effect" },
  { dice: 41, icon: "BrokenRibs", result: "Broken Rib", effect: "Miss next game " },
  { dice: 42, icon: "GroinStrain", result: "Groin Strain", effect: "Miss next game " },
  { dice: 43, icon: "GougedEye", result: "Gouged Eye", effect: "Miss next game" },
  { dice: 44, icon: "BrokenJaw", result: "Broken Jaw", effect: "Miss next game " },
  { dice: 45, icon: "FracturedArm", result: "Fractured Arm", effect: "Miss next game " },
  { dice: 46, icon: "FracturedLeg", result: "Fractured Leg", effect: "Miss next game " },
  { dice: 47, icon: "SmashedHand", result: "Smashed Hand ", effect: "Miss next game " },
  { dice: 48, icon: "PinchedNerve", result: "Pinched Nerve", effect: "Miss next game " },
  { dice: 51, icon: "NigglingInjury2", result: "Damaged Back", effect: "Niggling Injury" },
  { dice: 52, icon: "NigglingInjury2", result: "Smashed Knee", effect: "Niggling Injury" },
  { dice: 53, icon: "MovementBust", result: "Smashed Hip", effect: "-1 MA" },
  { dice: 54, icon: "MovementBust", result: "Smashed Ankle", effect: "-1 MA" },
  { dice: 55, icon: "ArmourBust", result: "Serious Concussion", effect: "-1 AV" },
  { dice: 56, icon: "ArmourBust", result: "Fractured Skull", effect: "-1 AV" },
  { dice: 57, icon: "AgilityBust", result: "Broken Neck", effect: "-1 AG" },
  { dice: 58, icon: "StrengthBust", result: "Smashed Collar Bone", effect: "-1 ST" },
  { dice: 61, icon: "Dead", result: "Dead", effect: "Dead!" },
];

export enum ROLL {
  GFI = 1,
  Dodge = 2,
  Armor = 3,
  Injury = 4,
  Block = 5,
  StandUp = 6,
  Pickup = 7,
  Casualty = 8,
  Catch = 9,
  KickoffScatter = 10,
  ThrowIn = 11,
  Pass = 12,
  Push = 13,
  FollowUp = 14,
  FoulPenalty = 15,
  Interception = 16,
  WakeUp = 17,
  TouchBack = 19,
  BoneHead = 20,
  ReallyStupid = 21,
  WildAnimal = 22,
  Loner = 23,
  Landing = 24,
  Regeneration = 25,
  InaccuratePassScatter = 26,
  AlwaysHungry = 27,
  EatTeammate = 28,
  Dauntless = 29,
  SafeThrow = 30,
  JumpUp = 31,
  Shadowing = 32,
  Stab = 34,
  Leap = 36,
  FoulAppearance = 37,
  Tentacles = 38,
  ChainsawKickback = 39,
  TakeRoot = 40,
  BallAndChain = 41,
  HailMaryPass = 42,
  DivingTackle = 44,
  Pro = 45,
  HypnoticGaze = 46,
  Animosity = 49,
  Bloodlust = 50,
  Bite = 51,
  Bribe = 52,
  HalflingChef = 53,
  Fireball = 54,
  LightningBolt = 55,
  ThrowTeammate = 56,
  Multiblock = 57,
  KickoffGust = 58,
  PileOnArmorRoll = 59,
  PileOnInjuryRoll = 60,
  Wrestle2 = 61, // Some sort of wrestle roll that doesn't do anything,
  DodgePick = 62,
  StandFirm = 63,
  Juggernaut = 64,
  StandFirm2 = 65,
  RaiseDead = 66,
  Fans = 69,
  Weather = 70,
  SwealteringHeat = 71,
  BombKD = 72,
  ChainsawArmor = 73,
  KickoffEvent = 100, // Synthetic Roll Type
}

export const STAR_NAMES: Record<string, string> = {
  PLAYER_NAMES_CHAMPION_SKITTER_FALLBACK: "Skitter Stab-Stab",
  PLAYER_NAMES_CHAMPION_MIGHTYZUG: "Mighty Zug",
  PLAYER_NAMES_CHAMPION_WILHELM: "Wilhelm Chaney",
  PLAYER_NAMES_CHAMPION_HUMAIN: "Griff Oberwald",
  PLAYER_NAMES_CHAMPION_ELDRILSIDEWINDER: "Eldril Sidewinder",
  PLAYER_NAMES_CHAMPION_RAMTUTIII: "Ramtut III",
  PLAYER_NAMES_CHAMPION_LORDBORAKTHEDESPOILER: "Lord Borak the Despoiler",
  PLAYER_NAMES_CHAMPION_LEWDGRIP_FALLBACK: "Lewdgrip Whiparm",
  PLAYER_NAMES_CHAMPION_GLART: "Glart Smashrip",
  PLAYER_NAMES_CHAMPION_NEKBREKEREKH: "Setekh",
  PLAYER_NAMES_CHAMPION_HUBRISRAKARTH: "Hubris Rakarth",
  PLAYER_NAMES_CHAMPION_MORANION_FALLBACK: "Prince Moranion",
  PLAYER_NAMES_CHAMPION_SOAREN: "Soaren Hightower",
  PLAYER_NAMES_CHAMPION_BARIK: "Barik Farblast",
  PLAYER_NAMES_CHAMPION_HOMME_LEZARD: "Slibli",
  PLAYER_NAMES_CHAMPION_DARK_ELF: "Horkon Heartripper",
  PLAYER_NAMES_CHAMPION_SKAVEN_FALLBACK: "Headsplitter",
  PLAYER_NAMES_CHAMPION_ORC: "Varag Ghoul-Chewer",
  PLAYER_NAMES_CHAMPION_CHAOS: "Grashnak Blackhoof",
  PLAYER_NAMES_CHAMPION_ZZHARGMADEYE: "Zzharg Madeye",
  PLAYER_NAMES_CHAMPION_HEMLOCK: "Hemlock",
  PLAYER_NAMES_CHAMPION_LOTTABOTTOL_FALLBACK: "Lottabottol",
  PLAYER_NAMES_CHAMPION_MORGNTHORG: "Morg 'n' Thorg",
  PLAYER_NAMES_CHAMPION_UNDEAD: "Count Luthor Von Drakenborg",
  PLAYER_NAMES_CHAMPION_FUNGUS_FALLBACK: "Fungus the Loon",
  PLAYER_NAMES_CHAMPION_HACK_FALLBACK: "Hack Enslash",
  PLAYER_NAMES_CHAMPION_DEEPROOTSTRONGBRANCH: "Deeproot Strongbranch",
  PLAYER_NAMES_CHAMPION_DOLFAR: "Dolfar Longstride",
  PLAYER_NAMES_CHAMPION_GOBELIN: "Ripper",
  PLAYER_NAMES_CHAMPION_HELMUT_FALLBACK: "Helmut Wulf",
  PLAYER_NAMES_CHAMPION_ROXANNA_FALLBACK: "Roxanna Darknail",
  PLAYER_NAMES_CHAMPION_ZARATHESLAYER: "Zara the Slayer",
  PLAYER_NAMES_CHAMPION_NOBBLA_FALLBACK: "Nobbla Blackwart",
  PLAYER_NAMES_CHAMPION_MAX_FALLBACK: "Max Spleenripper",
  PLAYER_NAMES_CHAMPION_SCRAPPASOREHEAD: "Scrappa Sorehead",
  PLAYER_NAMES_CHAMPION_GROTTY: "Grotty",
  PLAYER_NAMES_CHAMPION_BRICK: "Brick Far'th",
  PLAYER_NAMES_CHAMPION_BOOMER_FALLBACK: "Boomer Eziasson",
  PLAYER_NAMES_CHAMPION_WILLOW_FALLBACK: "Willow Rosebark",
  PLAYER_NAMES_CHAMPION_BOMBERDRIBBLESNOT: "Bomber Dribblesnot",
  PLAYER_NAMES_CHAMPION_UGROTH_FALLBACK: "Ugroth Bolgrot",
  PLAYER_NAMES_CHAMPION_FEZGLITCH_FALLBACK: "Fezglitch",
  PLAYER_NAMES_CHAMPION_BERTHA_FALLBACK: "Bertha Bigfist",
  PLAYER_NAMES_CHAMPION_PUGGY_FALLBACK: "Puggy Baconbreath",
  PLAYER_NAMES_CHAMPION_HUMERUS_FALLBACK: "Humerus Carpal",
  PLAYER_NAMES_CHAMPION_IGOR_FALLBACK: "Crazy Igor",
  PLAYER_NAMES_CHAMPION_HAKFLEMSKUTTLESPIKE: "Hakflem Skuttlespike",
  PLAYER_NAMES_CHAMPION_NAIN: "Grim Ironjaw",
  PLAYER_NAMES_CHAMPION_FLINT_FALLBACK: "Flint Churnblade",
  PLAYER_NAMES_CHAMPION_ELFE_SYLVAIN: "Jordel Freshbreeze",
}

export enum SIDE {
  home = 0,
  away = 1,
}

export enum INDUCEMENT_CATEGORY {

}

export function weatherTable(roll: number) {
  switch (roll) {
    case 2: return WEATHER.SwelteringHeat
    case 3: return WEATHER.VerySunny
    case 11: return WEATHER.PouringRain
    case 12: return WEATHER.Blizzard
    default:
      return WEATHER.Nice
  }
}

export enum STATUS {
  standing = 0,
  prone = 1,
  stunned = 2,
}

export enum MODIFIER_TYPE {
  unknownModifier2 = 2, // On Dodge
  unknownModifier5 = 5, // On Pickup
  teamAssist = 11,
  opponentAssist = 12,
  unknownModifier13 = 13, // ON block
}