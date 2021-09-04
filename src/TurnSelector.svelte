<script lang="ts">
  import type { SIDE } from "./constants.js";

  import type { Action } from "./rolls.js";

  export let actions: Action[];
  import { replayCurrent, replayTarget, replayPreview } from "./stores.js";
  let turn: number,
    teamId: SIDE | undefined,
    teamName: string | undefined,
    current: boolean,
    startIndex: number,
    endIndex: number | undefined;

  $: {
    turn = actions[0].turn;
    teamId = actions[0].activeTeam?.id;
    teamName = actions[0].activeTeam?.name;
    startIndex = actions[0].startIndex;
    endIndex = actions[actions.length - 1].endIndex;
    current = startIndex <= $replayCurrent && (endIndex == undefined || $replayCurrent < endIndex);
  }
</script>

<div
  class={`btn team team-${teamId}`}
  class:current
  title={`${teamName}: Turn ${turn}`}
  on:click={() => ($replayTarget = startIndex)}
  on:mouseover={() => ($replayPreview = { start: startIndex, end: endIndex })}
  on:focus={() => ($replayPreview = { start: startIndex, end: endIndex })}
>
  {turn}
</div>

<style>
  .team.btn {
    width: 2em;
    height: 2em;
    line-height: 2em;
    text-align: center;
    display: inline-block;
    border-width: 1px;
    border-style: solid;
    margin: 1px;
    padding: 0;
  }

  .team-0 {
    background-color: var(--team0-color-1);
    border-color: var(--team0-color-3);
    color: var(--team0-gray-7);
  }
  .team-1 {
    background-color: var(--team1-color-1);
    border-color: var(--team1-color-3);
    color: var(--team1-gray-7);
  }
  .team-0:hover {
    background-color: var(--team0-color-3);
    border-color: var(--team0-color-7);
    color: var(--team0-gray-9);
  }
  .team-1:hover {
    background-color: var(--team1-color-3);
    border-color: var(--team1-color-7);
    color: var(--team1-gray-9);
  }
  .team-0.current {
    color: var(--team0-gray-9);
    text-shadow: -0.06ex 0 var(--team0-gray-9), 0.06ex 0 var(--team0-gray-9);
    border-color: var(--team0-color-9);
    background-color: var(--team0-color-5);
  }
  .team-1.current {
    color: var(--team0-gray-9);
    text-shadow: -0.06ex 0 var(--team1-gray-9), 0.06ex 0 var(--team1-gray-9);
    border-color: var(--team1-color-9);
    background-color: var(--team1-color-5);
  }
</style>
