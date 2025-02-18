import { useRef, useEffect } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from "@xyflow/react";

import { useFlow } from "@/hooks/useFlow";
import { useLoadBoard } from "@/hooks/useLoadBoard";
import { useBoard } from "@/store";
import { nodeTypes, edgeTypes } from "@/components/NodeTypes";
import { Logo } from "@/components/Logo";

function App() {
  const boardData = useLoadBoard("1");
  const [board, setBoard] = useBoard();
  setBoard(boardData);
  console.log("----- board", board);

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
  } = useFlow(board.nodes, board.edges, reactFlowWrapper);

  return (
    <div
      className="size-full "
      id="flow-wrapper"
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
