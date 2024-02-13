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

const ItemList = () => {
  const [showList, setShowList] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemSelected, setItemSelected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useRecoilState(modalState);
  const [items, setItems] = useRecoilState(itemsState);
  const categories = useRecoilValue(categoriesState);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [options, setOptions] = useState(["Update", "Delete"]);
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

  const handleUpdateItem = () => {};
  const handleItemsDelete = () => {};

  const handleOptionClick = (e) => {
    const { name } = e.target;

    if (name === "Update") {
      handleUpdateItem();
    } else {
      handleItemsDelete();
    }
  };

  const getStockColor = (stock) => {
    if (stock < 1000) return "bg-red-600";
    else if (stock < 10000) return "bg-yellow-500";
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

    return nameMatch || skuMatch;
  });

  function ItemListContentDetails() {
    return (
      <div className="overflow-x-auto">
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
                      className={`w-3 h-3 rounded-full  ${getStockColor(
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
                    className="origin-top-right absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
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
                      {/* <button
                        className="text-gray-700 block w-full text-left px-4 py-2 font-bold text-sm hover:bg-gray-100"
                        role="menuitem"
                      >
                        Update
                      </button>
                      <button
                        className="text-gray-700 block w-full text-left px-4 py-2 font-bold text-sm hover:bg-gray-100"
                        role="menuitem"
                      >
                        Delete
                      </button> */}
                      {/* ... more options here */}
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
                <ChartBarIcon className="w-12 h-12" />
                <FunnelIcon className="w-12 h-12" />
              </div>
            </div>
          </div>
          {/* List Items */}
          <ItemListContentDetails />
        </div>
      )}
      {isModalOpen && <AddItemWindow />}
    </div>
  );
};

export default ItemList;
