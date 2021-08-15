<script lang="ts">
  import HomeBench from "./HomeBench.svelte";
  import TeamAids from "./TeamAids.svelte";
  import Weather from "./Weather.svelte";
  import TeamLogo from "./TeamLogo.svelte";
  import type { CrossFadeFn, Team } from "./types";
  import type { WEATHER } from "../constants";

  export let
    team: Team,
    weather: WEATHER,
    send: CrossFadeFn,
    receive: CrossFadeFn;
</script>

<div class="dugout">
  {#if team}
    <HomeBench dugout={team.dugout} {send} {receive} />
    <div class="logo">
      <TeamLogo logo={team.logo} />
    </div>
    <div class="name">{team.name || "Home"}</div>
    <div class="score"><span>{team.score || 0}</span></div>
    <div class="turn" class:active={team.active}>{team.turn || ""}</div>
    <div class="aids"><TeamAids {team} /></div>
  {/if}
  <div class="weather"><Weather {weather} /></div>
</div>

<style>
  .logo {
    position: absolute;
    width: 3.5%;
    left: 1.5%;
    bottom: 1.5%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .name {
    line-height: 1em;
    font-size: calc(min(3.5vh, 2.5vw, 40px));
    font-weight: bold;
    position: absolute;
    bottom: 0;
    left: 6%;
    font-family: "Nuffle";
  }
  .dugout {
    width: 100%;
    height: calc(158 / 1062 * 100%);
    position: relative;
    color: hsl(0, 0%, 85%);
    font-family: Nuffle;
  }
  .weather {
    position: absolute;
    right: 0.5%;
    top: 4%;
    width: 5%;
  }
  .turn {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 47%;
    font-size: calc(min(4vh, 3vw));
    width: 6%;
    bottom: 0;
    height: 50%;
  }
  .turn.active {
    color: #ffb22e;
  }
  .score {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 47%;
    font-size: calc(min(6vh, 4vw));
    text-align: center;
    width: 6%;
    top: 0;
    height: 50%;
  }
  .score > span {
    margin-top: 0;
    margin-bottom: 0;
    line-height: 100%;
  }

  .aids {
    position: absolute;
    width: 30%;
    left: 53%;
    bottom: 1%;
  }
</style>
