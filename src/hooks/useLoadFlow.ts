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
    position: { x: 50, y: 50 },
    data: { label: "1" },
  },
  { id: ulid(), position: { x: 50, y: 300 }, data: { label: "2" } },
];

const initialEdges: Edge[] = [
  {
    id: ulid(),
    source: initialNodes[0].id,
    target: initialNodes[1].id,
  },
];

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
