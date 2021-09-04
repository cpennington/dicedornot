<script lang="ts">
  export let loading: string | undefined;
</script>

{#if loading}
  <div class="progress">
    <div
      class="progress-bar progress-bar-striped progress-bar-animated active"
      role="progressbar"
      aria-valuenow={100}
      aria-valuemin={0}
      aria-valuemax={100}
      style="width: 110%"
    >
      {loading}...
    </div>
  </div>
{/if}

<style>
  .progress {
    margin-top: 1em;
    height: 2em;
  }
</style>
