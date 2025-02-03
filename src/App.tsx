import { useState, useCallback } from "react";
import {
  ReactFlow,
  type Node,
  type Edge,
  type Connection,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  // addEdge,
} from "@xyflow/react";
import { ulid } from "ulid";

const initialNodes: Node[] = [
  {
    id: ulid(),
    position: { x: 50, y: 50 },
    data: { label: "1" },
  },
  { id: ulid(), position: { x: 50, y: 200 }, data: { label: "2" } },
];

const initialEdges: Edge[] = [
  { id: ulid(), source: initialNodes[0].id, target: initialNodes[1].id },
];

import "@xyflow/react/dist/style.css";

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => {
      console.log("----- params", params);
      setEdges((edges) => addEdge(params, edges));
    },
    [setEdges],
  );

  return (
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        snapToGrid={true}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export default App;
