<script lang="ts">
  import Player from "./Player.svelte";
  import { selectedPlayer, hoveredPlayer } from "../stores.js";
  import { SITUATION, Casualties, SIDE } from "../constants.js";
  import { translateStringNumberList } from "../replay-utils.js";
  import type { PlayerProps, Dugout, CrossFadeFn } from "./types";
  import type { PlayerNumber } from "../replay/Internal";
  export let pitchPlayers: Record<PlayerNumber, PlayerProps>,
    team: SIDE,
    dugout: Dugout,
    row: number,
    column: number,
    width: number,
    height: number,
    casType: keyof Dugout,
    send: CrossFadeFn | undefined,
    receive: CrossFadeFn | undefined;
  let player: PlayerProps | undefined = undefined,
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
      player = pitchPlayers[players[column * height + row]];
    }

    if (player && (player.data.Situation || SITUATION.Active) >= SITUATION.Casualty) {
      if (player.data.Situation === SITUATION.Casualty) {
        cas =
          Casualties[
            Math.max(...translateStringNumberList(player.data.ListCasualties)) -
              1
          ].icon;
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
    $selectedPlayer = player && player.data.Id;
  }}
  on:mouseover={() => {
    $hoveredPlayer = player && player.data.Id;
  }}
  on:mouseleave={() => {
    $hoveredPlayer = undefined;
  }}
>
  {#if player}
    <Player {...player} {send} {receive} />
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
