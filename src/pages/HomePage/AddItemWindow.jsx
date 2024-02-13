import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { modalState } from "../../store/atoms/model";
import axios from "axios";
import Select from "react-select";
import tagState from "../../store/atoms/tags";
import categoriesState from "../../store/atoms/categories";

const AddItemWindow = () => {
  const setModalState = useSetRecoilState(modalState);
  const [tags, setTags] = useRecoilState(tagState);
  const [selectedTags, setSelectedTags] = useState([]);
  const [categories, setCategories] = useRecoilState(categoriesState);
  const [formData, setFormData] = useState({
    sku: "",
    email: "",
    category: "",
    tags: [],
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle the submission of the data to your database
    console.log(formData);
    setModalState(false); // Close the modal after submit
  };

  useEffect(() => {
    console.log("Updated: ", formData);
  }, [formData]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
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
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Name"
            className="block w-full p-2 border rounded mb-3"
          />

          {/* <select
            multiple
            name="tags"
            value={selectedTags}
            onChange={handleTagChange}
            placeholder="Tags"
            className="form-multiselect block w-full p-2 border rounded mb-3 mt-1"
          >
            {tags.map((tag) => (
              <option id={tag.id} key={tag.id} value={tag.id}>
                {tag.tag}
              </option>
            ))}
          </select> */}

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
            name="category"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="In Stock"
            className="block w-full p-2 border rounded mb-3"
          />

          {/* Add more input fields as needed */}
          <div className="text-center">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-blue-700"
            >
              ADD ITEM
            </button>
            <button
              type="button"
              onClick={() => setModalState(false)}
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
