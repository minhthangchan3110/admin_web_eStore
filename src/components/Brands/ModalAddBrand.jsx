import { Button, Form, Input, Modal } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ModalAddBrand({ visible, onClose }) {
  const [form] = Form.useForm();
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subcategoriesRes = await axios.get(
          "http://localhost:3000/subcategories"
        );
        setSubCategories(subcategoriesRes.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu");
      }
    };
    fetchData();
  }, []);

  const onFinish = async (values) => {
    try {
      console.log("Sending data:", values);
      const response = await axios.post("http://localhost:3000/brands", values);
      console.log("API Responsive: ", response.data);
      onClose();
      form.resetFields();
    } catch (error) {
      console.error("API error", error);
    }
  };

  
  return (
    <Modal
      title="Add New Brand"
      visible={visible}
      className="font-montserrat"
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" className="pt-4" onFinish={onFinish}>
        <Form.Item name="subcategoryId" className="">
          <select
            id="subcategoryId"
            className="border font-montserrat border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">Select Sub Category</option>
            {subCategories.map((subCategory) => (
              <option key={subCategory._id} value={subCategory._id}>
                {subCategory.name}
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
            placeholder="Enter brand name"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="font-montserrat">
            Add Brand {/* Thay đổi tên nút */}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
