import Sidebar from "./Sidebar";
import Summary from "./Summary";
import ItemList from "./ItemList";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import tagState from "../../store/atoms/tags";
import categoriesState from "../../store/atoms/categories";
import axios from "axios";
import BASE_URL from "../../../config";
import itemsState from "../../store/atoms/items";
import LoadingScreen from "../LoadingScreen";

axios.defaults.withCredentials = true;

const HomePage = () => {
  const url = (path) => `${BASE_URL}${path}`;

  const setTags = useSetRecoilState(tagState);
  const setCategories = useSetRecoilState(categoriesState);
  const setItems = useSetRecoilState(itemsState);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(url("/api/category/"), {
          withCredentials: true,
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories: ", error.response || error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get(url("/api/tags/"), {
          withCredentials: true,
        });
        setTags(response.data);
      } catch (error) {
        console.error("Error fetching tags");
      }
    };

    const fetchItems = async () => {
      try {
        const response = await axios.get(url("/api/items/"), {
          withCredentials: true,
        });
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items");
      }
    };

    fetchCategories();
    fetchTags();
    fetchItems();
  }, []);
  return (
    <div>
      <LoadingScreen />
      <div className="w-full flex">
        <div className="w-1/5 h-screen bg-gray-800 text-white">
          <Sidebar />
        </div>
        <div className="flex-1 flex-col max-h-screen w-4/5 p-8">
          <Summary />
          <ItemList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
