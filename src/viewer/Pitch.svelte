<script lang="ts">
  import Grid from "./Grid.svelte";
  import PitchSquare from "./PitchSquare.svelte";
  import FixedRatio from "./FixedRatio.svelte";
  import Overlay from "./Overlay.svelte";
  import { replayPreview } from "../stores.js";
  import type { CrossFadeFn, Team, Pitch } from "./types.js";
  import type * as Internal from "../replay/Internal.js";
  export let teams: Internal.ByTeam<Team>,
    pitch: Pitch,
    send: CrossFadeFn,
    receive: CrossFadeFn;

  let homeLogo: string, awayLogo: string;
  $: {
    homeLogo = teams.home.logo;
    awayLogo = teams.away.logo;
  }
</script>

<div class="pitch">
  <Grid width={26} height={15} let:row let:column>
    <PitchSquare
      {homeLogo}
      {awayLogo}
      {pitch}
      {send}
      {receive}
      {row}
      {column}
    />
  </Grid>
  {#if $replayPreview}
    <div class="overlay">
      <FixedRatio width={26} height={15}>
        <Overlay />
      </FixedRatio>
    </div>
  {/if}
</div>

<style>
  .pitch {
    left: calc(18 / 1336 * 100%);
    width: calc(1300 / 1336 * 100%);
    position: relative;
  }
  .overlay {
    width: 100%;
    height: 100%;
    top: 0;
    position: absolute;
  }
</style>
