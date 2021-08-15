<script lang="ts">
  import { selectedPlayer, hoveredPlayer } from "../stores.js";
  import Ball from "./Ball.svelte";
  import Cell from "./Cell.svelte";
  import DiceResult from "./DiceResult.svelte";
  import Foul from "./Foul.svelte";
  import Player from "./Player.svelte";
  import TeamLogo from "./TeamLogo.svelte";
  import type { CrossFadeFn, PitchCellProps, Pitch } from "./types.js";
  export let
    row: number,
    column: number,
    pitch: Pitch,
    homeLogo: string,
    awayLogo: string,
    send: CrossFadeFn,
    receive: CrossFadeFn;
  let player: PitchCellProps["player"] = undefined,
    cell: PitchCellProps["cell"] = undefined,
    ball: PitchCellProps["ball"] = undefined,
    dice: PitchCellProps["dice"] = undefined,
    foul: PitchCellProps["foul"] = false,
    id: string;

  $: {
    ({ player, cell, ball, dice, foul } = pitch.get(`${column}-${row}`) || {});
    id = `pitch-${row}-${column}`;
  }
</script>

<div
  class="pitch-square"
  {id}
  on:click={() => {
    $selectedPlayer = player;
  }}
  on:mouseover={() => {
    $hoveredPlayer = player;
  }}
  on:mouseleave={() => {
    $hoveredPlayer = undefined;
  }}
>
  {#if column == 0 && row == 7 && homeLogo}
    <TeamLogo logo={homeLogo.toLowerCase()} />
  {/if}
  {#if column == 25 && row == 7 && awayLogo}
    <TeamLogo logo={awayLogo.toLowerCase()} />
  {/if}
  {#if cell}
    <Cell {...cell} {send} {receive} {row} {column} />
  {/if}
  {#if player}
    <Player {player} {send} {receive} />
  {/if}
  {#if dice}
    <DiceResult {dice} />
  {/if}
  {#if foul}
    <Foul />
  {/if}
  {#if ball}
    <Ball {...ball} {send} {receive} />
  {/if}
</div>

<style>
  .pitch-square {
    border: 0.05vh dashed rgba(255, 255, 255, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
