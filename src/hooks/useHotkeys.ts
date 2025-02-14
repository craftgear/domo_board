import type { KeyboardEventHandler } from "react";

import { useCallback } from "react";
import { useReactFlow, useStoreApi } from "@xyflow/react";
import type { Node } from "@xyflow/react";
import type { CustomNodeTypes } from "@/components/Types";

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
): KeyboardEventHandler<HTMLDivElement> => {
  const { fitView } = useReactFlow();
  const selectedNode = nodes.filter((x) => x.selected)[0];
  return useCallback(
    (e) => {
      if (isNodeinEditing) {
        return;
      }
      console.log("useHotkeys----- e", e);
      if (e.code === "KeyE") {
        addNewNode(
          "EventNode",
          "",
          (selectedNode?.position.x ?? 0) + 150,
          selectedNode?.position.y ?? 0,
          selectedNode?.data.tabIndex + 1,
        );
      }
      setTimeout(() => fitView({ padding: 0.1, duration: 100 }), 0);
    },
    [addNewNode, isNodeinEditing, fitView, selectedNode, nodes],
  );
};
