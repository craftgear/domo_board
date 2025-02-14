import { useRef, useEffect } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from "@xyflow/react";

import { useFlow } from "@/hooks/useFlow";
import { useLoadFlow } from "@/hooks/useLoadFlow";
import { nodeTypes, edgeTypes } from "@/components/Types";
import { Logo } from "@/components/Logo";

function App() {
  const { nodes: initialNodes, edges: initialEdges } = useLoadFlow("1");

  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    reactFlowWrapper.current?.focus();
  }, []);

  const {
    nodes,
    onNodesChange,
    edges,
    onEdgesChange,
    onConnect,
    onNodesDelete,
    onKeyDown,
  } = useFlow(initialNodes, initialEdges, reactFlowWrapper);

  return (
    <div
      className="size-full "
      ref={reactFlowWrapper}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
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
        <Logo />
        <Controls />
        <MiniMap pannable zoomable />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export default App;
