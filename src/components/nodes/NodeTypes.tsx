import { EventNode, type EventNodeProps } from "./EventNode";
import { HotspotNode, type HotspotNodeProps } from "./HotspotNode";

export const nodeTypes = {
  EventNode,
  HotspotNode,
};
export const edgeTypes = {};

export type { BaseNodeProps } from "./BaseNode";
export type CustomNodeProps = EventNodeProps | HotspotNodeProps;
export type CustomNodeTypes = "EventNode" | "HotspotNode";
