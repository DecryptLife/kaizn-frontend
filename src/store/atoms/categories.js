import { atom } from "recoil";

const categoriesState = atom({
  key: "categoryState",
  default: [],
});

export default categoriesState;
