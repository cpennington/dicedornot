<script lang="ts">
  import { fade } from "svelte/transition";
  import { getPlayerSprite, SIDE, SITUATION, STATUS } from "../constants.js";
  import type { PlayerNumber, Player, PlayerState } from "../replay/Internal.js";
  import type { CrossFadeFn } from "./types.js";
  import {playerDefs, playerStates} from "../stores.js";

  export let player: PlayerNumber,
    send: CrossFadeFn | undefined = undefined,
    receive: CrossFadeFn | undefined = undefined;
  let
    playerDef: Player = $playerDefs.get(player)!,
    playerState: PlayerState = $playerStates.get(player) || {
      usedSkills: [],
      canAct: true,
      status: STATUS.standing,
      disabled: false,
      blitzer: false,
      situation: SITUATION.Active,
    },
    team: SIDE,
    done: boolean | undefined = undefined,
    moving: boolean | undefined = undefined,
    prone: boolean | undefined = undefined,
    stunned: boolean | undefined = undefined,
    blitz: boolean | undefined = undefined,
    stupidity: string | undefined = undefined,
    id,
    race,
    model,
    classes: string,
    key: string,
    _done: boolean,
    _prone: boolean,
    _stunned: boolean,
    _stupidity: string;

  $: {
    ({ model, race } = getPlayerSprite(playerDef.id.number, playerDef.type));
    id = playerDef.id;
    _done = done === undefined ? (!playerState.canAct) : done;

    classes = [race, model, team == SIDE.home ? 'home' : 'away', "sprite", "crisp", "player"].join(" ");
    key = `player_${id}`;
    _prone = prone === undefined ? playerState.status === STATUS.prone : prone;
    _stunned = stunned === undefined ? playerState.status === STATUS.stunned : stunned;
    if (stupidity === undefined && playerState.disabled) {
      let usedSkills = playerState.usedSkills;
      if (usedSkills.indexOf(20) > -1) {
        //take root
        _stupidity = "Rooted";
      } else if (usedSkills.indexOf(31) > -1) {
        //bonehead
        _stupidity = "BoneHeaded";
      } else if (usedSkills.indexOf(51) > -1) {
        //really stupid
        _stupidity = "Stupid";
      }
    }
  }

  function inFn(node: Element, _: any) {
    if (receive) {
      return receive(node, { key: key });
    } else {
      return fade(node, { duration: 0 });
    }
  }
  function outFn(node: Element, _: any) {
    if (send) {
      return send(node, { key: key });
    } else {
      return fade(node, { duration: 0 });
    }
  }
</script>

<div
  class={classes}
  class:done={_done}
  class:moving
  class:stunned={_stunned}
  class:prone={_prone}
  class:blitz
  in:inFn
  out:outFn
>
  {#if _stupidity}
    <div class={_stupidity} />
  {/if}
</div>

<!-- image.src = `https://cdn2.rebbl.net/images/skills/${
  Casualties[Math.max(...p.sustainedCasualties)].icon
}.png`; -->
<style>
  .reverse {
    transform: scaleX(-1);
  }

  .home.stunned,
  .away.prone {
    transform: rotate(90deg);
    opacity: 0.5;
  }
  .away.stunned,
  .home.prone {
    transform: rotate(-90deg);
    opacity: 0.5;
  }

  .sprite {
    position: relative;
  }
  .done {
    opacity: 0.5;
  }

  .blitz:after {
    content: url(/images/blitz.png);
    position: absolute;
    display: inline-flex;
    height: 20px;
    width: 20px;
    left: -11px;
    top: -4px;
  }

  .BoneHeaded {
    background: url("/images/bonehead.png") no-repeat;
    background-size: contain;
    width: 30px;
    height: 30px;
    display: inline-block;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
  }
  .Stupid {
    background: url("/images/reallystupid.png") no-repeat;
    background-size: contain;
    width: 30px;
    height: 30px;
    display: inline-block;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
  }
  .Rooted {
    background: url("/images/takeroot.png") no-repeat;
    background-size: contain;
    width: 30px;
    height: 30px;
    display: inline-block;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
  }
</style>
