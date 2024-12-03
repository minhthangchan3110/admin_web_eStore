import { Button, Form, Input, Modal } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ModalAddSub({ visible, onClose }) {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await axios.get(
          "http://localhost:3000/categories"
        );
        setCategories(categoriesRes.data.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const onFinish = async (values) => {
    try {
      // Log dữ liệu gửi đi
      console.log("Sending data:", values);

      const response = await axios.post(
        "http://localhost:3000/subcategories",
        values // Gửi dữ liệu dưới dạng đối tượng JSON
      );
      console.log("API Response:", response.data);
      onClose(); // Đóng modal sau khi thêm thành công
      form.resetFields(); // Reset form sau khi submit thành công
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  return (
    <Modal
      title="Add New Sub Category"
      visible={visible}
      className="font-montserrat"
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" className="pt-4" onFinish={onFinish}>
        <Form.Item name="categoryId" className="">
          <select
            id="categoryId"
            className="border font-montserrat border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </Form.Item>
        <Form.Item
          name="name"
          rules={[
            { required: true, message: "Please enter the category name!" },
          ]}
          className="w-full"
        >
          <Input
            className="font-montserrat p-2.5"
            placeholder="Enter subcategory name"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="font-montserrat">
            Add Sub Category {/* Thay đổi tên nút */}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
