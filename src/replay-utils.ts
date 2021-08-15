import type * as BB2 from './replay/BB2.js';
import * as Internal from "./replay/Internal.js";
import parser from 'fast-xml-parser';
import he from 'he';

export function ensureList<T>(objOrList: BB2.MList<T> | undefined): T[] {
  if (objOrList && objOrList instanceof Array) {
    return objOrList;
  } else if (objOrList) {
    return [objOrList as T];
  } else {
    return [];
  }
}

export function ensureKeyedList<K extends string, T>(key: K, obj: BB2.KeyedMList<K, T>): T[] {
  if (obj == "") {
    return [];
  }
  let v: BB2.MList<T> = obj[key];
  return ensureList(v);
}

export function translateStringNumberList(str: string | number | undefined): number[] {
  if (str === undefined || str === null) return [];
  str = str.toString();

  var stripped = str.replace(/[()]/g, '');
  var textList = stripped.split(",");

  var numberList = [];
  for (var i = 0; i < textList.length; i++) {
    numberList.push(parseInt(textList[i]));
  }
  return numberList;
}

export enum REPLAY_SUB_STEP {
  SetupAction = 1,
  Kickoff = 2,
  BoardAction = 3,
  EndTurn = 4,
  BoardState = 5,
  NextReplayStep = 6,
}

export const REPLAY_KEY: Record<Exclude<REPLAY_SUB_STEP, REPLAY_SUB_STEP.NextReplayStep>, string> = {
  [REPLAY_SUB_STEP.SetupAction]: 'RulesEventSetUpAction',
  [REPLAY_SUB_STEP.Kickoff]: 'RulesEventKickOffTable',
  [REPLAY_SUB_STEP.BoardAction]: 'RulesEventBoardAction',
  [REPLAY_SUB_STEP.EndTurn]: 'RulesEventEndTurn',
  [REPLAY_SUB_STEP.BoardState]: 'BoardState',
}


export function nextState(replayStep: BB2.ReplayStep, subStep: REPLAY_SUB_STEP) {
  for (var nextSubStep = subStep; nextSubStep < REPLAY_SUB_STEP.NextReplayStep; nextSubStep++) {
    if (nextSubStep == REPLAY_SUB_STEP.NextReplayStep) {
      return REPLAY_SUB_STEP.NextReplayStep;
    } else {
      if (REPLAY_KEY[nextSubStep] as string in replayStep) {
        return nextSubStep;
      }
    }
  }
  return REPLAY_SUB_STEP.NextReplayStep;
}

export type ReplayPosition = GameOver | BB2ReplayPosition | InternalReplayPosition;

export type GameOver = { end: true }

export type BB2BoardActionResultPosition = {
  stepIdx: number,
  step: BB2.GameTurnStep,
  subStep: REPLAY_SUB_STEP.BoardAction,
  actionIdx: number,
  action: BB2.RulesEventBoardAction,
  resultIdx: number,
  result: BB2.ActionResult<BB2.RulesEventBoardAction>
};
export type BB2BoardStatePosition = {
  stepIdx: number,
  step: BB2.GameTurnStep,
  subStep: REPLAY_SUB_STEP.BoardState,
  boardState: BB2.BoardState,
};

export type BB2EndTurnPosition = {
  stepIdx: number,
  step: BB2.GameTurnStep,
  subStep: REPLAY_SUB_STEP.EndTurn,
  endTurn: BB2.RulesEventEndTurn,
};

export type BB2KickoffPosition = {
  stepIdx: number,
  step: BB2.GameTurnStep,
  subStep: REPLAY_SUB_STEP.Kickoff,
  kickoff: BB2.RulesEventKickOffTable,
};

export type BB2KickoffMessagePosition = {
  stepIdx: number,
  step: BB2.GameTurnStep,
  subStep: REPLAY_SUB_STEP.Kickoff,
  kickoff: BB2.RulesEventKickOffTable,
  kickoffMessage: BB2.KickoffEventMessageData,
};

export type BB2SetupPosition = {
  stepIdx: number,
  step: BB2.SetUpActionStep,
  subStep: REPLAY_SUB_STEP.SetupAction,
  setup: BB2.RulesEventSetUpAction,
};

export type BB2ReplayPosition =
  BB2BoardActionResultPosition | BB2BoardStatePosition | BB2EndTurnPosition | BB2KickoffPosition | BB2KickoffMessagePosition | BB2SetupPosition;

export type InternalReplayPosition =
  {
    type: 'gameStart',
    replay: Internal.Replay,
  } |
  {
    type: 'driveStart',
    driveIdx: number,
    drive: Internal.Drive
  } |
  {
    type: 'wakeupRoll',
    driveIdx: number,
    wakeupSide: Internal.Side,
    rollIdx: number,
    roll: Internal.WakeupRoll,
  } |
  {
    type: 'setupAction',
    driveIdx: number,
    setupSide: Internal.Side,
    actionIdx: number,
    action: Internal.SetupAction,
  } | {
    type: 'wizardRoll',
    driveIdx: number,
    turnIdx: number,
    wizard: 'start' | 'end',
    roll: Internal.WizardRoll,
  } | {
    type: 'actionStep',
    driveIdx: number,
    turnIdx: number,
    activationIdx: number,
    actionStepIdx: number,
    actionStep: Internal.ActionStep,
  }

