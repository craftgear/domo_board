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
    return nodesToCheck.every((node) => {
      return (
        newY > node.position.y + (node.measured?.height || 0) ||
        newY + NODE_SIZE < node.position.y
      );
    });
  };

  const repeatX = 10;
  const repeatY = 5;
  for (let column = 1; column < repeatX; column++) {
    const nodesToCheck = nodes.filter((node) => {
      return node.position.x >= parentX + (NODE_SIZE + NODE_GAP) * column;
    });
    for (let row = 0; row < repeatY; row++) {
      const lowerPosition = {
        x: parentX + column * (NODE_SIZE + NODE_GAP),
        y: parentY + row * (NODE_SIZE + NODE_GAP),
      };
      const upperPosition = {
        x: parentX + column * (NODE_SIZE + NODE_GAP),
        y: parentY - row * (NODE_SIZE + NODE_GAP),
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
    x: parentX + (NODE_SIZE + NODE_GAP) * Math.random() * repeatX,
    y: parentY + (NODE_SIZE + NODE_GAP) * Math.random() * repeatY,
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
      prevNode: Node,
    ): Node => {
      const { x, y } = calcNewNodePosition(parentX ?? 0, parentY ?? 0, nodes);
      // TODO: createNodeをaddNewNodeから外してuseHotKeyに移す
      // ノードタイプごとにdataプロパティに異なるデータを持たせたい
      const newNode = createNode(nodeType, x, y, {
        content,
        updateNodeContent,
        tabIndex,
      });

      setNodes((nodes) => [...nodes, newNode]);

      if (prevNode && nodeType !== "HotspotNode") {
        const newEdge = createEdge(prevNode, newNode);
        setEdges((edges) => [...edges, newEdge]);
      }

      // XXX: do not delete setTimeout or fitView doesn't work as expected
      setTimeout(() => {
        addSelectedNodes([newNode.id]);
        // TODO: change to setCenter
        fitView({ padding: 0.1, duration: 0 });
      }, 0);
      return newNode;
    },
    [updateNodeContent, setNodes, addSelectedNodes, setEdges, nodes, fitView],
  );
};
