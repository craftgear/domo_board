import { useRef } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from "@xyflow/react";

import { useFlow } from "@/hooks/useFlow";
import { useLoadFlow } from "@/hooks/useLoadFlow";
import { nodeTypes, edgeTypes } from "@components/Types";

import "@xyflow/react/dist/style.css";

function App() {
  const { nodes: initialNodes, edges: initialEdges } = useLoadFlow("1");
  const reactFlowWrapper = useRef(null);

  const {
    nodes,
    onNodesChange,
    edges,
    onEdgesChange,
    onConnect,
    onNodesDelete,
  } = useFlow(initialNodes, initialEdges, reactFlowWrapper);

  return (
    <div className="size-full dndflow" ref={reactFlowWrapper}>
      <ReactFlow
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodesDelete={onNodesDelete}
        snapToGrid={false}
        colorMode="light"
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export default App;
