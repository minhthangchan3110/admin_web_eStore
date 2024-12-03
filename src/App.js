import "./index.css";
import LayoutScreen from "./layout/Layout";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import DashboardScreen from "./screens/Dashboard/DashboardScreen";
import CategoryScreen from "./screens/Category/CategoryScreen";
import SubCategoryScreen from "./screens/SubCategory/SubCategoryScreen";
import BrandScreen from "./screens/Brands/BrandScreen";
import VariantType from "./screens/VariantType/VariantType";
import Variants from "./screens/Variants/Variants";
import Coupons from "./screens/Coupons/Coupons";
import Orders from "./screens/Order/Orders";
import PosterScreen from "./screens/Poster/PosterScreen";
import LoginScreen from "./screens/Login/LoginScreen";
import React, { useState, useEffect } from "react";
import RegisterScreen from "./screens/SignUp/RegisterScreen";
import UserScreen from "./screens/User/UserScreen";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Kiểm tra xem có thông tin trong localStorage không
    const savedAuth = localStorage.getItem("isAuthenticated");
    return savedAuth === "true"; // Chuyển đổi từ chuỗi sang boolean
  });

  const [userRole, setUserRole] = useState(() => {
    const savedRole = localStorage.getItem("userRole");
    return savedRole || ""; // Nếu không có giá trị thì trả về chuỗi rỗng
  });

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem("isAuthenticated", "true"); // Lưu trạng thái vào localStorage
    localStorage.setItem("userRole", role); // Lưu vai trò vào localStorage
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole("");
    localStorage.removeItem("isAuthenticated"); // Xóa thông tin khi đăng xuất
    localStorage.removeItem("userRole"); // Xóa vai trò khi đăng xuất
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route
          path="/"
          element={
            isAuthenticated && userRole === "admin" ? (
              <LayoutScreen onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route index element={<DashboardScreen />} />
          <Route path="category" element={<CategoryScreen />} />
          <Route path="sub_category" element={<SubCategoryScreen />} />
          <Route path="brand" element={<BrandScreen />} />
          <Route path="variant_type" element={<VariantType />} />
          <Route path="variant" element={<Variants />} />
          <Route path="order" element={<Orders />} />
          <Route path="coupon" element={<Coupons />} />
          <Route path="poster" element={<PosterScreen />} />
          <Route path="user" element={<UserScreen />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
