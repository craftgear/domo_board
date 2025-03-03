import { useCallback, useLayoutEffect } from "react";
// import type { Ref } from "react";
import { ulid } from "ulid";
import {
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  getOutgoers,
  getIncomers,
  getConnectedEdges,
  MarkerType,
  // reconnectEdge,
  useStoreApi,
} from "@xyflow/react";

import { useUpdateNodeContent } from "./useUpdateNodeContent";
import { useHotkeys } from "./useHotkeys";

import type {
  Node,
  Edge,
  Connection,
  // GeneralHelpers,
  FitView,
} from "@xyflow/react";

import { useNodeIdInEditing } from "@/state";
import { useAddNewNode } from "./useAddNewNode";
import type { CustomNodeTypes, CustomNodeProps } from "@/components/nodes";
import { NODE_SIZE } from "@/components/nodes/BaseNode";

export const createNode = (
  nodeType: CustomNodeTypes,
  x: number,
  y: number,
  data: CustomNodeProps["data"],
) => {
  const newNodeId = ulid();
  return {
    id: newNodeId,
    type: nodeType,
    selected: true,
    position: {
      x,
      y,
    },
    // XXX: このプロパティがないとgetIntersectingNodesですべてのノードが返ってきてしまうので必須。
    measured: {
      width: NODE_SIZE,
      height: NODE_SIZE,
    },
    data,
  };
};

export const createEdge = (sourceNode: Node, targetNode: Node): Edge => {
  return {
    id: `edge-${sourceNode.id}-${targetNode.id}`,
    source: sourceNode.id,
    target: targetNode.id,
  };
};

export const useFlow = (
  initialNodes: Node[],
  initialEdges: Edge[],
  // reactFlowWrapper: Ref<HTMLDivElement>,
) => {
  const {
    setNodes,
    setEdges,
    // getNodes,
    updateNodeData,
    screenToFlowPosition,
    getIntersectingNodes,
    fitView,
    // isNodeIntersecting,
  } = useReactFlow();

  const updateNodeContent = useUpdateNodeContent(updateNodeData);
  const [nodeIdInEditing] = useNodeIdInEditing();

  const store = useStoreApi();
  const { addSelectedNodes } = store.getState();

  const [nodes, _setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, _setEdges, onEdgesChange] = useEdgesState([] as Edge[]);

  const addNewNode = useAddNewNode(
    nodes,
    updateNodeContent,
    setNodes,
    setEdges,
    addSelectedNodes,
    fitView,
  );
  const hotkeys = useHotkeys(addNewNode, !!nodeIdInEditing, nodes);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((edges) =>
        addEdge(
          { ...params, markerEnd: { type: MarkerType.ArrowClosed } },
          edges,
        ),
      );
    },
    [setEdges],
  );

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      // 自動で前後のノードをつなぐ
      const newEdges = deleted.reduce((acc, node) => {
        const incomers = getIncomers(node, nodes, edges);
        const outgoers = getOutgoers(node, nodes, edges);
        const connectedEdges = getConnectedEdges([node], edges);

        const remainingEdges = acc.filter((edge: Edge) => {
          return !connectedEdges.includes(edge);
        });

        const createdEdges =
          outgoers.length > 0 && incomers.length > 0
            ? incomers.flatMap((sourceNode) => {
                return outgoers.map((targetNode) =>
                  createEdge(sourceNode, targetNode),
                );
              })
            : [];

        return [...remainingEdges, ...createdEdges] as Edge[];
      }, edges) as Edge[];

      setEdges(newEdges);
    },
    [setEdges, nodes, edges],
  );

  useLayoutEffect(() => {
    setNodes(
      initialNodes.map((node, index) => ({
        ...node,
        data: { ...node.data, updateNodeContent, tabIndex: index + 1 },
      })),
    );
    setEdges(initialEdges);
    setTimeout(() => {
      fitView();
    }, 0);
  }, [
    setNodes,
    setEdges,
    initialNodes,
    initialEdges,
    updateNodeContent,
    fitView,
  ]);

  return {
    /** flow **/
    nodes,
    onNodesChange,
    edges,
    onEdgesChange,
    /** utility functions **/
    screenToFlowPosition,
    getIntersectingNodes,
    /** event handlers **/
    onConnect,
    onNodesDelete,
    /** hotkeys **/
    onKeyDown: hotkeys,
  };
};

// const onConnectEnd = useCallback(
//   (event: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => {
//     // console.log("----- event", event);
//     // console.log("----- connectionState", connectionState);
//     if (
//       !connectionState.isValid &&
//       connectionState?.fromHandle?.type === "source"
//     ) {
//       // we need to remove the wrapper bounds, in order to get the correct position
//       const id = ulid();
//       const { clientX, clientY } =
//         "changedTouches" in event ? event.changedTouches[0] : event;
//       const newNode = {
//         id,
//         position: screenToFlowPosition({
//           x: clientX,
//           y: clientY,
//         }),
//         data: { label: `Node ${id}` },
//         origin: nodeOrigin,
//       };
//
//       setNodes((nds) => [...nds, newNode]);
//       setEdges((eds) => [
//         ...eds,
//         {
//           id,
//           source: connectionState.fromNode?.id ?? "",
//           target: id,
//         },
//       ]);
//     }
//   },
//   [setNodes, setEdges, screenToFlowPosition],
// );

// const onNodeDrag = useCallback(
//   (_e: MouseEvent, node: Node) => {
//     const intersections = getIntersectingNodes(node).map((n) => n.id);
//     setNodes((nodes) =>
//       nodes.map((node) => ({
//         ...node,
//         className: intersections.includes(node.id) ? "highlight" : "",
//       })),
//     );
//   },
//   [setNodes, getIntersectingNodes],
// );

//

// const onReconnect = useCallback(
//   (oldEdge: Edge, newConnection: Connection) =>
//     setEdges((els) => reconnectEdge(oldEdge, newConnection, els)),
//   [setEdges],
// );
//
// const onDragOver: React.DragEventHandler<HTMLDivElement> = useCallback(
//   (event) => {
//     event.preventDefault();
//     event.dataTransfer.dropEffect = "move";
//   },
//   [],
// );
//
// const onDrop = useCallback(
//   (event: MouseEvent) => {
//     event.preventDefault();
//
//     console.log("----- type", type);
//     if (!type) {
//       return;
//     }
//
//     const position = screenToFlowPosition({
//       x: event.clientX,
//       y: event.clientY,
//     });
//     const newNode = {
//       id: ulid(),
//       type,
//       position,
//       data: { label: `${type} node` },
//     };
//     console.log("----- newNode", newNode);
//
//     setNodes((nodes) => nodes.concat(newNode));
//   },
//   [screenToFlowPosition, type],
// );
//
