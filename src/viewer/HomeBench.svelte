<script lang="ts">
  import CasBox from "./CasBox.svelte";
  import { SIDE } from "../constants.js";
  import type { CrossFadeFn, Dugout } from "./types.js";
  export let dugout: Dugout,
    send: CrossFadeFn,
    receive: CrossFadeFn;
  const casTypes: (keyof Dugout)[] = ["cas", "ko", "reserve"];
</script>

<div class="bench">
  {#each casTypes as casType}
  <CasBox
    team={SIDE.home}
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
    left: 2.1%;
    top: 4.7%;
    position: absolute;
    display: grid;
    grid-template-columns: repeat(3, auto);
    grid-template-rows: 1;
  }
</style>
