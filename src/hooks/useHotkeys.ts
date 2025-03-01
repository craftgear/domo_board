import type { KeyboardEventHandler } from "react";
import type { CustomNodeProps, CustomNodeTypes } from "@components/NodeTypes";

import { useCallback } from "react";
import type { Node } from "@xyflow/react";

export const useHotkeys = (
  addNewNode: (
    nodeType: CustomNodeTypes,
    content: string,
    x: number,
    y: number,
    tabIndex: number,
    prevNode?: Node,
  ) => void,
  isNodeinEditing: boolean,
  nodes: Node[],
  //edges: Edge[],
): KeyboardEventHandler<HTMLDivElement> => {
  const selectedNode =
    nodes.filter((x) => x.selected)[0] ?? nodes[nodes.length - 1];

  return useCallback(
    (e) => {
      if (isNodeinEditing) {
        return;
      }
      if (e.code === "KeyE") {
        addNewNode(
          "EventNode",
          "event",
          (selectedNode?.position.x ?? 0) + 150,
          selectedNode?.position.y ?? 0,
          (selectedNode as unknown as CustomNodeProps)?.data.tabIndex + 1,
          selectedNode,
        );
      }
      if (e.code === "KeyH") {
        addNewNode(
          "HotspotNode",
          "hotspot",
          (selectedNode?.position.x ?? 0) + 150,
          selectedNode?.position.y ?? 0,
          (selectedNode as unknown as CustomNodeProps)?.data.tabIndex + 1,
        );
      }
    },
    [addNewNode, isNodeinEditing, selectedNode],
  );
};
