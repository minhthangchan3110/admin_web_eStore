import React, { useState } from "react";
import { Layout, Menu } from "antd";
import Logo from "../assets/image/2301.png";
import { MdOutlineDashboard } from "react-icons/md";
import { MdInsertChartOutlined } from "react-icons/md";
import { MdPieChartOutline } from "react-icons/md";
import { RiShoppingBag3Line } from "react-icons/ri";
import { CiViewList } from "react-icons/ci";
import { FiBell } from "react-icons/fi";
import { CiUser } from "react-icons/ci";
import { RiCoupon2Line } from "react-icons/ri";
import { FaRegBookmark } from "react-icons/fa";
import { Link } from "react-router-dom"; // Nhập Link
import Header from "../components/HeaderScreen/Header";
import { Outlet } from "react-router-dom"; // Nhập Outlet

const { Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem(<Link to="/">Dashboard</Link>, "dashboard", <MdOutlineDashboard />),
  getItem(
    <Link to="/category">Category</Link>,
    "category",
    <MdInsertChartOutlined />
  ),
  getItem(
    <Link to="/sub_category">Sub Category</Link>,
    "subcategory",
    <MdPieChartOutline />
  ),
  getItem(<Link to="/brand">Brands</Link>, "brand", <CiViewList />),
  getItem(
    <Link to="/variant_type">Variant Type</Link>,
    "varianttype",
    <RiShoppingBag3Line />
  ),
  getItem(<Link to="/variant">Variants</Link>, "variant", <FiBell />),
  getItem(<Link to="/order">Orders</Link>, "orders", <CiUser />),
  getItem(<Link to="/coupon">Coupons</Link>, "coupon", <RiCoupon2Line />),
  getItem(<Link to="/poster">Posters</Link>, "poster", <FaRegBookmark />),
  // getItem("Notifications", "noti", <FiBell />),
  getItem(<Link to="/user">User</Link>, "user", <CiUser />),
];

const LayoutScreen = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ backgroundColor: "#fff" }}
      >
        <img src={Logo} alt="#" className="" />
        <Menu
          theme="light"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          className="font-montserrat"
        />
      </Sider>
      <Layout>
        <Header />
        <Content style={{ margin: "0 16px" }}>
          <Outlet /> {/* Hiển thị nội dung route con */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutScreen;
