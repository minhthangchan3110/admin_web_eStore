import { Button, Form, Input, Modal, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ModalEditPoster({ visible, onClose, posterId }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const handleCancel = () => setPreviewVisible(false);
  const API_URL =
    process.env.NODE_ENV === "production"
      ? "https://admin-estore-l29q.onrender.com"
      : "http://localhost:3000";
  useEffect(() => {
    if (visible && posterId) {
      // Fetch existing poster details
      axios
        .get(`${API_URL}/posters/${posterId}`)
        .then((response) => {
          const { posterName, imageUrl } = response.data.data; // Sửa đổi ở đây
          console.log("Fetched poster data:", response.data.data);
          form.setFieldsValue({ name: posterName }); // Sửa đổi ở đây

          // Set fileList only if there is an image
          if (imageUrl) {
            setFileList([{ uid: "-1", url: imageUrl }]); // Adjust for Upload component structure
          } else {
            setFileList([]); // Clear fileList if no image
          }
        })
        .catch((error) => {
          console.error("Error fetching poster data:", error);
        });
    }
  }, [visible, posterId, form]);

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

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      if (values.name) {
        formData.append("posterName", values.name); // Sửa đổi ở đây
      }

      let imageUrl;
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const file = fileList[0];
        formData.append("img", file.originFileObj); // Tên trường 'img' phải giống như trong backend
      } else {
        // Nếu không có ảnh mới, lấy ảnh cũ
        const response = await axios.get(`${API_URL}/posters/${posterId}`);
        imageUrl = response.data.data.imageUrl; // Sửa đổi ở đây
        formData.append("image", imageUrl); // Sửa đổi ở đây
      }

      await axios.put(`${API_URL}/posters/${posterId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      message.success({
        content: (
          <span className="font-montserrat">Cập nhật poster thành công</span>
        ),
        className: "font-montserrat",
      }); // Sửa thông báo cho đúng ngữ cảnh

      onClose();
    } catch (error) {
      console.error(
        "Error updating poster:",
        error.response?.data || error.message
      );
      message.error({
        content: (
          <span className="font-montserrat">
            Cập nhật poster không thành công
          </span>
        ),
        className: "font-montserrat",
      }); // Sửa thông báo cho đúng ngữ cảnh
    }
  };

  return (
    <Modal
      title="Edit Poster"
      className="font-montserrat"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        name="edit_poster" // Sửa đổi ở đây
        layout="vertical"
        className="pt-4 flex flex-col items-center w-full"
        onFinish={handleSubmit}
      >
        <Form.Item>
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleUploadChange}
            onPreview={onPreview}
            maxCount={1}
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
          name="name"
          rules={[
            { required: true, message: "Please enter the poster name!" }, // Sửa thông báo cho đúng ngữ cảnh
          ]}
          className="w-full"
        >
          <Input
            className="font-montserrat p-2.5"
            placeholder="Enter poster name" // Sửa thông báo cho đúng ngữ cảnh
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="font-montserrat">
            Save
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
