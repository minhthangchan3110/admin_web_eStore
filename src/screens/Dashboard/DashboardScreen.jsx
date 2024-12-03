import React, { useState } from "react";
import { FcMultipleDevices } from "react-icons/fc";
import { MdMoreVert } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { IoReload } from "react-icons/io5";
import TableScreen from "../../components/Dashboard/Table";
import DonutChart from "../../components/Dashboard/DonutChart";
import ModalAddProduct from "../../components/Dashboard/ModalAddProduct";

export default function DashboardScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const myProduct = [
    {
      name: "All Product",
      quantity: "18",
      color: "bg-blue-600",
      progress: "45%",
    },
    {
      name: "Out of Stock",
      quantity: "5",
      color: "bg-red-600",
      progress: "10%",
    },
    {
      name: "Limited Stock",
      quantity: "8",
      color: "bg-yellow-600",
      progress: "30%",
    },
    {
      name: "Other Stock",
      quantity: "18",
      color: "bg-green-600",
      progress: "75%",
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
          <TableScreen />
        </section>
      </div>
      <div className="col-span-1 bg-white rounded-lg p-4 flex flex-col gap-6">
        <DonutChart />
      </div>

      {/* Hiển thị Modal khi isModalVisible là true */}
      <ModalAddProduct visible={isModalVisible} onClose={handleCloseModal} />
    </div>
  );
}
