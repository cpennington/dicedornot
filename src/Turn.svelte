<script lang="ts">
  import Roll from "./Roll.svelte";
  import { replayPreview } from "./stores.js";
  import type {Action} from "./rolls.js";
  import { SIDE } from "./constants";
  export let actions: Action[], selectedAction: number;
</script>

<div class="list-group" id="turn" on:mouseleave={() => ($replayPreview = undefined)}>
  {#each actions as action (action.actionIndex)}
    <div
      class={`list-group-item list-group-item-action team-${action.activeTeam?.id || SIDE.home}`}
      class:active={selectedAction == action.actionIndex}
      on:mouseover={() => ($replayPreview = {start: action.startIndex, end: action.endIndex})}
      on:focus={() => ($replayPreview = {start: action.startIndex, end: action.endIndex})}
    >
      <Roll {action} selected={selectedAction == action.actionIndex} />
    </div>
  {/each}
</div>

<style>
  .list-group-item.team-1:hover {
    background-color: var(--team1-color-1);
    color: var(--team1-gray-8);
  }
  .list-group-item.team-0:hover {
    background-color: var(--team0-color-1);
    color: var(--team0-gray-8);
  }
  .list-group-item.team-1 {
    background-color: var(--team1-color-0);
    color: var(--team1-gray-7);
  }
  .list-group-item.team-0 {
    background-color: var(--team0-color-0);
    color: var(--team0-gray-7);
  }

  .list-group-item.team-1.active {
    background-color: var(--team1-color-2);
    color: var(--team1-gray-9);
  }
  .list-group-item.team-0.active {
    background-color: var(--team0-color-2);
    color: var(--team0-gray-9);
  }
</style>
