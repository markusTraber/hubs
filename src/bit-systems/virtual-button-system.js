import { Interacted, VirtualButton, NetworkedVirtualButton } from "../bit-components";
import { defineQuery, enterQuery, exitQuery, hasComponent } from "bitecs";
import { takeOwnership } from "../systems/netcode";

function clicked(eid) {
  return hasComponent(APP.world, Interacted, eid);
}

const state = new Map();
const virtualButtonQuery = defineQuery([VirtualButton]);
const virtualButtonEnterQuery = enterQuery(virtualButtonQuery);
const virtualButtonExitQuery = exitQuery(virtualButtonQuery);
export function virtualButtonSystem(world) {
  virtualButtonEnterQuery(world).forEach(function (eid) {
    const entity = world.eid2obj.get(eid);

    if (!entity.el || !entity.el.object3D.animations || entity.el.object3D.animations.length === 0) {
      console.warn("No animations for Virtual Button component.", entity);
      return;
    }

    const animations = entity.el.object3D.animations;
    const idName = APP.getString(NetworkedVirtualButton.id[eid]);
    const btnAnimations = animations.filter(({ name }) => name.toLowerCase().startsWith("virtualbutton-" + idName));
    const oldMixerComponent = entity.el.components["animation-mixer"];
    const loopType = APP.getString(NetworkedVirtualButton.loopType[eid]) || "loop-repeat";

    // Create new mixer
    if (!entity.el.object3D.mixer) entity.el.object3D.mixer = new THREE.AnimationMixer(entity.el.object3D);
    const mixer = entity.el.object3D.mixer;
    const actions = [];

    btnAnimations.forEach(currentValue => {
      if (oldMixerComponent && oldMixerComponent.mixer._actionsByClip[currentValue.uuid]) {
        oldMixerComponent.mixer._actionsByClip[currentValue.uuid].knownActions.forEach(action => {
          action.stop();
          action.enabled = false;
          oldMixerComponent.mixer.uncacheAction(currentValue);
        });
      }

      const idx = actions.push(mixer.clipAction(currentValue)) - 1;
      if (currentValue.name.toLowerCase() == "virtualbutton-" + idName) {
        actions[idx].loop = THREE.LoopOnce;
        actions[idx].clampWhenFinished = true;
        actions[idx].paused = true;
      } else {
        switch (loopType) {
          case "loop-once-reverse":
            actions[idx].loop = THREE.LoopOnce;
            actions[idx].clampWhenFinished = true;
            break;
          case "loop-once":
            actions[idx].loop = THREE.LoopOnce;
            actions[idx].clampWhenFinished = true;
            break;
          case "loop-pingpong":
            actions[idx].loop = THREE.LoopPingPong;
            break;
          case "loop-repeat":
          default:
            actions[idx].loop = THREE.LoopRepeat;
            break;
        }
        actions[idx].paused = !NetworkedVirtualButton.isPlaying[eid];
      }
      actions[idx].enabled = true;
      actions[idx].play();
    });

    state.set(eid, { mixer, actions, idName, loopType });
  });

  virtualButtonExitQuery(world).forEach(function (eid) {
    if (!state.has(eid)) return;
    const { mixer, actions } = state.get(eid);
    actions.forEach(action => {
      action.stop();
      mixer.uncacheAction(action);
    });
    state.delete(eid);
  });

  virtualButtonQuery(world).forEach(function (eid) {
    if (!state.has(eid)) return;
    const { mixer, actions, idName, loopType } = state.get(eid);
    if (clicked(eid)) {
      takeOwnership(world, eid);
      NetworkedVirtualButton.isPlaying[eid] = !NetworkedVirtualButton.isPlaying[eid];
    }
    if (NetworkedVirtualButton.isPlaying[eid] !== VirtualButton.isPlaying[eid]) {
      VirtualButton.isPlaying[eid] = NetworkedVirtualButton.isPlaying[eid];

      actions.forEach(action => {
        if (action.getClip().name.toLowerCase() == "virtualbutton-" + idName || loopType == "loop-once") {
          action.time = 0;
          action.paused = false;
        } else if (loopType == "loop-once-reverse") {
          action.paused = false;
          action.setEffectiveTimeScale(VirtualButton.isPlaying[eid] ? 1 : -1);
        } else {
          action.paused = !VirtualButton.isPlaying[eid];
        }
        action.play();
      });
    }
    mixer.update(world.time.delta / 1000);
  });
}
