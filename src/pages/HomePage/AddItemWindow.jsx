import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { modalState } from "../../store/atoms/model";
import axios from "axios";
import Select from "react-select";
import tagState from "../../store/atoms/tags";
import categoriesState from "../../store/atoms/categories";
import BASE_URL from "../../../config";
import itemsState from "../../store/atoms/items";
const AddItemWindow = ({ selectedItem, setSelected }) => {
  const url = (path) => `${BASE_URL}${path}`;

  const setModalState = useSetRecoilState(modalState);
  const [tags, setTags] = useRecoilState(tagState);
  const [selectedTags, setSelectedTags] = useState([]);
  const [items, setItems] = useRecoilState(itemsState);
  const [buttonState, setButtonState] = useState("ADD ITEM");
  const [categories, setCategories] = useRecoilState(categoriesState);
  const [stockError, setStockError] = useState(false);
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category: "",
    tags: [],
    in_stock: 0,
    available_stock: 0,
    // ... add more fields as necessary
  });

  const tagOptions = tags.map((tag) => ({ value: tag.id, label: tag.tag }));
  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.category,
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleTagChange = (selectedOptions) => {
    // Map the selectedOptions to their values (i.e., tag IDs)
    const selectedTagValues = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];

    setSelectedTags(selectedTagValues); // Update the state with all selected tag IDs

    setFormData((prevFormData) => ({
      ...prevFormData,
      tags: selectedTagValues, // Update formData with all selected tag IDs
    }));
  };

  const handleCategoryChange = (selectedOption) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      category: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleModalClose = () => {
    setFormData({
      sku: "",
      name: "",
      category: "",
      tags: [],
      in_stock: 0,
      available_stock: 0,
    });
    console.log("empty form data");
    setSelected([]);
    setModalState(false);
  };

  useEffect(() => {
    if (formData.in_stock < formData.available_stock) {
      setStockError(true);
    } else {
      setStockError(false);
    }
  }, [formData.available_stock, formData.in_stock]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would handle the submission of the data to your database

    const payload = {
      sku: formData.sku,
      name: formData.name,
      category: formData.category,
      tags: formData.tags,
      in_stock: formData.in_stock,
      available_stock: formData.available_stock,
    };

    if (buttonState === "ADD ITEM") {
      try {
        const response = await axios.post(url("/api/items/"), payload, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        console.log(response.data);
        setItems((oldItems) => [...oldItems, response.data]);
      } catch (err) {
        console.error(err);
      } finally {
        setModalState(false);
        setSelected([]);
      }
    } else {
      try {
        const response = await axios.put(
          url(`/api/items/${selectedItem}/`),
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        console.log(response.data);

        const updatedItems = items.map((item) =>
          item.id === selectedItem[0] ? response.data : item
        );
        console.log(updatedItems);
        setItems(updatedItems);
      } catch (err) {
        console.error(err);
      } finally {
        setModalState(false); // Close the modal after submit
        setButtonState("ADD ITEM");
        setSelected([]);
      }
    }
  };

  useEffect(() => {
    if (selectedItem.length === 1) {
      console.log(selectedItem);
      console.log(items);
      setButtonState("UPDATE");
      const item = items.find((item) => item.id === selectedItem[0]);
      console.log(item);

      setFormData({
        sku: item.sku,
        name: item.name,
        category: item.category,
        tags: item.tags,
        in_stock: item.in_stock,
        available_stock: item.available_stock,
      });

      setSelectedTags(item.tags);
    }
  }, [selectedItem]);

  useEffect(() => {
    console.log("Updated: ", formData);
  }, [formData]);

  return (
    <div className="fixed z-40 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg text-center font-bold mb-4">
          ENTER ITEM DETAILS
        </h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleInputChange}
            placeholder="SKU"
            className="block w-full p-2 border rounded mb-3"
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="block w-full p-2 border rounded mb-3"
          />

          <Select
            isMulti
            name="tags"
            options={tagOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleTagChange}
            value={tagOptions.filter((option) =>
              selectedTags.includes(option.value)
            )}
          ></Select>
          <Select
            name="category"
            options={categoryOptions}
            onChange={handleCategoryChange}
            placeholder="Category"
            value={categoryOptions.find(
              (option) => option.value === formData.category
            )}
            className="block w-full mt-2 border rounded mb-3"
          />

          <input
            type="text"
            name="in_stock"
            value={formData.in_stock}
            onChange={handleInputChange}
            placeholder="In Stock"
            className="block w-full p-2 border rounded mb-3"
          />

          <input
            type="text"
            name="available_stock"
            value={formData.available_stock}
            onChange={handleInputChange}
            placeholder="Available Stock"
            className="block w-full p-2 border rounded mb-3"
          />

          {stockError && (
            <div className="flex justify-center text-sm mb-2 text-red-600">
              Available can't be more
            </div>
          )}

          {/* Add more input fields as needed */}
          <div className="text-center">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-blue-700"
            >
              {buttonState}
            </button>
            <button
              type="button"
              onClick={handleModalClose}
              className="px-4 py-2 ml-2 bg-red-500 text-white rounded hover:bg-red-700"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemWindow;
