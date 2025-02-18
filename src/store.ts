import type { Node, Edge } from "@xyflow/react";
import { Store, useStore } from "@tanstack/react-store";

import type { Board } from "@/types";
import { BIG_PICTURE, DESIGN_LEVEL } from "@/types";

const BoardState = new Store<Board>({
  projectId: null,
  id: null,
  title: "",
  previousBoardId: null,
  nextBoardId: null,
  mode: BIG_PICTURE,
  nodeIdInEditing: null,
  nodes: [],
  edges: [],
});

const setNodeIdInEditing = (nodeId: string | null) => {
  BoardState.setState((state) => ({
    ...state,
    nodeIdInEditing: nodeId,
  }));
};
export const useNodeIdInEditing = (): [
  string | null,
  typeof setNodeIdInEditing,
] => [
  useStore(BoardState, (state) => state["nodeIdInEditing"]),
  setNodeIdInEditing,
];

const setBoard = (board: Board) => {
  BoardState.setState(() => board);
};

export const useBoard = (): [board: Board, typeof setBoard] => [
  useStore(BoardState, (state) => state),
  setBoard,
];
