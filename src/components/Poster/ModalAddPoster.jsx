import { Button, Form, Input, Modal, Upload, message } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

export default function ModalAddPoster({ visible, onClose }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const API_URL =
    process.env.NODE_ENV === "production"
      ? "https://admin-estore-l29q.onrender.com"
      : "http://localhost:3000";
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

  const onFinish = async (values) => {
    try {
      const formData = new FormData();

      // Gửi file ảnh với key là 'img' để khớp với backend
      if (fileList.length > 0) {
        const file = fileList[0];
        formData.append("img", file.originFileObj); // Tên trường là 'img'
      }

      formData.append("posterName", values.posterName); // Gửi tên danh mục

      const response = await axios.post(
        `${API_URL}/posters`, // Đường dẫn API
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API Response:", response.data);
      onClose(); // Đóng modal sau khi thêm thành công
      message.success({
        content: (
          <span className="font-montserrat">Thêm danh mục thành công</span>
        ),
        className: "font-montserrat",
      });
      form.resetFields(); // Reset form sau khi submit thành công
      setFileList([]); // Reset danh sách file sau khi submit thành công
    } catch (error) {
      message.error({
        content: (
          <span className="font-montserrat">
            Thêm danh mục không thành công
          </span>
        ),
        className: "font-montserrat",
      });
      console.error("API Error:", error);
    }
  };

  return (
    <Modal
      title="Add New Poster"
      visible={visible}
      className="text-center font-montserrat"
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish} // Thêm sự kiện onFinish để xử lý submit form
        className="pt-4 flex flex-col items-center w-full"
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
        <Form.Item
          name="posterName"
          rules={[{ required: true, message: "Please enter title poster!" }]}
          className="w-full"
        >
          <Input
            className="font-montserrat p-2.5"
            placeholder="Enter poster title"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="font-montserrat">
            Add Poster {/* Thay đổi tên nút */}
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
