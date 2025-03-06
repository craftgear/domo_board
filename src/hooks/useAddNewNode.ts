import { useCallback } from "react";
import type {
  GeneralHelpers,
  ReactFlowActions,
  Node,
  Edge,
  FitView,
} from "@xyflow/react";

export type addNewNodeFn = (
  newNode: Node,
  prevNode: Node,
  newEdge: Edge,
) => Node;

export const useAddNewNode = (
  setNodes: GeneralHelpers["setNodes"],
  setEdges: GeneralHelpers["setEdges"],
  addSelectedNodes: ReactFlowActions<Node, Edge>["addSelectedNodes"],
  fitView: FitView,
) => {
  return useCallback(
    (newNode: Node, prevNode: Node, newEdge: Edge): Node => {
      setNodes((nodes) => [...nodes, newNode]);
      setEdges((edges) => [...edges, newEdge]);

      // XXX: do not delete setTimeout or fitView doesn't work as expected
      setTimeout(() => {
        addSelectedNodes([newNode.id]);
        // TODO: change to setCenter
        fitView({ padding: 0.1, duration: 0 });
      }, 0);
      return newNode;
    },
    [setNodes, addSelectedNodes, setEdges, fitView],
  );
};
