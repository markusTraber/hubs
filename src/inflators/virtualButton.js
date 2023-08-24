import { addComponent } from "bitecs";
import {
  Networked,
  VirtualButton,
  NetworkedVirtualButton,
  SingleActionButton,
  CursorRaycastable,
  RemoteHoverTarget
} from "../bit-components";
import { addObject3DComponent } from "../utils/jsx-entity";

export function inflateVirtualButton(world, eid, { isPlaying, id, loopType }) {
  const obj = new THREE.Group();
  addObject3DComponent(world, eid, obj);

  addComponent(world, VirtualButton, eid);
  addComponent(world, Networked, eid);
  addComponent(world, NetworkedVirtualButton, eid);

  VirtualButton.isPlaying[eid] = isPlaying;
  NetworkedVirtualButton.isPlaying[eid] = isPlaying;
  VirtualButton.id[eid] = APP.getSid(id.toLowerCase());
  NetworkedVirtualButton.id[eid] = APP.getSid(id.toLowerCase());
  VirtualButton.loopType[eid] = APP.getSid(loopType);
  NetworkedVirtualButton.loopType[eid] = APP.getSid(loopType);

  addComponent(world, CursorRaycastable, eid);
  addComponent(world, RemoteHoverTarget, eid);
  addComponent(world, SingleActionButton, eid);

  return eid;
}
