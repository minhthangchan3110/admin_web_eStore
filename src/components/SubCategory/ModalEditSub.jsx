import { Button, Form, Input, Modal, Select, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ModalEditSub({ visible, onClose, subCategoryId }) {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState(null); // State lưu trữ dữ liệu sub-category
  const API_URL =
    process.env.NODE_ENV === "production"
      ? "https://admin-estore-l29q.onrender.com"
      : "http://localhost:3000";
  // Fetch categories khi component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRes = await axios.get(`${API_URL}/categories`);
        setCategories(categoriesRes.data.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch sub-category bằng ID khi `subCategoryId` thay đổi
  useEffect(() => {
    if (subCategoryId) {
      const fetchSubCategory = async () => {
        try {
          const subCategoryRes = await axios.get(
            `${API_URL}/subcategories/${subCategoryId}`
          );
          setSubCategoryData(subCategoryRes.data.data); // Lưu dữ liệu sub-category
          // Điền dữ liệu vào form
          form.setFieldsValue({
            categoryId: subCategoryRes.data.data.categoryId?._id || "",
            name: subCategoryRes.data.data.name || "",
          });
        } catch (error) {
          console.error("Failed to fetch sub-category:", error);
        }
      };
      fetchSubCategory();
    }
  }, [subCategoryId, form]);

  // Hàm xử lý submit
  const onFinish = async (values) => {
    try {
      console.log("Sending updated data:", values);

      const response = await axios.put(
        `${API_URL}/subcategories/${subCategoryId}`,
        values
      );
      console.log("API Response:", response.data);
      message.success({
        content: (
          <span className="font-montserrat">Cập nhật danh mục thành công</span>
        ),
        className: "font-montserrat",
      });
      onClose();
      form.resetFields();
    } catch (error) {
      message.error({
        content: (
          <span className="font-montserrat">
            Cập nhật danh mục không thành công
          </span>
        ),
        className: "font-montserrat",
      });
      console.error("API Error:", error);
    }
  };

  return (
    <Modal
      title="Edit Sub Category"
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
            { required: true, message: "Please enter the subcategory name!" },
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
            Update Sub Category
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
