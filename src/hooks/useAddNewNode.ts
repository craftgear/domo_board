import { useCallback } from "react";
import { ulid } from "ulid";
import ELK from "elkjs/lib/elk.bundled.js";
import type {
  FitView,
  GeneralHelpers,
  ReactFlowActions,
  Node,
  Edge,
} from "@xyflow/react";
import type { UpdateNodeContent } from "./useUpdateNodeContent";
import type { CustomNodeTypes } from "@components/NodeTypes";
import { createNode, createEdge } from "./useFlow";

export const useAddNewNode = (
  updateNodeContent: UpdateNodeContent,
  setNodes: GeneralHelpers["setNodes"],
  setEdges: GeneralHelpers["setEdges"],
  addSelectedNodes: ReactFlowActions<Node, Edge>["addSelectedNodes"],
  fitView: FitView,
) => {
  const elk = new ELK();

  return useCallback(
    (
      nodeType: CustomNodeTypes,
      content: string,
      x: number,
      y: number,
      tabIndex: number,
      prevNode?: Node,
    ): Node => {
      const newNodeId = ulid();
      const newNode = createNode(newNodeId, nodeType, x, y, {
        content,
        updateNodeContent,
        tabIndex,
      });

      setNodes((nodes) => [...nodes, newNode]);

      if (prevNode) {
        const newEdge = createEdge(prevNode, newNode);
        setEdges((edges) => [...edges, newEdge]);
      }

      // XXX: do not delete setTimeout or fit view doesn't work as expected
      setTimeout(() => {
        addSelectedNodes([newNodeId]);
        // TODO: change to setCenter
        fitView({ padding: 0.1, duration: 100 });
      }, 0);
      return newNode;
    },
    [updateNodeContent, setNodes, addSelectedNodes, fitView, setEdges],
  );
};
