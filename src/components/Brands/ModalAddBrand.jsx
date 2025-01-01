import { Button, Form, Input, Modal, Upload, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

export default function ModalAddBrand({ visible, onClose }) {
  const [form] = Form.useForm();
  const [subCategories, setSubCategories] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const handleCancel = () => setPreviewVisible(false);

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    setPreviewImage(src);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleUploadChange = ({ fileList: newFileList }) =>
    setFileList(newFileList);
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
      const formData = new FormData();

      // Thêm các trường name và subcategoryId vào FormData
      formData.append("name", values.name);
      formData.append("subcategoryId", values.subcategoryId);

      // Thêm ảnh vào FormData nếu có
      if (fileList.length > 0) {
        const file = fileList[0];
        formData.append("img", file.originFileObj); // Tên trường là 'img'
      }

      // Log dữ liệu formData
      console.log("FormData:", formData);

      // Gửi dữ liệu lên API
      const response = await axios.post(
        "http://localhost:3000/brands",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Đảm bảo gửi dữ liệu dưới dạng multipart
          },
        }
      );
      console.log("API Response: ", response.data);
      message.success({
        content: <span className="font-montserrat">Thêm hãng thành công</span>,
        className: "font-montserrat",
      });
      onClose(); // Đóng modal sau khi thành công
      form.resetFields(); // Reset các trường trong form
    } catch (error) {
      message.error({
        content: (
          <span className="font-montserrat">Thêm hãng không thành công</span>
        ),
        className: "font-montserrat",
      });
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
      <Form
        form={form}
        layout="vertical"
        className="pt-4 flex flex-col items-center w-full"
        onFinish={onFinish}
      >
        <Form.Item>
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={() => false} // Chặn không cho tải ảnh tự động
            onChange={handleUploadChange}
            onPreview={onPreview}
            maxCount={1} // Chỉ cho phép tải lên 1 ảnh
          >
            {fileList.length < 1 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item name="subcategoryId" className="w-full">
          <select
            id="subcategoryId"
            className="border  font-montserrat border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="" className="">
              Select Sub Category
            </option>
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
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </Modal>
  );
}
