import { Node, Edge } from "@xyflow/react";
import { ulid } from "ulid";
import { useNodesAndEdges } from "@/store";
import { type BoardId, type Board, type ProjectId, BIG_PICTURE } from "@/types";

const initialNodes: Node[] = [
  {
    id: ulid(),
    position: { x: 0, y: 225 },
    data: {
      content: "1",
    },
    type: "EventNode",
  },
  {
    id: ulid(),
    position: { x: 250, y: 150 },
    data: { content: "2" },
    type: "EventNode",
  },
  {
    id: ulid(),
    position: { x: 250, y: 300 },
    data: { content: "3" },
    type: "EventNode",
  },
];

const initialEdges: Edge[] = [];

export const useLoadBoard = (id: string): Board => {
  if (id === "1") {
    return {
      id: "1" as BoardId,
      projectId: "1" as ProjectId,
      title: "flow 1",
      nodes: initialNodes,
      edges: initialEdges,
      previousBoardId: null,
      nextBoardId: null,
      mode: BIG_PICTURE,
      nodeIdInEditing: null,
    };
  }
  return {
    id: "2" as BoardId,
    projectId: "1" as ProjectId,
    title: "flow 2",
    nodes: [],
    edges: [],
    previousBoardId: null,
    nextBoardId: null,
    mode: BIG_PICTURE,
    nodeIdInEditing: null,
  };
};
