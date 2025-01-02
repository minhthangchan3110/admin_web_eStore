import { Button, Form, Input, Modal, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ModalEditCategory({ visible, onClose, categoryId }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const handleCancel = () => setPreviewVisible(false);

  useEffect(() => {
    if (visible && categoryId) {
      // Fetch existing category details
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/categories/${categoryId}`)
        .then((response) => {
          const { name, image } = response.data.data;
          console.log("Fetched category data:", response.data.data); // Log dữ liệu danh mục
          form.setFieldsValue({ name });

          // Thiết lập fileList chỉ khi có hình ảnh
          if (image) {
            setFileList([{ uid: "-1", url: image }]); // Cấu trúc cho Upload component
          } else {
            setFileList([]); // Nếu không có hình ảnh, đặt fileList thành mảng rỗng
          }
        })
        .catch((error) => {
          console.error("Error fetching category data:", error);
        });
    }
  }, [visible, categoryId, form]);

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
        formData.append("name", values.name);
      }

      let image;
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const file = fileList[0];
        formData.append("img", file.originFileObj);
      } else {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/categories/${categoryId}`
        );
        image = response.data.data.image;
        formData.append("image", image);
      }

      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/categories/${categoryId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success({
        content: (
          <span className="font-montserrat">Cập nhật danh mục thành công</span>
        ),
        className: "font-montserrat",
      });
      onClose();
    } catch (error) {
      console.error(
        "Error updating category:",
        error.response?.data || error.message
      );
      message.error({
        content: (
          <span className="font-montserrat">
            Cập nhật danh mục không thành công
          </span>
        ),
        className: "font-montserrat",
      });
    }
  };

  return (
    <Modal
      title="Edit Category"
      className="font-montserrat"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        name="edit_category"
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
            { required: true, message: "Please enter the category name!" },
          ]}
          className="w-full"
        >
          <Input
            className="font-montserrat p-2.5"
            placeholder="Enter category name"
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
