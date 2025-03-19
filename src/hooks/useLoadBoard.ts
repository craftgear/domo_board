import { useMemo } from "react";
import { Node, Edge } from "@xyflow/react";
import { ulid } from "ulid";
import { type BoardId, type Board, type ProjectId, BIG_PICTURE } from "@/types";

const initialNodes: Node[] = [
  {
    id: ulid(),
    position: { x: 0, y: 225 },
    data: {
      content: "1",
      hotspots: [],
    },
    type: "EventNode",
  },
  {
    id: ulid(),
    position: { x: 250, y: 100 },
    data: { content: "2", hotspots: [] },
    type: "EventNode",
  },
  {
    id: ulid(),
    position: { x: 250, y: 300 },
    data: { content: "3", hotspots: [] },
    type: "EventNode",
  },
];

const initialEdges: Edge[] = [
  {
    id: `edge-${ulid()}`,
    source: initialNodes[0].id,
    target: initialNodes[1].id,
  },
  {
    id: `edge-${ulid()}`,
    source: initialNodes[0].id,
    target: initialNodes[2].id,
  },
];

export const useLoadBoard = (id: string): Board => {
  const dummyData = useMemo(() => {
    return [
      {
        id: "1" as BoardId,
        projectId: "1" as ProjectId,
        title: "flow 1",
        nodes: initialNodes,
        edges: initialEdges,
        previousBoardId: null,
        nextBoardId: null,
        mode: BIG_PICTURE,
        nodeIdInEditing: null,
      },
      {
        id: "2" as BoardId,
        projectId: "1" as ProjectId,
        title: "flow 2",
        nodes: [],
        edges: [],
        previousBoardId: null,
        nextBoardId: null,
        mode: BIG_PICTURE,
        nodeIdInEditing: null,
      },
    ];
  }, []);

  if (id === "1") {
    return dummyData.filter((x) => x.id === "1")[0];
  }
  return dummyData[1];
};
