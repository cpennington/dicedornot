<script lang="ts">
  import CasBox from "./CasBox.svelte";
  import { SIDE } from "../constants.js";
  import type { CrossFadeFn, Dugout } from "./types.js";
  export let dugout: Dugout,
    send: CrossFadeFn,
    receive: CrossFadeFn;
  const casTypes: (keyof Dugout)[] = ["reserve", "ko", "cas"];
</script>

<div class="bench">
  {#each casTypes as casType}
  <CasBox
    team={SIDE.away}
    {casType}
    {dugout}
    {send}
    {receive}
  />
  {/each}
</div>

<style>
  .bench {
    width: calc(600 / 1338 * 100%);
    right: calc((1338 - 1316) / 1338 * 100%);
    bottom: 5%;
    position: absolute;
    display: grid;
    grid-template-columns: repeat(3, auto);
    grid-template-rows: 1;
  }
</style>
