import { useCallback, type Ref } from "react";

import {
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  getOutgoers,
  getIncomers,
  getConnectedEdges,
  // reconnectEdge,
} from "@xyflow/react";
import type { Node, Edge, Connection } from "@xyflow/react";

export const useFlow = (
  initialNodes: Node[],
  initialEdges: Edge[],
  wrapper: Ref<HTMLDivElement>,
) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition, getIntersectingNodes } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => {
      // console.log("----- params", params);
      setEdges((edges) => addEdge(params, edges));
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
  return {
    /** flow **/
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    /** utility functions **/
    screenToFlowPosition,
    getIntersectingNodes,
    /** event handlers **/
    onConnect,
    onNodesDelete,
  };
};