export function gameOver(position: ReplayPosition): position is GameOver {
  return 'end' in position;
}

export function isBB2Position(position: ReplayPosition): position is BB2ReplayPosition {
  return 'stepIdx' in position;
}

export function isInternalPosition(position: ReplayPosition): position is InternalReplayPosition {
  return !(gameOver(position) || isBB2Position(position));
}

export interface ReplayPreview {
  start: number,
  end: number | undefined,
}

export function linearReplay(replay: Internal.Replay & { _linearReplayCache?: ReplayPosition[] }): ReplayPosition[] {
  if (!replay._linearReplayCache) {
    replay._linearReplayCache = new Array(..._linearReplay(replay));
    console.log("Linear Replay Cache", { linear: replay._linearReplayCache });
  }
  return replay._linearReplayCache;
}

function* _linearReplay(replay: Internal.Replay): Generator<ReplayPosition> {
  yield { type: 'gameStart', replay };
  for (const [driveIdx, drive] of replay.drives.entries()) {
    yield { type: 'driveStart', driveIdx, drive }
    for (const wakeupSide of [drive.wakeups.first, Internal.other(drive.wakeups.first)]) {
      for (const [rollIdx, roll] of drive.wakeups[wakeupSide].entries()) {
        yield { type: 'wakeupRoll', driveIdx, wakeupSide, rollIdx, roll };
      }
    }
    for (const setupSide of [drive.setups.first, Internal.other(drive.setups.first)]) {
      for (const [actionIdx, action] of drive.setups[setupSide].entries()) {
        yield { type: 'setupAction', driveIdx, setupSide, actionIdx, action };
      }
    }
    for (const [turnIdx, turn] of drive.turns.entries()) {
      if (turn.startWizard) {
        yield { type: 'wizardRoll', driveIdx, turnIdx, wizard: 'start', roll: turn.startWizard };
      }
      for (const [activationIdx, activation] of turn.activations.entries()) {
        for (const [actionStepIdx, actionStep] of activation.actionSteps.entries()) {
          yield { type: 'actionStep', driveIdx, turnIdx, activationIdx, actionStepIdx, actionStep }
        }
      }
      if (turn.endWizard) {
        yield { type: 'wizardRoll', driveIdx, turnIdx, wizard: 'end', roll: turn.endWizard };
      }
    }
  }
  for (const [stepIdx, step] of replay.unhandledSteps.entries()) {
    if ('RulesEventSetUpAction' in step) {
      yield { stepIdx, subStep: REPLAY_SUB_STEP.SetupAction, step, setup: step.RulesEventSetUpAction };
    }
    if ('RulesEventKickOffTable' in step && step.RulesEventKickOffTable) {
      yield { stepIdx, subStep: REPLAY_SUB_STEP.Kickoff, step, kickoff: step.RulesEventKickOffTable };

      for (const msg of ensureKeyedList('StringMessage', step.RulesEventKickOffTable.EventResults)) {
        let messageData = parser.parse(he.decode(msg.MessageData), {
          ignoreAttributes: true,
        }) as BB2.KickoffEventMessageData;
        yield { stepIdx, subStep: REPLAY_SUB_STEP.Kickoff, step, kickoff: step.RulesEventKickOffTable, kickoffMessage: messageData };
      };
    }
    if ('RulesEventBoardAction' in step) {
      let actions: BB2.RulesEventBoardAction[] = ensureList(step.RulesEventBoardAction);
      for (const [actionIdx, action] of actions.entries()) {
        if (!action.Results) {
          continue;
        }
        if ('BoardActionResult' in action.Results) {
          // @ts-ignore
          let results: BB2.ActionResult<typeof action>[] = ensureKeyedList('BoardActionResult', action.Results);
          for (const [resultIdx, result] of results.entries()) {
            yield { stepIdx, subStep: REPLAY_SUB_STEP.BoardAction, step, actionIdx, action, resultIdx, result };
          }
        }
      }
    }
    if ('RulesEventEndTurn' in step && step.RulesEventEndTurn) {
      yield { stepIdx, subStep: REPLAY_SUB_STEP.EndTurn, step, endTurn: step.RulesEventEndTurn };
    }
    if ('BoardState' in step) {
      yield { stepIdx, subStep: REPLAY_SUB_STEP.BoardState, step, boardState: step.BoardState };
    }
  }
}

export function period(turn: number): number {
  return Math.floor((turn - 1) / 8) + 1;
}
