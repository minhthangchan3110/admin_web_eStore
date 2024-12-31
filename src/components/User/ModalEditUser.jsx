import { Button, Form, Input, Modal, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ModalEditUser({ visible, onClose, userId }) {
  const [form] = Form.useForm();
  const [userData, setUserData] = useState(null);
  const API_URL =
    process.env.NODE_ENV === "production"
      ? "https://admin-estore-l29q.onrender.com"
      : "http://localhost:3000";
  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const userRes = await axios.get(`${API_URL}/users/${userId}`);
          setUserData(userRes.data.data);
          form.setFieldsValue({
            userId: userRes.data.data._id || "",
            name: userRes.data.data.name || "",
            email: userRes.data.data.email || "",
            role: userRes.data.data.role || "",
          });
          console.log("Form values:", form.getFieldsValue());
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu: ", error);
        }
      };
      fetchUserData();
    }
  }, [userId, form]);

  const onFinish = async (values) => {
    try {
      console.log("Updating User ID:", userId);
      console.log("Sending updated data:", values);

      const response = await axios.put(`${API_URL}/users/${userId}`, values);
      console.log("API Response:", response.data);
      message.success({
        content: (
          <span className="font-montserrat">
            Cập nhật role người dùng thành công
          </span>
        ),
        className: "font-montserrat",
      });
      onClose();
      form.resetFields();
    } catch (error) {
      message.error({
        content: (
          <span className="font-montserrat">
            Cập nhật role người dùng không thành công
          </span>
        ),
        className: "font-montserrat",
      });
      console.error("API Error:", error);
    }
  };

  return (
    <Modal
      title="Edit User"
      visible={visible}
      className="font-montserrat"
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" className="pt-4" onFinish={onFinish}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please enter the user's name!" }]}
          className="w-full"
        >
          <Input
            disabled
            className="font-montserrat p-2.5"
            placeholder="Enter user's name"
          />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please enter the user's email!" },
          ]}
          className="w-full"
        >
          <Input
            disabled
            className="font-montserrat p-2.5"
            placeholder="Enter user's email"
          />
        </Form.Item>
        <Form.Item
          name="role"
          rules={[
            { required: true, message: "Please select the user's role!" },
          ]}
          className="w-full"
        >
          <select
            onChange={(e) => form.setFieldsValue({ role: e.target.value })}
            id="role"
            className="border font-montserrat border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="font-montserrat">
            Update User
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
