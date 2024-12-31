import { Button, Form, Input, Modal, Upload, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

export default function ModalEditBrand({ visible, onClose, brandId }) {
  const [form] = Form.useForm();
  const [subCategories, setSubCategories] = useState([]);
  const [brandData, setBrandData] = useState(null);
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
    const fetchSubCategories = async () => {
      try {
        const subCategoriesRes = await axios.get(`${API_URL}/subcategories`);
        console.log("Subcategories Data:", subCategoriesRes.data); // Log dữ liệu để kiểm tra
        setSubCategories(subCategoriesRes.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu: ", error);
      }
    };

    fetchSubCategories();
  }, []);

  useEffect(() => {
    if (visible && brandId) {
      // Fetch existing brand details
      const fetchBrandData = async () => {
        try {
          const response = await axios.get(`${API_URL}/brands/${brandId}`);
          const { name, image, subcategoryId } = response.data.data;
          console.log("Fetched brand data:", response.data.data); // Log brand data

          // Set form fields
          form.setFieldsValue({
            name,
            subcategoryId: subcategoryId?._id || "",
          });

          // Set fileList only if image exists
          if (image) {
            setFileList([{ uid: "-1", url: image }]); // Cấu trúc cho Upload component
          } else {
            setFileList([]); // Nếu không có hình ảnh, đặt fileList thành mảng rỗng
          }
        } catch (error) {
          console.error("Error fetching brand data:", error);
        }
      };

      fetchBrandData();
    }
  }, [visible, brandId, form]);
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
  const onFinish = async (values) => {
    try {
      const formData = new FormData();

      // Kiểm tra và Cập nhật name vào formData
      if (values.name) {
        formData.append("name", values.name);
      } else {
        message.error({
          content: (
            <span className="font-montserrat">
              Cập nhật hãng không thành công
            </span>
          ),
          className: "font-montserrat",
        });
        return;
      }

      // Kiểm tra và Cập nhật subcategoryId vào formData
      if (values.subcategoryId) {
        formData.append("subcategoryId", values.subcategoryId);
      } else {
        message.error({
          content: (
            <span className="font-montserrat">
              Cập nhật hãng không thành công
            </span>
          ),
          className: "font-montserrat",
        });
        return;
      }

      // Kiểm tra và Cập nhật hình ảnh vào formData
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const file = fileList[0].originFileObj;
        formData.append("img", file);
      } else {
        // Nếu không có ảnh mới, lấy ảnh cũ từ server
        const response = await axios.get(`${API_URL}/brands/${brandId}`);
        const image = response.data.data.image;
        if (image) {
          formData.append("image", image);
        } else {
          message.error("Image is required!");
          return;
        }
      }

      // Log dữ liệu gửi đi để kiểm tra
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      // Gửi yêu cầu PUT
      await axios.put(`${API_URL}/brands/${brandId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      message.success({
        content: (
          <span className="font-montserrat">Cập nhật hãng thành công</span>
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
            Cập nhật hãng không thành công
          </span>
        ),
        className: "font-montserrat",
      });
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    // Kiểm tra trước khi thay đổi fileList (Kiểm tra kích thước, loại ảnh...)
    setFileList(newFileList);
  };
  return (
    <Modal
      title="Edit Brand Category"
      visible={visible}
      className="font-montserrat"
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        className="flex flex-col w-full pt-4 items-center"
        onFinish={onFinish}
      >
        <Form.Item>
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={() => false} // Ngừng upload tự động
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

        <Form.Item name="subcategoryId" className="w-full">
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
            Update Brand
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
