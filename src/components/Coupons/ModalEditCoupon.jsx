import { Button, DatePicker, Form, Input, Modal, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import moment from "moment"; // Import moment.js
export default function ModalEditCoupon({ visible, onClose, couponCodeId }) {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [couponCode, setCouponCode] = useState([]);
  const API_URL =
    process.env.NODE_ENV === "production"
      ? "https://admin-estore-l29q.onrender.com"
      : "http://localhost:3000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, subCategoriesRes, productsRes] =
          await Promise.all([
            axios.get(`${API_URL}/categories`),
            axios.get(`${API_URL}/subcategories`),
            axios.get(`${API_URL}/products`),
          ]);
        setCategories(categoriesRes.data.data);
        setSubCategories(subCategoriesRes.data.data);
        setProducts(productsRes.data.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (couponCodeId) {
      const fetchCouponCodeData = async () => {
        try {
          const couponCodeRes = await axios.get(
            `${API_URL}/couponcodes/${couponCodeId}`
          );

          const couponData = couponCodeRes.data.data; // Lấy dữ liệu coupon

          // Thiết lập giá trị cho form
          form.setFieldsValue({
            id: couponData._id || "",
            couponCode: couponData.couponCode || "",
            discountType: couponData.discountType || "",
            discountAmount: couponData.discountAmount || "",
            minimumPurchaseAmount: couponData.minimumPurchaseAmount || "",
            status: couponData.status || "",
            endDate: couponData.endDate ? moment(couponData.endDate) : null,
            applicableCategory: couponData.applicableCategory
              ? couponData.applicableCategory._id
              : null, // Hoặc "" nếu bạn muốn
            applicableSubCategory: couponData.applicableSubCategory
              ? couponData.applicableSubCategory._id
              : null,
            applicableProduct: couponData.applicableProduct
              ? couponData.applicableProduct._id
              : null, // Kiểm tra có tồn tại hay không
          });

          console.log("Form values:", form.getFieldsValue()); // Kiểm tra dữ liệu đã set vào form
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu: ", error);
        }
      };

      fetchCouponCodeData();
    }
  }, [couponCodeId, form]);

  const onFinish = async (values) => {
    const updatedValues = {
      ...values,
      applicableCategory:
        values.applicableCategory === "Select category"
          ? null
          : values.applicableCategory,
      applicableSubCategory:
        values.applicableSubCategory === "Select subcategory"
          ? null
          : values.applicableSubCategory,
      applicableProduct:
        values.applicableProduct === "Select product"
          ? null
          : values.applicableProduct,
    };
    try {
      console.log("Sending data:", updatedValues);
      const response = await axios.put(
        `${API_URL}/couponcodes/${couponCodeId}`, // Sửa URL nếu cần dùng edit
        updatedValues
      );
      console.log("API Responsive: ", response.data);
      message.success({
        content: (
          <span className="font-montserrat">
            Cập nhật mã giảm giá thành công
          </span>
        ),
        className: "font-montserrat",
      });
      onClose();
      form.resetFields();
    } catch (error) {
      message.error({
        content: (
          <span className="font-montserrat">
            Cập nhật mã giảm giá không thành công
          </span>
        ),
        className: "font-montserrat",
      });
      console.error("API error", error);
    }
  };

  return (
    <Modal
      title="Edit Coupon Code"
      visible={visible}
      className="font-montserrat"
      width="55%"
      onCancel={onClose} // Sử dụng đúng hàm onClose từ props
      footer={null}
    >
      <Form form={form} layout="vertical" className="pt-4" onFinish={onFinish}>
        <Form.Item
          className=""
          name="couponCode"
          rules={[{ required: true, message: "Please input the coupon code!" }]}
        >
          <Input placeholder="Coupon Code" className="font-montserrat p-2" />
        </Form.Item>
        <div className="flex w-full gap-2">
          <Form.Item
            className="w-1/2 "
            name="discountAmount"
            rules={[
              { required: true, message: "Please input the discount amount!" },
            ]}
          >
            <Input
              placeholder="Discount Amount"
              className="font-montserrat p-2"
            />
          </Form.Item>
          <Form.Item className="w-1/2 " name="minimumPurchaseAmount">
            <Input
              placeholder="Minimum Purchase Amount"
              className="font-montserrat p-2"
            />
          </Form.Item>
        </div>
        <div className="flex w-full gap-2">
          <Form.Item
            name="discountType"
            className="w-1/2"
            rules={[
              { required: true, message: "Please select a discount type!" },
            ]}
          >
            <select className="border font-montserrat border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
              <option value="">Select Discount Type</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
          </Form.Item>
          <Form.Item
            name="status"
            className="w-1/2"
            rules={[{ required: true, message: "Please select the status!" }]}
          >
            <select className="border font-montserrat border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Form.Item>
        </div>
        <div className="flex w-full gap-2">
          {/* Thêm phần chọn ngày tháng */}
          <Form.Item
            name="endDate"
            className="w-full"
            rules={[{ required: true, message: "Please select an end date!" }]}
          >
            <DatePicker
              className="w-full font-montserrat p-2"
              placeholder="Select End Date"
            />
          </Form.Item>
        </div>

        <div className="w-full flex gap-2">
          <Form.Item className="w-1/3" name="applicableCategory">
            <select className="border font-montserrat border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
              <option value={null}>Select category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Form.Item>
          <Form.Item className="w-1/3" name="applicableSubCategory">
            <select className="border font-montserrat border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
              <option>Select subcategory</option>
              {subCategories.map((subCategory) => (
                <option key={subCategory._id} value={subCategory._id}>
                  {subCategory.name}
                </option>
              ))}
            </select>
          </Form.Item>
          <Form.Item className="w-1/3" name="applicableProduct">
            <select className="border font-montserrat border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
              <option>Select product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </Form.Item>
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="font-montserrat">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
