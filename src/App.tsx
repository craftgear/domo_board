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
import { useBoard } from "@/state";
import { nodeTypes, edgeTypes } from "@/components/nodes";
import { Logo } from "@/components/Logo";

function App() {
  const boardData = useLoadBoard("1");
  const [board, setBoard] = useBoard();

  useEffect(() => {
    setBoard(boardData);
    reactFlowWrapper.current?.focus();
  }, [setBoard, boardData]);

  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

  const {
    nodes,
    onNodesChange,
    edges,
    onEdgesChange,
    onConnect,
    onNodesDelete,
    onKeyDown,
  } = useFlow(board.nodes, board.edges);

  return (
    <div
      className="h-svh w-svw"
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
        minZoom={0.05}
        disableKeyboardA11y={true}
      >
        <Logo />
        <Controls />
        <MiniMap pannable zoomable />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
      <div className="modal">hoge</div>
    </div>
  );
}

export default App;
