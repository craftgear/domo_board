import { useCallback, type Ref, type KeyboardEventHandler } from "react";
import { ulid } from "ulid";
import { useUpdateNodeContent } from "./useUpdateNodeContent";
import { useHotkeys } from "./useHotkeys";

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
} from "@xyflow/react";
import type { Node, Edge, Connection, GeneralHelpers } from "@xyflow/react";

import { useNodeIdInEditing } from "@/store";

export const useFlow = (
  initialNodes: Node[],
  initialEdges: Edge[],
  reactFlowWrapper: Ref<HTMLDivElement>,
) => {
  const {
    setNodes,
    updateNodeData,
    setEdges,

    screenToFlowPosition,
    getIntersectingNodes,
  } = useReactFlow();

  const updateNodeContent = useUpdateNodeContent(updateNodeData);
  const [nodeIdInEditing] = useNodeIdInEditing();

  const addNewNode = useCallback(
    (type: string, content: string, x: number, y: number) => {
      setNodes((nodes) => [
        ...nodes,
        {
          id: ulid(),
          type,
          position: {
            x,
            y,
          },
          data: {
            content,
            updateNodeContent,
          },
        },
      ]);
    },
    [updateNodeContent, setNodes],
  );

  const hotkeys = useHotkeys(addNewNode, !!nodeIdInEditing);

  const [nodes, _setNodes, onNodesChange] = useNodesState(
    initialNodes.map((node) => ({
      ...node,
      data: { ...node.data, updateNodeContent },
    })),
  );
  const [edges, _setEdges, onEdgesChange] = useEdgesState(initialEdges);

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
      const newEdges = deleted.reduce((acc, node) => {
        const incomers = getIncomers(node, nodes, edges);
        const outgoers = getOutgoers(node, nodes, edges);
        const connectedEdges = getConnectedEdges([node], edges);

        const remainingEdges = acc.filter((edge) => {
          return !connectedEdges.includes(edge);
        });

        const createdEdges =
          outgoers.length > 0 && incomers.length > 0
            ? incomers.flatMap(({ id: source }) => {
                return outgoers.map(({ id: target }) => ({
                  id: `${source}-${target}`,
                  source,
                  target,
                }));
              })
            : [];

        return [...remainingEdges, ...createdEdges] as Edge[];
      }, edges) as Edge[];

      setEdges(newEdges);
    },
    [setEdges, nodes, edges],
  );

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
