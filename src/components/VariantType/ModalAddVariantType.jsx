import { Button, Form, Input, Modal } from "antd";
import axios from "axios";
import React from "react";

export default function ModalAddVariantType({ visible, onClose }) {
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    try {
      // Log dữ liệu gửi đi
      console.log("Sending data:", values);

      const response = await axios.post(
        "http://localhost:3000/varianttypes",
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
      title="Add New Variant Types"
      visible={visible}
      className=" font-montserrat"
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" className="pt-4" onFinish={onFinish}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please enter the variant name" }]}
          className="w-full"
        >
          <Input
            className=" font-montserrat p-2.5"
            placeholder="Enter Variant Name"
          />
        </Form.Item>
        <Form.Item
          name="type"
          rules={[{ required: true, message: "Please enter the variant type" }]}
          className="w-full"
        >
          <Input
            className=" font-montserrat p-2.5"
            placeholder="Enter Variant Type"
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
