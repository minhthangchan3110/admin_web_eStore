import { Button, Form, Modal } from "antd";
import axios from "axios";
import React, { useEffect } from "react";

export default function ModalEditOrder({ visible, orderId, onClose }) {
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchOrderData = async () => {
      if (orderId) {
        try {
          const orderRes = await axios.get(
            `http://localhost:3000/orders/${orderId}`
          );

          const orderData = orderRes.data.data; // Lấy dữ liệu đơn hàng

          // Thiết lập giá trị cho form
          form.setFieldsValue({
            userID: orderData.userID, // ID người dùng
            orderDate: orderData.orderDate,
            orderStatus: orderData.orderStatus,
            items: orderData.items,
            totalPrice: orderData.totalPrice,
            shippingAddress: orderData.shippingAddress,
            paymentMethod: orderData.paymentMethod,
            couponCode: orderData.couponCode,
            orderTotal: orderData.orderTotal,
          });

          console.log("Form values:", form.getFieldsValue()); // Kiểm tra dữ liệu đã set vào form
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu: ", error);
        }
      }
    };

    fetchOrderData();
  }, [orderId, form]);
  const onFinish = async (values) => {
    try {
      console.log("Sending updated data:", values);

      const response = await axios.put(
        `http://localhost:3000/orders/${orderId}`,
        { ...values, orderStatus: values.orderStatus } // Đảm bảo orderStatus được gửi
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
        <section className="font-montserrat flex justify-between">
          <div className="flex justify-start w-1/2">
            User ID:{" "}
            <span className="px-4 font-semibold">
              {form.getFieldValue("userID")?.name ||
                form.getFieldValue("userID")}
            </span>
          </div>
          <div className="flex justify-start w-1/2">
            Order Date:{" "}
            <span className="px-4 font-semibold">
              {new Date(form.getFieldValue("orderDate")).toLocaleString()}
            </span>
          </div>
        </section>
        <section className="border-2 border-black bg-slate-100 rounded-md p-4 font-montserrat flex flex-col gap-2">
          <h3 className=" font-semibold text-blue-500">Items</h3>
          <div>
            {form.getFieldValue("items")?.map((item, index) => (
              <div key={index} className="flex gap-8 font-semibold">
                <span>{item.productName}:</span>
                <span>
                  {item.quantity} x ${item.price}
                </span>
              </div>
            ))}
          </div>
          <div className="font-semibold flex gap-8">
            Total Price:{" "}
            <span className="text-green-500">
              ${form.getFieldValue("totalPrice")}
            </span>
          </div>
        </section>
        <section className="border-2 border-black bg-slate-100 rounded-md p-4 font-montserrat flex flex-col gap-2">
          <h3 className="font-semibold text-blue-500">Shipping Address</h3>
          <div className="flex gap-8 font-semibold">
            Phone: <span>{form.getFieldValue("shippingAddress")?.phone}</span>
          </div>
          <div className="flex gap-8 font-semibold">
            Address:{" "}
            <span>
              {form.getFieldValue("shippingAddress")?.street},{" "}
              {form.getFieldValue("shippingAddress")?.city},{" "}
              {form.getFieldValue("shippingAddress")?.state}{" "}
              {form.getFieldValue("shippingAddress")?.postalCode},{" "}
              {form.getFieldValue("shippingAddress")?.country}
            </span>
          </div>
        </section>
        <section className="border-2 border-black bg-slate-100 rounded-md p-4 font-montserrat flex flex-col gap-2">
          <h3 className="font-semibold text-blue-500">Payment Details</h3>
          <div className="gap-8 flex font-semibold">
            Payment Method: <span>{form.getFieldValue("paymentMethod")}</span>
          </div>
          <div className="gap-8 flex font-semibold">
            Code: <span>{form.getFieldValue("couponCode")}</span>
          </div>
          <div className="gap-8 flex font-semibold">
            Subtotal: <span>${form.getFieldValue("orderTotal")?.subtotal}</span>
          </div>
          <div className="gap-8 flex font-semibold">
            Discount: <span>${form.getFieldValue("orderTotal")?.discount}</span>
          </div>
          <div className="gap-8 flex font-semibold">
            Total:{" "}
            <span className="text-green-500">
              ${form.getFieldValue("orderTotal")?.total}
            </span>
          </div>
        </section>
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
