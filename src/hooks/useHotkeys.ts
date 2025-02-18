import type { KeyboardEventHandler } from "react";
import type { CustomNodeTypes } from "@components/NodeTypes";

import { useCallback } from "react";
import type { Node } from "@xyflow/react";

export const useHotkeys = (
  addNewNode: (
    type: string,
    content: string,
    x: number,
    y: number,
    tabIndex: number,
  ) => void,
  isNodeinEditing: boolean,
  nodes: Node[],
  //edges: Edge[],
): KeyboardEventHandler<HTMLDivElement> => {
  const selectedNode =
    nodes.filter((x) => x.selected)[0] ?? nodes[nodes.length - 1];

  return useCallback(
    (e) => {
      // console.log("useHotkeys ----- e", e);
      if (isNodeinEditing) {
        return;
      }
      if (e.code === "KeyE") {
        addNewNode(
          "EventNode",
          "",
          (selectedNode?.position.x ?? 0) + 150,
          selectedNode?.position.y ?? 0,
          (selectedNode as unknown as CustomNodeTypes)?.data.tabIndex + 1,
        );
      }
    },
    [addNewNode, isNodeinEditing, selectedNode],
  );
};
