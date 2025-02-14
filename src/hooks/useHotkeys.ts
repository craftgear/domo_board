import type { KeyboardEventHandler } from "react";
import type { GeneralHelpers } from "@xyflow/react";

import { useCallback } from "react";
import { ulid } from "ulid";
import { useReactFlow } from "@xyflow/react";

export const useHotkeys = (
  addNewNode: (type: string, content: string, x: number, y: number) => void,
  isNodeinEditing: boolean,
): KeyboardEventHandler<HTMLDivElement> => {
  const { fitView } = useReactFlow();
  return useCallback(
    (e) => {
      if (isNodeinEditing) {
        return;
      }
      console.log("useHotkeys----- e", e);
      if (e.code === "KeyE") {
        addNewNode("EventNode", "hoge", 500, 500);
      }
      setTimeout(() => fitView({ padding: 0.1, duration: 100 }), 0);
    },
    [addNewNode, isNodeinEditing, fitView],
  );
};
