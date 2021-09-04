<script lang="ts">
  import { hoveredPlayer, selectedPlayer } from "./stores.js";
  import type { Player } from "./rolls.js";
  export let player: Player;
</script>

<span
  class="badge badge-pill pill-team-{player.team.id}"
  on:click={() => {
    $selectedPlayer = player.id;
  }}
  on:mouseover={() => {
    $hoveredPlayer = player.id;
  }}
  on:focus={() => {
    $hoveredPlayer = player.id;
  }}
  on:mouseleave={() => {
    $hoveredPlayer = undefined;
  }}
  on:blur={() => {
    $hoveredPlayer = undefined;
  }}>{player.name}</span
>

<style>
  .pill-team-1 {
    background-color: var(--team1-color-2);
    color: var(--team1-gray-9);
  }
  .pill-team-0 {
    background-color: var(--team0-color-2);
    color: var(--team0-gray-9);
  }
  .badge-pill {
    font-size: 85%;
  }
</style>
