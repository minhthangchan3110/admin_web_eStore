import React, { useEffect, useState } from "react";
import { FcMultipleDevices } from "react-icons/fc";
import { MdMoreVert } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { IoReload } from "react-icons/io5";
import TableScreen from "../../components/Dashboard/Table";
import DonutChart from "../../components/Dashboard/DonutChart";
import ModalAddProduct from "../../components/Dashboard/ModalAddProduct";
import axios from "axios";
import { message } from "antd";

export default function DashboardScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const API_URL =
    process.env.NODE_ENV === "production"
      ? "https://admin-estore-l29q.onrender.com"
      : "http://localhost:3000";
  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);

        console.log("Dữ liệu nhận được từ API:", response.data);

        if (Array.isArray(response.data.data)) {
          const formattedData = response.data.data.map((product) => ({
            key: product._id,
            quantity: product.quantity,
            name: product.name,
          }));

          setData(formattedData);
        } else {
          console.error("Dữ liệu không phải là một mảng");
          message.error("Dữ liệu nhận được không đúng định dạng");
        }
      } catch (error) {
        console.error(error);
        message.error("Đã xảy ra lỗi khi lấy dữ liệu");
      } finally {
      }
    };

    fetchData();
  }, []);

  const totalProducts = data.length;

  // Tính toán phần trăm progress cho từng loại sản phẩm
  const outOfStock = data.filter((product) => product.quantity === 0).length;
  const limitedStock = data.filter(
    (product) => product.quantity > 0 && product.quantity < 5
  ).length;
  const otherStock = data.filter((product) => product.quantity >= 5).length;

  const myProduct = [
    {
      name: "All Product",
      quantity: totalProducts,
      color: "bg-blue-600",
      progress: `${((totalProducts / totalProducts) * 100).toFixed(0)}%`, // All Products: 100% (đảm bảo không chia cho 0)
    },
    {
      name: "Out of Stock",
      quantity: outOfStock,
      color: "bg-red-600",
      progress: `${((outOfStock / totalProducts) * 100).toFixed(0)}%`,
    },
    {
      name: "Limited Stock",
      quantity: limitedStock,
      color: "bg-yellow-600",
      progress: `${((limitedStock / totalProducts) * 100).toFixed(0)}%`,
    },
    {
      name: "Other Stock",
      quantity: otherStock,
      color: "bg-green-600",
      progress: `${((otherStock / totalProducts) * 100).toFixed(0)}%`,
    },
  ];

  return (
    <div className="w-full grid grid-cols-3 font-montserrat gap-2 rounded-lg my-2">
      <div className=" col-span-2 flex flex-col gap-2">
        <section className="bg-white rounded-lg">
          <div className="p-4 flex items-center justify-between">
            <div className="font-semibold text-lg">My Products</div>
            <div className="flex items-center gap-4">
              <div
                className="flex items-center gap-2 bg-green-500 font-semibold text-white p-2 rounded-lg shadow-md cursor-pointer duration-200 hover:bg-green-700"
                onClick={handleOpenModal}
              >
                <IoIosAdd size={24} />
                <div>Add New</div>
              </div>
              <div className="cursor-pointer">
                <IoReload size={20} />
              </div>
            </div>
          </div>
          <div>
            <div className="flex gap-3 text-sm justify-between px-4 pb-4">
              {myProduct.map((product, index) => (
                <div
                  key={index}
                  className="py-1 px-2 flex flex-col gap-2 w-1/4 text-gray-700 border border-gray-400 rounded-md shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <FcMultipleDevices size={24} />
                    </div>
                    <div>
                      <MdMoreVert size={18} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="font-semibold">{product.name}</div>
                    <div className="w-full bg-gray-200 rounded-full h-1 dark:bg-gray-700">
                      <div
                        className={`${product.color} h-1 rounded-full`}
                        style={{ width: product.progress }}
                      ></div>
                    </div>
                    <div className="flex gap-1 opacity-75">
                      <div className="text-xs">{product.quantity}</div>
                      <div className="text-xs">Product</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="bg-white rounded-lg p-4">
          <div className="font-semibold text-lg">All Products</div>
          <TableScreen data={data} />
        </section>
      </div>
      <div className="col-span-1 bg-white rounded-lg p-4 flex flex-col gap-6">
        <DonutChart />
      </div>

      <ModalAddProduct visible={isModalVisible} onClose={handleCloseModal} />
    </div>
  );
}
