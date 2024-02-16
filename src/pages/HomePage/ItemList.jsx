import { useEffect, useState } from "react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  FunnelIcon,
  Cog6ToothIcon,
  WrenchScrewdriverIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";

import AddItemWindow from "./AddItemWindow";
import { useRecoilState, useRecoilValue } from "recoil";
import { modalState } from "../../store/atoms/model";
import categoriesState from "../../store/atoms/categories";
import itemsState from "../../store/atoms/items";
import axios from "axios";
import BASE_URL from "../../../config";

function SortOrFilter({
  categories,
  isOpen,
  onClose,
  selectedIcon,
  setCat,
  setSortOption,
}) {
  const handleSort = (criteria) => {
    setSortOption(criteria);
  };
  const handleFilter = (criteria) => {
    setCat(Number(criteria));
  };

  const sortOptions = ["sku", "name"];

  if (!isOpen) return null;

  return (
    <div className="absolute z-10 top-0 right-0 mb-12 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
      <div
        className="py-1"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu"
      >
        <span className="text-gray-700 w-full px-4 py-2 text-md font-bold">
          Sort/Filter by
        </span>
        {selectedIcon === "sort"
          ? sortOptions.map((option) => {
              return (
                <button
                  key={option}
                  className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  role="menuitem"
                  value={option}
                  onClick={(e) => handleSort(e.target.value)}
                >
                  {option}
                </button>
              );
            })
          : categories.map((category) => {
              return (
                <button
                  key={category.id}
                  className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-10"
                  role="menuitem"
                  value={category.id}
                  onClick={(e) => handleFilter(e.target.value)}
                >
                  {category.category}
                </button>
              );
            })}
      </div>
    </div>
  );
}

