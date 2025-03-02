import type { KeyboardEventHandler } from "react";
import type { CustomNodeProps, CustomNodeTypes } from "@components/nodes";

import { useCallback } from "react";
import type { Node, GeneralHelpers } from "@xyflow/react";
import type { addNewNodeFn } from "./useAddNewNode";

export const useHotkeys = (
  addNewNode: addNewNodeFn,
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
          selectedNode?.position.x,
          selectedNode?.position.y,
          (selectedNode as unknown as CustomNodeProps)?.data.tabIndex + 1,
          selectedNode,
        );
      }
      if (e.code === "KeyH") {
        addNewNode(
          "HotspotNode",
          "hotspot",
          selectedNode?.position.x,
          selectedNode?.position.y,
          (selectedNode as unknown as CustomNodeProps)?.data.tabIndex + 1,
        );
      }
    },
    [addNewNode, isNodeinEditing, selectedNode],
  );
};
