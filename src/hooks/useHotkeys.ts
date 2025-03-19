import type { KeyboardEventHandler } from "react";
import { useCallback } from "react";
import type { Node, Edge } from "@xyflow/react";

import type { CustomNodeProps } from "@components/nodes";
import type { addNewNodeFn } from "./useAddNewNode";
import { createNode, createEdge, calcNewNodePosition } from "./useFlow";
import type { UpdateNodeContent } from "./useUpdateNodeContent";

export const useHotkeys = (
  updateNodeContent: UpdateNodeContent,
  addNewNode: addNewNodeFn,
  isNodeinEditing: boolean,
  nodes: Node[],
  // edges: Edge[],
): KeyboardEventHandler<HTMLDivElement> => {
  const selectedNode =
    nodes.filter((x) => x.selected)[0] ?? nodes[nodes.length - 1];

  return useCallback(
    (e) => {
      if (isNodeinEditing) {
        return;
      }

      const { x, y } = calcNewNodePosition(
        selectedNode?.position.x ?? 0,
        selectedNode?.position.y ?? 0,
        nodes,
      );
      const nextTabIndex =
        (selectedNode as unknown as CustomNodeProps)?.data.tabIndex + 1;

      if (e.code === "KeyE") {
        const newNode = createNode("EventNode", x, y, {
          content: "event",
          updateNodeContent,
          tabIndex: nextTabIndex,
          parentNodeId: selectedNode.id,
          hotspots: [],
        });
        const newEdge = createEdge(selectedNode, newNode);
        addNewNode(newNode, selectedNode, newEdge);
      }
      if (e.code === "KeyH") {
        const newNode = createNode("HotspotNode", x, y, {
          content: "hotspot",
          updateNodeContent,
          tabIndex: nextTabIndex,
          parentNodeId: selectedNode.id,
        });
        const newEdge = createEdge(selectedNode, newNode);
        addNewNode(newNode, selectedNode, newEdge);
      }
      console.log(e);
    },
    [addNewNode, isNodeinEditing, selectedNode, nodes, updateNodeContent],
  );
};
