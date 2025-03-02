import { useCallback } from "react";
import { ulid } from "ulid";
import type {
  GeneralHelpers,
  ReactFlowActions,
  Node,
  Edge,
  FitView,
} from "@xyflow/react";

import type { CustomNodeTypes } from "@/components/nodes";
import { NODE_SIZE, NODE_GAP } from "@/components/nodes";

import type { UpdateNodeContent } from "./useUpdateNodeContent";
import { createNode, createEdge } from "./useFlow";

export type addNewNodeFn = (
  nodeType: CustomNodeTypes,
  content: string,
  parentX: number,
  parentY: number,
  tabIndex: number,
  prevNode?: Node,
) => Node;

const calcNewNodePosition = (
  parentX: number,
  parentY: number,
  nodes: Node[],
) => {
  const isPositionAvailable = (newY: number, nodesToCheck: Node[]) => {
    return nodesToCheck.every(
      (node) =>
        newY > node.position.y + (node.measured?.height || 0) ||
        newY < node.position.y,
    );
  };

  const repeat = 5;
  for (let moveX = 1; moveX < repeat; moveX++) {
    const nodesToCheck = nodes.filter(
      (node) => node.position.x > (parentX + NODE_GAP) * moveX,
    );
    for (let moveY = 0; moveY < repeat; moveY++) {
      const lowerPosition = {
        x: parentX + moveX * (NODE_SIZE + NODE_GAP),
        y: parentY + moveY * (NODE_SIZE + NODE_GAP),
      };
      const upperPosition = {
        x: parentX + moveX * (NODE_SIZE + NODE_GAP),
        y: parentY - moveY * (NODE_SIZE + NODE_GAP),
      };
      if (isPositionAvailable(lowerPosition.y, nodesToCheck)) {
        return lowerPosition;
      }
      if (isPositionAvailable(upperPosition.y, nodesToCheck)) {
        return upperPosition;
      }
    }
  }

  // 5x5のマスに場所がなければランダムに配置
  return {
    x: parentX + (NODE_SIZE + NODE_GAP) * Math.random() * 10,
    y: parentY + (NODE_SIZE + NODE_GAP) * Math.random() * 10,
  };
};

export const useAddNewNode = (
  nodes: Node[],
  updateNodeContent: UpdateNodeContent,
  setNodes: GeneralHelpers["setNodes"],
  setEdges: GeneralHelpers["setEdges"],
  addSelectedNodes: ReactFlowActions<Node, Edge>["addSelectedNodes"],
  fitView: FitView,
) => {
  return useCallback(
    (
      nodeType: CustomNodeTypes,
      content: string,
      parentX: number,
      parentY: number,
      tabIndex: number,
      prevNode?: Node,
    ): Node => {
      const newNodeId = ulid();
      //
      const { x, y } = calcNewNodePosition(parentX ?? 0, parentY ?? 0, nodes);
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
        fitView({ padding: 0.1, duration: 0 });
      }, 0);
      return newNode;
    },
    [updateNodeContent, setNodes, addSelectedNodes, setEdges, nodes, fitView],
  );
};
