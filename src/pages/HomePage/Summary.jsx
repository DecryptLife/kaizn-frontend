import { useRecoilValue, useSetRecoilState } from "recoil";
import categoriesState from "../../store/atoms/categories";
import itemsState from "../../store/atoms/items";
import { useState } from "react";
import BASE_URL from "../../../config";
import axios from "axios";

function AddCategory({ setShown }) {
  const url = (path) => `${BASE_URL}${path}`;
  const setCategories = useSetRecoilState(categoriesState);

  const [category, setCategory] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("in category submit");
    const payload = {
      category: category,
    };
    try {
      const response = await axios.post(url("/api/category/"), payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("added category");
      setCategories((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Unable to add category");
    } finally {
      setShown(false);
    }
  };
  return (
    <div className="fixed z-40 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg text-center font-bold mb-4">Add Category</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="block w-full p-2 border rounded mb-3"
            required
          />
          <div className="bg-green-600 text-white p-2 rounded">
            <input
              type="submit"
              value="ADD CATEGORY"
              className="w-full h-full"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

const Summary = () => {
  const categories = useRecoilValue(categoriesState);
  const items = useRecoilValue(itemsState);

  const [showAddCategory, setShowAddCategory] = useState(false);
  return (
    <div className="h-1/3">
      <div className="flex h-3/5">
        <div className="h-4/5 w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl font-bold">Item Dashboard</h1>
          <span className="text-lg">All items</span>
        </div>
        <div className="flex flex-col w-1/2 justify-center">
          <div className="flex justify-between">
            <span>Total Categories</span>
            <span>{categories.length}</span>
          </div>
          <hr className="my-4 border-gray-300" />
          <div className="flex justify-between">
            <span>Total Items</span>
            <span>{items.length}</span>
          </div>
        </div>
      </div>
      <div>
        <button
          className="text-white bg-green-600 shadow-lg p-3 rounded-lg"
          onClick={() => setShowAddCategory(true)}
        >
          NEW ITEM CATEGORY
        </button>
      </div>
      {showAddCategory && <AddCategory setShown={setShowAddCategory} />}
    </div>
  );
};

export default Summary;
