import { EventNode, type EventNodeProps } from "./EventNode";
import { HotspotNode, type HotspotNodeProps } from "./HotspotNode";

import type { NodeProps } from "@xyflow/react";

export type BaseNodeProps = {
  data: {
    content: string;
    updateNodeContent: (nodeId: string, label: string) => void;
    tabIndex: number;
  };
} & NodeProps;

export const nodeTypes = {
  EventNode,
  HotspotNode,
};

export const edgeTypes = {};

export type CustomNodeProps = EventNodeProps | HotspotNodeProps;
export type CustomNodeTypes = "EventNode" | "HotspotNode";
