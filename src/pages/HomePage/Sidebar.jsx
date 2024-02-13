import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import BASE_URL from "../../../config";
const Sidebar = () => {
  const url = (path) => `${BASE_URL}${path}`;
  const navigate = useNavigate();
  const sidebar_items_top = {
    Home: "/",
    Items: "/items",
    Stock: "/stock",
    Build: "/build",
    Customers: "/customers",
    "Sales Orders": "/",
    Suppliers: "/",
    Manufacturers: "/",
    "Purchase Orders": "/",
    Reports: "/",
  };

  function handleWasteClick() {}

  async function handleLogout() {
    try {
      await axios.post(url("/api/logout/"), {
        withCredentials: true,
      });

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }
  const sidebar_items_down = [
    { key: "Help", action: handleWasteClick },

    { key: "Integrations", action: handleWasteClick },
    { key: "Logout", action: handleLogout },
    { key: "My Profile", action: handleWasteClick },
  ];
  return (
    <div className="flex flex-col justify-between p-4 h-screen">
      {/* sidebar top */}
      <div>
        {Object.entries(sidebar_items_top).map(([key, value]) => (
          <Link
            to={value}
            key={key}
            className="flex items-center  p-2 my-2 transition-colors duration-200 justify-start text-gray-800 hover:text-white hover:bg-yellow-500 rounded-lg "
          >
            <span className="mx-4 text-white font-bold">{key}</span>
          </Link>
        ))}
      </div>
      {/* sidebar down */}
      <div>
        {sidebar_items_down.map((menu) => (
          <div
            key={menu.key}
            className="flex items-center p-2 my-2 transition-colors duration-200 justify text-gray-800 hover:text-white hover:bg-yellow-500 rounded-lg"
            onClick={menu.action}
          >
            <span className="mx-4 text-white font-bold">{menu.key}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
