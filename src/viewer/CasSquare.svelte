<script lang="ts">
  import Player from "./Player.svelte";
  import { selectedPlayer, hoveredPlayer, playerDefs, playerStates } from "../stores.js";
  import { SITUATION, Casualties, SIDE } from "../constants.js";
  import type { Dugout, CrossFadeFn } from "./types";
  import type { Player as IPlayer, PlayerState } from "../replay/Internal";
  export let
    team: SIDE,
    dugout: Dugout,
    row: number,
    column: number,
    width: number,
    height: number,
    casType: keyof Dugout,
    send: CrossFadeFn | undefined,
    receive: CrossFadeFn | undefined;
  let player: IPlayer | undefined = undefined,
    playerState: PlayerState | undefined = undefined,
    players,
    id: string,
    cas: string | undefined = undefined;

  $: {
    id = `${team == SIDE.away ? "away" : "home"}-${casType}-${row}-${column}`;
    if (dugout) {
      if (casType == "ko") {
        players = dugout["cas"].slice(width * height).concat(dugout[casType]);
      } else if (casType == "reserve") {
        players = dugout["ko"].slice(width * height).concat(dugout[casType]);
      } else {
        players = dugout[casType];
      }
      let playerNumber = players[column * height + row];
      player = $playerDefs.get(playerNumber);
      playerState = $playerStates.get(playerNumber);
    }

    if (playerState && (playerState.situation>= SITUATION.Casualty)) {
      if (playerState.situation === SITUATION.Casualty) {
        cas =
          Casualties[
            Math.max(...(playerState.casualties || [])) - 1
          ]?.icon;
        if (!cas) {
          console.log("Couldn't find cas icon", {playerState, Casualties})
        }
      } else {
        cas = "Expelled";
      }
    }
  }
</script>

<div
  class="cas-square"
  {id}
  on:click={() => {
    $selectedPlayer = player && player.id.number;
  }}
  on:mouseover={() => {
    $hoveredPlayer = player && player.id.number;
  }}
  on:mouseleave={() => {
    $hoveredPlayer = undefined;
  }}
>
  {#if player}
    <Player player={player.id.number} {send} {receive} />
    {#if cas}
      <img class="cas" src={`/images/skills/${cas}.png`} alt={cas} />
    {/if}
  {/if}
</div>

<style>
  .cas-square {
    border: 0.05vh dashed rgba(255, 255, 255, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    position: relative;
  }

  .cas {
    position: absolute;
    bottom: -5px;
    right: -5px;
    width: 50%;
    height: 50%;
    z-index: 10;
  }
</style>
