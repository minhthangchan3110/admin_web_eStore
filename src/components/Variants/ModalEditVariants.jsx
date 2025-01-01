import { Button, Form, Input, Modal, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ModalEditVariants({ visible, onClose, variantId }) {
  const [form] = Form.useForm();
  const [variantType, setVariantType] = useState([]);
  const [variantData, setVariantData] = useState([]);
  useEffect(() => {
    const fetchVariantsType = async () => {
      try {
        const variantsTypeRes = await axios.get(
          "http://localhost:3000/varianttypes"
        );
        setVariantType(variantsTypeRes.data.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchVariantsType();
  }, []);
  useEffect(() => {
    if (variantId) {
      const fetchSubCategory = async () => {
        try {
          const variantsRes = await axios.get(
            `http://localhost:3000/variants/${variantId}`
          );
          setVariantData(variantsRes.data.data);
          form.setFieldsValue({
            variantTypeId: variantsRes.data.data.variantTypeId?._id || "",
            name: variantsRes.data.data.name || "",
          });
        } catch (error) {
          console.error("Failed to fetch sub-category:", error);
        }
      };
      fetchSubCategory();
    }
  }, [variantId, form]);
  const onFinish = async (values) => {
    try {
      console.log("Sending updated data:", values);

      const response = await axios.put(
        `http://localhost:3000/variants/${variantId}`,
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
      title="Edit Variant"
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
            {variantType.map((variantType) => (
              <option key={variantType._id} value={variantType._id}>
                {variantType.name}
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
            placeholder="Enter variant name"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="font-montserrat">
            Update Variant
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
