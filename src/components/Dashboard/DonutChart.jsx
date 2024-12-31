import React, { useEffect, useState } from "react";
import { FaShippingFast } from "react-icons/fa";
import axios from "axios";

export default function DonutChart() {
  const [orderData, setOrderData] = useState([]);

  const orderStatuses = [
    { name: "Pending Orders", color: "#f59e0b" },
    { name: "Processed Orders", color: "#10b981" },
    { name: "Cancelled Orders", color: "#ef4444" },
    { name: "Shipped Orders", color: "#6366f1" },
    { name: "Delivered Orders", color: "#9333ea" },
  ];
  const API_URL =
    process.env.NODE_ENV === "production"
      ? "https://admin-estore-l29q.onrender.com"
      : "http://localhost:3000";
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/orders`); // Địa chỉ API của bạn
        if (response.data.success) {
          // Lấy dữ liệu trạng thái đơn hàng từ API
          const orders = response.data.data;
          const orderCount = {};

          // Đếm số lượng đơn hàng theo trạng thái
          orders.forEach((order) => {
            const status = order.orderStatus;
            orderCount[status] = (orderCount[status] || 0) + 1; // Tăng số lượng trạng thái tương ứng
          });

          // Tạo mảng trạng thái với số lượng đã đếm
          const updatedOrderData = orderStatuses.map((status) => ({
            name: status.name,
            quantity:
              orderCount[status.name.replace(" Orders", "").toLowerCase()] || 0,
            color: status.color,
          }));

          setOrderData(updatedOrderData);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Tính tổng tất cả các đơn hàng
  const totalQuantity = orderData.reduce((sum, item) => sum + item.quantity, 0);

  // Hàm tạo gradient cho biểu đồ dựa trên dữ liệu đơn hàng
  const createConicGradient = () => {
    let cumulativeValue = 0;
    return orderData
      .map((item) => {
        const start = (cumulativeValue / totalQuantity) * 100;
        const end = ((cumulativeValue + item.quantity) / totalQuantity) * 100;
        cumulativeValue += item.quantity;
        return `${item.color} ${start}% ${end}%`;
      })
      .join(", ");
  };

  return (
    <div className="flex items-center justify-center flex-col gap-6">
      <div className="font-semibold text-lg">Orders Details</div>
      <div className="relative w-48 h-48 rounded-full bg-white">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(${createConicGradient()})`,
          }}
        ></div>

        <div className="absolute inset-6 bg-white rounded-full flex items-center justify-center">
          <div className="text-[36px] font-bold">{totalQuantity}</div>
        </div>
      </div>
      <section className="w-full">
        <div className="flex flex-col item-start w-full space-y-2">
          {orderData.map((item, index) => (
            <div
              key={index}
              className="border flex px-2 py-4 gap-4 items-center rounded-lg text-xs font-medium"
            >
              <div className="">
                <FaShippingFast size={20} color={item.color} />
              </div>
              <div>
                <div className="font-semibold text-[14px]">{item.name}</div>
                <div className="flex gap-1 font-semibold opacity-80">
                  <div className="">{item.quantity}</div>
                  <div>Orders</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
