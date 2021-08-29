<script lang="ts">
  import { onMount } from "svelte";
  import { xmlToJson } from "./io.js";
  import { replay, error } from "./stores.js";
  import { processReplay } from "./replay.js";
  import { get, set, keys, del} from "idb-keyval";
  import Loading from "./Loading.svelte";
  import type * as BB2 from "./replay/BB2.js";
  import type * as Internal from "./replay/Internal.js";
  import {convertReplay} from "./replay/BB2toInternal.js";

  interface ParsedReplay {
    Replay: BB2.Replay,
    CACHE_VERSION?: number,
  }
  
  export let button = "primary",
    loading: string | undefined;
  const CACHE_VERSION = 2;

  onMount(() => {
    if (!$replay) {
      loadFromSearchParams();
    }
  });

  enum ReplayType {
    rebbl = "rebbl",
    goblinspy = "gspy",
    file = "file",
  }

  let filePicker: HTMLInputElement, urlPicker: HTMLInputElement, cachePicker: HTMLInputElement, replayKeys: IDBValidKey[];
  const rebblRE = /.*rebbl\.net\/rebbl\/match\/([0-9a-f]*)/i;
  const goblinspyRE = /.*mordrek\.com\/gspy\/.*match\/((cid_)?[0-9a-f]*)/i
  const spikeRE = /.*spike\.ovh\/match\?match_uuid=([0-9a-f]*)/i
  const METADATA_KEY = "replay-metadata-v1";

  type ReplayMetadata = {
    homeCoach: string,
    homeTeam: string,
    homeScore: number,
    awayCoach: string,
    awayTeam: string,
    awayScore: number,
    date: Date,
    cacheKey: IDBValidKey,
  };

  async function replayFromCache(key: IDBValidKey): Promise<Internal.Replay | undefined> {
    let cachedReplay = await get(key);
    if (!cachedReplay) {
      return undefined;
    }
    if (cachedReplay.CACHE_VERSION != CACHE_VERSION) {
      console.log("Deleting from cache for mismatched cache version", {key});
      del(key);
      return undefined;
    } else {
      console.log("Loaded replay from cache...", {cachedReplay});
      try {
        const converted = convertReplay(cachedReplay.Replay);
        console.log("Converted replay to internal format", {converted});
        return converted;
      } catch (err){
        console.error({msg: 'Unable to convert to internal format', err});
        return undefined;
      }
    }
  }

  async function putReplayIntoCache(key: IDBValidKey, replay: ParsedReplay) {
    console.log("Setting cache", { key, replay });
    return set(key, replay);
  }

  async function loadFromSearchParams() {
      const params = new URLSearchParams(window.location.search);
      if (!replayKeys) {
        loading = "Loading saved replays";
        replayKeys = await keys();
        loading = undefined;
      }
      for (const [key, value] of params) {
        let cacheKey = `${key}-${value}`;
        if (replayKeys.includes(cacheKey)) {
          loadFromCache(cacheKey);
          return;
        }
      };
      const rebblUUID = params.get("rebbl");
      if (rebblUUID) {
        loadRebblReplay(rebblUUID, false);
        return;
      }
      const gspyMID = params.get("gspy");
      if (gspyMID) {
        loadGoblinspyReplay(gspyMID, false);
        return;
      }
  }

  function loadURL() {
    if (!urlPicker.value) {
      return;
    }
    const rebblMatch = urlPicker.value.match(rebblRE);
    if (rebblMatch) {
      loadRebblReplay(rebblMatch[1], true);
      return;
    }
    const goblinspyMatch = urlPicker.value.match(goblinspyRE);
    if (goblinspyMatch) {
      loadGoblinspyReplay(goblinspyMatch[1], true);
      return;
    }
    const spikeMatch = urlPicker.value.match(spikeRE);
    if (spikeMatch) {
      loadGoblinspyReplay(`cid_${spikeMatch[1]}`, true);
      return;
    }
    $error = `Unable to understad match url ${urlPicker.value}. Try something like https://rebbl.net/rebbl/match/1234abcd, https://www.mordrek.com/gspy/comp/1234/match/abcd1234, or https://spike.ovh/match?match_uuid=abcd1234`;
  }

  async function cachedReplays(): Promise<ReplayMetadata[]> {
    loading = "Loading replay metadata";
    let replayMetadata = await get(METADATA_KEY);
    loading = undefined;

    if (!replayMetadata) {
      if (!replayKeys) {
          loading = "Loading saved replays";
          replayKeys = await keys();
          loading = undefined;
      }
      const allReplays: {key: IDBValidKey, replay: Internal.Replay}[] = [];
      for (const key of replayKeys) {
        loading = `Loading ${key}`;
        const replay = await replayFromCache(key);
        if (replay) {
          allReplays.push({key, replay});
        }
      }
      loading = undefined;
      console.log(allReplays);
      replayMetadata = allReplays.map(({key: cacheKey, replay: replayJSON}) => {
        return {
          homeCoach: replayJSON.teams.home.coach,
          homeTeam: replayJSON.teams.home.name,
          homeScore: replayJSON.finalScore.home,
          awayCoach: replayJSON.teams.away.coach,
          awayTeam: replayJSON.teams.away.name,
          awayScore: replayJSON.finalScore.away,
          date: replayJSON.metadata.datePlayed,
          cacheKey,
        };
      });
      await set(METADATA_KEY, replayMetadata);
    }
    return replayMetadata;
  }

  async function loadFromCache(cacheKey: string, updateUrl = false) {
    loading = `Loading ${cacheKey} from cache`;
    console.log("Loading from cache", { cacheKey });
    const jsonReplayData = await replayFromCache(cacheKey);
    console.log("Loaded", {jsonReplayData});
    if (jsonReplayData)
      try {
        let [replayType, ...replayId] = cacheKey.split('-');
        let replayIdStr = replayId.join('-');
        let shareURL = new URL(window.location.href);
        shareURL.search = "";
        shareURL.hash = "";
        shareURL.searchParams.set(replayType, replayIdStr);
        if (updateUrl) {
          window.history.pushState({}, "", shareURL.href);
        }
        $replay = processReplay(jsonReplayData);
        loading = undefined;
      } catch (err) {
        loading = undefined;
        $error = err;
        console.error(err);
      }
  }

  async function parseReplay(replayFile: File, replayType: ReplayType, replayId: string, updateUrl: boolean) {
    loading = `Parsing ${replayFile.name}`;
    let jsonReplayFile: Record<string, {Replay: BB2.Replay}> = await xmlToJson(replayFile);
    for (const [_, jsonReplayData] of Object.entries(jsonReplayFile)) {
      console.log("Preparing to process replay json...");
      const cacheableReplay: ParsedReplay = {Replay: jsonReplayData.Replay, CACHE_VERSION};
      cacheableReplay.Replay.filename = replayFile.name;
      let shareURL = new URL(window.location.href);
      shareURL.search = "";
      shareURL.hash = "";
      shareURL.searchParams.set(replayType, replayId);
      if (updateUrl) {
        window.history.pushState({}, "", shareURL.href);
      }
      cacheableReplay.Replay.url = shareURL.href;
      let cacheKey = `${replayType}-${replayId}`;
      putReplayIntoCache(cacheKey, cacheableReplay);
      try {
        $replay = processReplay(convertReplay(cacheableReplay.Replay));
        loading = undefined;
      } catch (err) {
        loading = undefined;
        $error = err;
        console.error(err);
      }
    }
  }

  async function loadRebblReplay(uuid: string, updateUrl: boolean) {
    loading = `Loading ${uuid} from rebbl.net`;
    $error = undefined;
    let replayFile = await fetch(
      `https://rebbl.net/api/v2/match/${uuid}/replay`
    ).then((r) => r.json());
    if (replayFile.filename && replayFile.filename != "No replay file found") {
      loading = `Downloading ${replayFile.filename}`;
      const blob = await fetch(replayFile.filename).then((r) => r.blob());
      loading = undefined;
      const file = new File([blob], replayFile.filename);
      parseReplay(file, ReplayType.rebbl, uuid, updateUrl);
    } else {
      loadGoblinspyReplay(`cid_${uuid}`, updateUrl);
    }
  }

  async function loadGoblinspyReplay(mid: string, updateUrl: boolean) {
    loading = `Loading ${mid} from GoblinSpy`;
    $error = undefined;
    let replayFile = await fetch(
      `https://www.mordrek.com:666/api/v1/match/${mid}/url`
    ).then((r) => r.json());
    console.log("Replayfile", {replayFile});
    if (replayFile) {
      loading = `Downloading ${replayFile}`;
      const blob = await fetch(replayFile).then((r) => r.blob());
      loading = undefined;
      const file = new File([blob], replayFile);
      parseReplay(file, ReplayType.goblinspy, mid, updateUrl);
    } else {
      $error = `Unable to load replay for https://www.mordrek.com/gspy/match/${mid}. Try again later.`;
      loading = undefined;
    }
  }

  async function loadReplay() {
    loading = "Preparing to parse XML...";
    $error = undefined;
    const files = filePicker.files;
    if (files && files.length > 0) {
      parseReplay(files[0], ReplayType.file, files[0].name, true);
    }
  }

