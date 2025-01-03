import { Button, Form, Input, Modal, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ModalAddVariants({ visible, onClose }) {
  const [form] = Form.useForm();
  const [variantType, setVariantType] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const variantTypesRes = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/variantTypes`
        );
        setVariantType(variantTypesRes.data.data);
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
        `${process.env.REACT_APP_API_BASE_URL}/variants`,
        values // Gửi dữ liệu dưới dạng đối tượng JSON
      );
      console.log("API Response:", response.data);
      message.success({
        content: (
          <span className="font-montserrat">Thêm danh mục thành công</span>
        ),
        className: "font-montserrat",
      });
      onClose(); // Đóng modal sau khi thêm thành công
      form.resetFields(); // Reset form sau khi submit thành công
    } catch (error) {
      console.error("API Error:", error);
      message.error({
        content: (
          <span className="font-montserrat">
            Thêm danh mục không thành công
          </span>
        ),
        className: "font-montserrat",
      });
    }
  };

  return (
    <Modal
      title="Add New Variant"
      visible={visible}
      className="font-montserrat"
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" className="pt-4" onFinish={onFinish}>
        <Form.Item name="variantTypeId" className="">
          <select
            id="variantTypeId"
            className="border font-montserrat border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">Select Variant Type</option>
            {variantType.map((variant) => (
              <option key={variant._id} value={variant._id}>
                {variant.name}
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
            placeholder="Enter variant name"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="font-montserrat">
            Add Variant Type {/* Thay đổi tên nút */}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
