<script lang="ts">
  import Grid from "./Grid.svelte";
  import CasSquare from "./CasSquare.svelte";
  import type { SIDE } from "../constants.js";
  import type { CrossFadeFn, Dugout } from "./types.js";
  export let
    team: SIDE,
    casType: keyof Dugout,
    dugout: Dugout,
    send: CrossFadeFn,
    receive: CrossFadeFn;
  let width = 4,
    height = 2;
</script>

<div class={`bench ${casType}`}>
  <Grid {width} {height} let:row let:column>
    <CasSquare
      {team}
      {width}
      {height}
      {send}
      {receive}
      {casType}
      {dugout}
      {row}
      {column}
    />
  </Grid>
</div>

<style>
</style>