const ItemList = () => {
  const url = (path) => `${BASE_URL}${path}`;
  const [showList, setShowList] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemSelected, setItemSelected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useRecoilState(modalState);
  const [items, setItems] = useRecoilState(itemsState);
  const categories = useRecoilValue(categoriesState);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [options, setOptions] = useState(["Update", "Delete"]);
  const [showSortOrFilter, setShowSortOrFilter] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [sortField, setSortField] = useState(""); // 'SKU' or 'Name'

  const tagIcons = {
    1: <Cog6ToothIcon className="tag-icon" />,
    2: <WrenchScrewdriverIcon className="tag-icon" />,
    3: <ShoppingBagIcon className="tag-icon" />,
    4: <ShoppingCartIcon className="tag-icon" />,
    5: <CurrencyDollarIcon className="tag-icon" />,
  };

  function changeItemsView() {
    setShowList((prevState) => !prevState);
  }

  const toggleOptions = () => {
    setIsOptionsOpen((prev) => !prev);
  };

  console.log("Selected Items: " + selectedItems);

  const handleSelectAllClick = (e) => {
    // handleCheckboxChange();
    if (e.target.checked) {
      setSelectedItems(items.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleRowClick = (id) => {
    // handleCheckboxChange();
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const isItemSelected = (id) => {
    return selectedItems.includes(id);
  };

  const areAllSelected = () => {
    return items.length > 0 && selectedItems.length === items.length;
  };

  const handleUpdateItem = async () => {
    setIsModalOpen(true);
  };
  const handleItemsDelete = async () => {
    if (selectedItems.length == 0) {
      console.log("No items selected for deletion");
      return;
    }
    try {
      const response =
        selectedItems.length > 1
          ? await axios.delete(url("/api/items/bulk-delete/"), {
              data: { ids: selectedItems },
              withCredentials: true,
            })
          : await axios.delete(url(`/api/items/${selectedItems}/`), {
              withCredentials: true,
            });

      console.log(response.status);
      if (response.status === 204) {
        console.log("Item Deleted successfully");

        const remainingItems = items.filter(
          (item) => !selectedItems.includes(item.id)
        );
        setItems(remainingItems);

        // Clear the selected items
        setSelectedItems([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOptionClick = (e) => {
    const { name } = e.target;

    if (name === "Update") {
      handleUpdateItem();
    } else {
      handleItemsDelete();
    }
  };

  const handleSortSelection = (criteria) => {
    setSortField(criteria);
  };

  const closeShowOrFilter = () => {
    setShowSortOrFilter(false);
  };

  const handleSortOrFilter = (choice) => {
    setSelectedIcon(choice);
    setShowSortOrFilter(!showSortOrFilter);
  };

  const getStockColor = (stock) => {
    if (stock < 1000) return "bg-red-600";
    else if (stock < 10000) return "bg-yellow-500";
    else return "bg-lime-600";
  };

  const getAvailableStockColor = (in_stock, av_stock) => {
    if (av_stock === 0) return "bg-red-600";

    if (in_stock === av_stock) return getStockColor(in_stock);

    let percent = (av_stock / in_stock) * 100;
    if (percent < 40) return "bg-red-600";
    else if (percent < 60) return "bg-yellow-500";
    else return "bg-lime-600";
  };

  useEffect(() => {
    if (selectedItems.length > 0) {
      setItemSelected(true);
      if (selectedItems.length === 1) {
        setOptions(["Update", "Delete"]);
      }
    } else {
      setItemSelected(false);

      setOptions(["Delete"]);
    }
  }, [selectedItems]);

  const filteredItems = items.filter((item) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = item.name.toLowerCase().includes(query);
    const skuMatch = item.sku.toLowerCase().includes(query);

    const catId = Number(selectedCategory);
    const catMatch = selectedCategory ? item.category === catId : true;

    return (nameMatch || skuMatch) && catMatch;
  });

  const getSortedItems = (items, sortField) => {
    // Copy the array before sorting to avoid mutating the original array
    return sortField
      ? items.sort((a, b) => {
          const itemA = a[sortField].toLowerCase();
          const itemB = b[sortField].toLowerCase();

          if (itemA < itemB) {
            return -1;
          }
          if (itemA > itemB) {
            return 1;
          }
          return 0;
        })
      : items;
  };

  const sortedItems = getSortedItems(filteredItems, sortField);

  function ItemListContentDetails() {
    return (
      <div className="relative overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="item-list">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={areAllSelected()}
                  onChange={handleSelectAllClick}
                />
              </th>
              <th className="item-list-header">SKU</th>
              <th className="item-list-header">Name</th>
              <th className="item-list-header-center">Tags</th>
              <th className="item-list-header">Category</th>
              <th className="item-list-header">In Stock</th>
              <th className="item-list-header">Available Stocks</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className="h-16">
                <td className="item-list">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={isItemSelected(item.id)}
                    onChange={() => handleRowClick(item.id)}
                  />
                </td>
                <td className="item-list">{item.sku}</td>
                <td className="item-list">{item.name}</td>
                <td className="item-list flex items-center justify-center h-16 w-full">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center justify-center h-16"
                    >
                      {tagIcons[tag]}
                    </span>
                  ))}
                </td>
                <td className="item-list">
                  {categories[item.category - 1].category}
                </td>
                <td className="item-list">
                  <div className="flex justify-between ">
                    <div
                      className={`w-3 h-3 rounded-full ${getStockColor(
                        item.available_stock
                      )}`}
                    ></div>
                    <span className="w-4/6">{item.in_stock}</span>
                  </div>
                </td>
                <td className="item-list">
                  <div className="flex justify-between ">
                    <div
                      className={`w-3 h-3 rounded-full  ${getAvailableStockColor(
                        item.in_stock,
                        item.available_stock
                      )}`}
                    ></div>
                    <span className="w-4/6">{item.available_stock}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <SortOrFilter
          categories={categories}
          isOpen={showSortOrFilter}
          onClose={closeShowOrFilter}
          selectedIcon={selectedIcon}
          setCat={setSelectedCategory}
          setSortOption={handleSortSelection}
        />
      </div>
    );
  }

  return (
    <div className="h-2/3 overflow-auto">
      <div className="flex justify-between h-12 bg-zinc-300 p-2 rounded-lg shadow">
        <div>
          <span>{categories.length} Subcategories</span>
        </div>
        <div>
          {showList ? (
            <ChevronUpIcon className="h-5 w-5" onClick={changeItemsView} />
          ) : (
            <ChevronDownIcon className="h-5 w-5" onClick={changeItemsView} />
          )}
        </div>
      </div>
      {showList && (
        <div className="flex flex-col px-4  overflow-auto  shadow-lg">
          {/* List Items Header */}
          <div className="flex justify-between  p-4">
            {/* buttons */}
            <div className="flex items-center">
              <div>
                <button
                  className="text-white bg-green-600 p-3 px-8 rounded-lg shadow-md"
                  onClick={() => setIsModalOpen(true)}
                >
                  NEW ITEM
                </button>
              </div>
              <div>
                <button
                  className={`p-3 px-8 ml-8 shadow-md rounded-lg ${
                    itemSelected
                      ? "bg-zinc-200 hover:bg-zinc-300"
                      : "bg-zinc-100 cursor-not-allowed"
                  }`}
                  disabled={!itemSelected}
                  onClick={toggleOptions}
                >
                  OPTIONS
                </button>

                {isOptionsOpen && itemSelected && (
                  <div
                    className="origin-top-right absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <div className="py-1" role="none">
                      {/* Option items */}
                      {options.map((option) => {
                        return (
                          <button
                            key={option}
                            name={option}
                            className="text-gray-700 block w-full text-left px-4 py-2 font-bold text-sm hover:bg-gray-100"
                            role="menuitem"
                            onClick={handleOptionClick}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* additional features */}
            <div className="flex">
              <div className="relative space-x-4">
                <input
                  className="px-4 py-2 h-12"
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <MagnifyingGlassIcon className=" absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6" />
              </div>
              <div className="flex space-x-2">
                <ChartBarIcon
                  className="w-12 h-12"
                  onClick={() => handleSortOrFilter("sort")}
                />
                <FunnelIcon
                  className="w-12 h-12"
                  onClick={() => handleSortOrFilter("filter")}
                />
              </div>
            </div>
          </div>
          {/* List Items */}
          <ItemListContentDetails />
        </div>
      )}
      {isModalOpen && (
        <AddItemWindow
          selectedItem={selectedItems}
          setSelected={setSelectedItems}
        />
      )}
    </div>
  );
};

export default ItemList;
