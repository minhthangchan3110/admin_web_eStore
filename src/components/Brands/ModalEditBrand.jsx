import { Button, Form, Input, Modal } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ModalEditBrand({ visible, onClose, brandId }) {
  const [form] = Form.useForm();
  const [subCategories, setSubCategories] = useState([]);
  const [brandData, setBrandData] = useState(null);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const subCategoriesRes = await axios.get(
          "http://localhost:3000/subcategories"
        );
        console.log("Subcategories Data:", subCategoriesRes.data); // Log dữ liệu để kiểm tra
        setSubCategories(subCategoriesRes.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu: ", error);
      }
    };

    fetchSubCategories();
  }, []);

  useEffect(() => {
    if (brandId) {
      const fetchBrandData = async () => {
        try {
          const brandRes = await axios.get(
            `http://localhost:3000/brands/${brandId}`
          );
          setBrandData(brandRes.data.data);
          form.setFieldsValue({
            subcategoryId: brandRes.data.data.subcategoryId?._id || "",
            name: brandRes.data.data.name || "",
          });
          console.log("Form values:", form.getFieldsValue()); // Kiểm tra dữ liệu đã set vào form
        } catch (error) {
          console.error("L��i khi lấy dữ liệu: ", error);
        }
      };
      fetchBrandData();
    }
  }, [brandId, form]);

  const onFinish = async (values) => {
    try {
      console.log("Sending updated data:", values);

      const response = await axios.put(
        `http://localhost:3000/brands/${brandId}`,
        values
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
      title="Edit Brand Category"
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
            {subCategories.length > 0 &&
              subCategories.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
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
