import React, { useState, useRef, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { FaAngleDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SettingAdmin from "../UserAdmin/SettingAdmin";
import axios from "axios";
import Avatar from "../../assets/image/avatar_default.png"; // Sử dụng avatar mặc định đã nhập

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [isModalAdd, setIsModalAdd] = useState(false);
  const [isSelectedUserId, setIsSelectedUserId] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("userId");

    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedUserId) {
      setIsSelectedUserId(storedUserId);
      // Lấy thông tin người dùng từ API
      fetchUserData(storedUserId);
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${userId}`);

      // Sử dụng avatar từ DB hoặc avatar mặc định
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleOpenAdd = () => {
    setIsModalAdd(true);
    setIsDropdownOpen(false);
  };

  const handleCloseAdd = () => {
    setIsModalAdd(false);
  };

  return (
    <div className="w-full bg-white font-montserrat">
      <div className="w-full flex px-2 py-4 justify-between items-center">
        <div className="text-xl font-semibold">Dashboard</div>
        <div className="flex gap-4">
          <div className="flex border items-center justify-center p-2 rounded-lg">
            <input
              className="font-semibold focus:outline-none"
              placeholder="Search"
            />
            <div className="bg-blue-500 p-1 rounded-lg">
              <CiSearch color="white" size={16} />
            </div>
          </div>
          <div
            className="cursor-pointer flex items-center justify-center gap-2 border rounded-lg p-2 relative"
            onClick={toggleDropdown}
            ref={dropdownRef}
          >
            <img
              alt="User Avatar"
              src={Avatar} // Sử dụng avatar từ state, hoặc ảnh mặc định
              className="rounded-full h-10 w-10 border-black border"
            />
            <div className="font-semibold">{username || "User"}</div>
            <div>
              <FaAngleDown />
            </div>
          </div>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-[58px] mr-2 w-48 bg-white border rounded-lg shadow-lg z-10">
              <ul className="py-1">
                <li
                  onClick={handleOpenAdd}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  Settings
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Modal cho cài đặt người dùng */}
      <SettingAdmin
        visible={isModalAdd}
        onClose={handleCloseAdd}
        userId={isSelectedUserId}
      />
    </div>
  );
}
