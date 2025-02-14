import { Store, useStore } from "@tanstack/react-store";

type BoardStateType = {
  nodeIdInEditing: string | null;
};
const BoardState = new Store<BoardStateType>({
  nodeIdInEditing: null,
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
