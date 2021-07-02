import { writable } from 'svelte/store';
import type { ReplayPreview } from './replay-utils';
import type {ProcessedReplay} from './replay.js';

let startingUrl = new URL(window.location.href);
let target: number | undefined;
let stParam = startingUrl.searchParams.get('st');
if (stParam != undefined) {
  target = parseInt(stParam);
} else if (startingUrl.hash) {
  target = parseInt(startingUrl.hash.replace('#', ''));
}

export const timing = writable<number>(300);
export const selectedPlayer = writable<number | undefined>(undefined);
export const hoveredPlayer = writable<number | undefined>(undefined);
export const replay = writable<ProcessedReplay | undefined>(undefined);
export const replayCurrent = writable<number>(0);
export const replayTarget = writable<number | undefined>(target);
export const replayPreview = writable<ReplayPreview | undefined>(undefined);
export const error = writable<Error | string | undefined>(undefined);
export const showResultsAnalysis = writable<boolean>(false);
