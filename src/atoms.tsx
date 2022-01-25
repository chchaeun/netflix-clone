import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export interface ITodo {
  id: number;
  text: string;
}

interface ItodoState {
  [key: string]: ITodo[];
}

export const todoState = atom<ItodoState>({
  key: "todos",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const boardState = atom<string[]>({
  key: "boards",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
