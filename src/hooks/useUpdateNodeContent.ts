import { useCallback } from "react";
import type { GeneralHelpers } from "@xyflow/react";

export const useUpdateNodeContent = (
  updateNode: GeneralHelpers["updateNodeData"],
) =>
  useCallback(
    (id: string, newContent: string) => {
      updateNode(id, (data) => ({ ...data, content: newContent }));
    },
    [updateNode],
  );
