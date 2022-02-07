import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export interface ILikes {
  id: string;
  type: string;
}

export const likesState = atom<ILikes[]>({
  key: "likes",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
