import { Button, Form, Modal } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ModalEditOrder({ visible, orderId, onClose }) {
  const [form] = Form.useForm();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      if (orderId) {
        try {
          const orderRes = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/orders/${orderId}`
          );

          const data = orderRes.data.data;
          setOrderData(data); // Lưu dữ liệu vào state

          // Thiết lập giá trị cho form
          form.setFieldsValue({
            userID: data.userID,
            orderDate: data.orderDate,
            orderStatus: data.orderStatus,
            items: data.items,
            totalPrice: data.totalPrice,
            shippingAddress: data.shippingAddress,
            paymentMethod: data.paymentMethod,
            couponCode: data.couponCode,
            orderTotal: data.orderTotal,
          });

          console.log("Form values:", form.getFieldsValue());
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu: ", error);
        }
      }
    };

    if (visible) {
      fetchOrderData();
    }
  }, [orderId, visible, form]);

  const onFinish = async (values) => {
    try {
      console.log("Sending updated data:", values);
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/orders/${orderId}`,
        { ...values, orderStatus: values.orderStatus }
      );
      console.log("API Response:", response.data);
      onClose();
      form.resetFields();
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  return (
    <Modal
      title="Order Details"
      visible={visible}
      className="font-montserrat"
      width="55%"
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} className="flex flex-col gap-4" onFinish={onFinish}>
        {orderData ? (
          <>
            <section className="font-montserrat flex">
              <div className="flex justify-start w-1/2">
                Order Date:{" "}
                <span className="px-4 font-semibold">
                  {new Date(orderData.orderDate).toLocaleString()}
                </span>
              </div>
            </section>
            <section className="border-2 border-black bg-slate-100 rounded-md p-4 font-montserrat flex flex-col gap-2">
              <h3 className="font-semibold text-blue-500">Items</h3>
              <div>
                {orderData.items?.map((item, index) => (
                  <div key={index} className="flex gap-8 font-semibold">
                    <span>{item.productName}:</span>
                    <span>
                      {item.quantity} x {item.price}₫
                    </span>
                  </div>
                ))}
              </div>
              <div className="font-semibold flex gap-8">
                Total Price:{" "}
                <span className="text-green-500">{orderData.totalPrice}₫</span>
              </div>
            </section>
            <section className="border-2 border-black bg-slate-100 rounded-md p-4 font-montserrat flex flex-col gap-2">
              <h3 className="font-semibold text-blue-500">Shipping Address</h3>
              <div className="flex gap-8 font-semibold">
                Full Name: <span>{orderData.shippingAddress?.fullName}</span>
              </div>
              <div className="flex gap-8 font-semibold">
                Phone: <span>{orderData.shippingAddress?.phone}</span>
              </div>
              <div className="flex gap-8 font-semibold">
                Address:{" "}
                <span>
                  {orderData.shippingAddress?.street},{" "}
                  {orderData.shippingAddress?.city},{" "}
                  {orderData.shippingAddress?.state}{" "}
                  {orderData.shippingAddress?.postalCode},{" "}
                  {orderData.shippingAddress?.country}
                </span>
              </div>
            </section>
            <section className="border-2 border-black bg-slate-100 rounded-md p-4 font-montserrat flex flex-col gap-2">
              <h3 className="font-semibold text-blue-500">Payment Details</h3>
              <div className="gap-8 flex font-semibold">
                Payment Method: <span>{orderData.paymentMethod}</span>
              </div>
              <div className="gap-8 flex font-semibold">
                Code: <span>{orderData.couponCode?.couponCode}</span>
              </div>
              <div className="gap-8 flex font-semibold">
                Subtotal: <span>{orderData.orderTotal?.subtotal}₫</span>
              </div>
              <div className="gap-8 flex font-semibold">
                Discount: <span>{orderData.orderTotal?.discount}₫</span>
              </div>
              <div className="gap-8 flex font-semibold">
                Total:{" "}
                <span className="text-green-500">
                  {orderData.orderTotal?.total}₫
                </span>
              </div>
            </section>
          </>
        ) : (
          <div>Loading...</div> // Thêm thông báo khi dữ liệu đang được tải
        )}

        <Form.Item
          name="orderStatus"
          rules={[{ required: true, message: "Order Status required." }]}
        >
          <select className="border font-montserrat border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="font-montserrat">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
