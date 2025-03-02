import { useCallback } from "react";
import { ulid } from "ulid";
import type {
  GeneralHelpers,
  ReactFlowActions,
  Node,
  Edge,
} from "@xyflow/react";
import type { UpdateNodeContent } from "./useUpdateNodeContent";
import type { CustomNodeTypes } from "@components/nodes";
import { createNode, createEdge } from "./useFlow";

export type addNewNodeFn = (
  nodeType: CustomNodeTypes,
  content: string,
  parentX: number,
  parentY: number,
  tabIndex: number,
  prevNode?: Node,
) => Node;

const calcNewNodePosition = (x: number, y: number, nodes: Node[]) => {
  const NODE_SIZE = 130; // Assuming nodes are 96x96 pixels (w-24, h-24 in Tailwind)
  const PADDING = 20; // Additional padding between nodes

  // Check if a position is available (doesn't overlap with existing nodes)
  const isPositionAvailable = (newX: number, newY: number) => {
    return nodes.every((node) => {
      const { x, y } = node.position;
      const width = node.measured?.width ?? NODE_SIZE;
      const height = node.measured?.height ?? NODE_SIZE;

      console.log("----- newX, newY", newX, newY);
      console.log("----- var", x, width, PADDING, y, height, PADDING);
      return newX > x + width || newY > y + height;
    });
  };

  // Try positions in a spiral pattern around the parent node
  let radius = 1;
  const vectors: [number, number][] = [
    [1, 0],
    [1, 1],
    [1, -1],
  ];
  while (radius < 10) {
    // Limit the search radius to avoid infinite loops
    for (const vec of vectors) {
      const [vx, vy] = vec;
      const newX = x + vx * radius * (NODE_SIZE + PADDING);
      const newY = y + vy * radius * (NODE_SIZE + PADDING);

      if (isPositionAvailable(newX, newY)) {
        return { x: newX, y: newY };
      }
    }
    radius++;
  }

  // If no position is found, return a default position
  return { x: x + NODE_SIZE + PADDING, y: y + NODE_SIZE + PADDING };
};

export const useAddNewNode = (
  nodes: Node[],
  updateNodeContent: UpdateNodeContent,
  setNodes: GeneralHelpers["setNodes"],
  setEdges: GeneralHelpers["setEdges"],
  addSelectedNodes: ReactFlowActions<Node, Edge>["addSelectedNodes"],
  getIntersectionNodes: GeneralHelpers["getIntersectingNodes"],
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
      console.log("----- nodes", nodes);
      const { x, y } = calcNewNodePosition(parentX ?? 0, parentY ?? 0, nodes);
      console.log("----- x, y", x, y);
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
        // fitView({ padding: 0.1, duration: 100 });
      }, 0);
      return newNode;
    },
    [updateNodeContent, setNodes, addSelectedNodes, setEdges, nodes],
  );
};
