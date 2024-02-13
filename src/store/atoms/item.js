import { atom } from "recoil";

const itemState = atom({
  key: "itemState",
  default: {
    isLoading: true,
    item: null,
  },
});