</script>

<div>
  <div class="row align-items-center justify-content-center">
    <div class="col-auto">
    <span id="file-input-button" class={`btn btn-${button} btn-file centered`}>
      Select Replay
      <input
        bind:this={filePicker}
        on:change={loadReplay}
        type="file"
        accept=".bbrz,.zip"
      />
    </span>
    </div>
  </div>
  <div class="row align-items-center justify-content-center pt-2">
    <div class="col col-md-7 col-lg-5">
      <input
        bind:this={urlPicker}
        type="text"
        class="form-control form-control-sm"
        placeholder="Paste your ReBBL, GoblinSpy or Spike match url here..."
      />
    </div>
    <div class="col-auto">
      <button class={`btn btn-${button}`} on:click={loadURL}>Load</button>
    </div>
  </div>
  {#await cachedReplays() then replays}
    <div class="row align-items-center justify-content-center pt-2">
      <div class="col-auto">
        <label for="saved-replay-choice">Saved replays:</label>
      </div>
      <div class="col">
        <input
          list="saved-replay-options"
          id="saved-replay-choice"
          name="saved-replay-choice"
          placeholder="Enter team name here for saved replay..."
          bind:this={cachePicker}
          on:input={() => {
            if (replays.map(replay => replay.cacheKey).includes(cachePicker.value)) {
              loadFromCache(cachePicker.value, true);
              cachePicker.value = "";
            }
          }}
        />

        <datalist id="saved-replay-options">
          {#each replays as replay (replay.cacheKey)}
            <option value={replay.cacheKey}
              >{replay.homeTeam}
              {replay.homeScore}-{replay.awayScore}
              {replay.awayTeam} [{replay.date.toLocaleString()}]</option
            >
          {/each}
        </datalist>
      </div>
    </div>
  {/await}
  <Loading {loading}/>
</div>

<style>
  #saved-replay-choice {
    width: 100%;
  }
  .btn-file {
    position: relative;
    overflow: hidden;
  }

  .btn-file input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    outline: none;
    background: white;
    cursor: inherit;
    display: block;
  }
</style>
