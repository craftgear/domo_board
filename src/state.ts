import { Store, useStore } from "@tanstack/react-store";

import type { Board } from "@/types";
import { BIG_PICTURE, DESIGN_LEVEL } from "@/types";

const BoardStore = new Store<Board>({
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
  BoardStore.setState((state) => ({
    ...state,
    nodeIdInEditing: nodeId,
  }));
};

export const useNodeIdInEditing = (): [
  string | null,
  typeof setNodeIdInEditing,
] => [
  useStore(BoardStore, (state) => {
    return state["nodeIdInEditing"];
  }),
  setNodeIdInEditing,
];

const setBoard = (board: Board) => {
  BoardStore.setState((prev) => ({
    ...prev,
    ...board,
  }));
};

export const useBoard = (): [board: Board, typeof setBoard] => [
  useStore(BoardStore, (state) => state),
  setBoard,
];
