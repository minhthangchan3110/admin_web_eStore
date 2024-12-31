import { Button, Form, Input, Modal, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ModalEditVariantType({
  visible,
  onClose,
  variantTypeId,
}) {
  const [form] = Form.useForm();
  const [variantTypeData, setVariantTypeData] = useState(null);

  useEffect(() => {
    if (variantTypeId) {
      const fetchVariantType = async () => {
        try {
          const variantTypeRes = await axios.get(
            `http://localhost:3000/varianttypes/${variantTypeId}`
          );
          setVariantTypeData(variantTypeRes.data.data); // Lưu dữ liệu variant type
          // Điền dữ liệu vào form
          form.setFieldsValue({
            name: variantTypeRes.data.data.name || "",
            type: variantTypeRes.data.data.type || "",
          });
        } catch (error) {
          console.error("Failed to fetch variant type:", error);
        }
      };
      fetchVariantType();
    }
  }, [variantTypeId, form]);

  const onFinish = async (values) => {
    try {
      console.log("Sending updated data:", values);

      const response = await axios.put(
        `http://localhost:3000/varianttypes/${variantTypeId}`,
        values // Gửi dữ liệu form cập nhật
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
      title="Edit Variant Type"
      visible={visible}
      className="font-montserrat"
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" className="pt-4" onFinish={onFinish}>
        <Form.Item
          name="name"
          rules={[
            { required: true, message: "Please enter the variant name!" },
          ]}
          className="w-full"
        >
          <Input
            className="font-montserrat p-2.5"
            placeholder="Enter variant name"
          />
        </Form.Item>
        <Form.Item
          name="type"
          rules={[
            { required: true, message: "Please enter the variant type!" },
          ]}
          className="w-full"
        >
          <Input
            className="font-montserrat p-2.5"
            placeholder="Enter variant type"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="font-montserrat">
            Update Variant Type
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
