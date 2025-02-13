import { type } from "arktype";
import { Node, Edge } from "@xyflow/react";
import { ulid } from "ulid";

const flow = type({ id: "string#flowId", title: "string" });
type Flow = typeof flow.infer & {
  nodes: Node[];
  edges: Edge[];
};
type FlowId = Flow["id"];

const initialNodes: Node[] = [
  {
    id: ulid(),
    position: { x: 0, y: 225 },
    data: {
      content: "Todo一覧を表示したああああああああああああああああ",
      isEditing: false,
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

export const useLoadFlow = (id: string): Flow => {
  if (id === "1") {
    return {
      id: "1" as FlowId,
      title: "flow 1",
      nodes: initialNodes,
      edges: initialEdges,
    };
  }
  return {
    id: "2" as FlowId,
    title: "flow 2",
    nodes: [],
    edges: [],
  };
};
