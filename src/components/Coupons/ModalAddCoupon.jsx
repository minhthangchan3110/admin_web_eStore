import React, { useEffect, useState } from "react";
import { Form, Input, Modal, DatePicker, Button, message } from "antd";
import axios from "axios";

export default function ModalAddCoupon({ visible, onClose }) {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, subCategoriesRes, productsRes] =
          await Promise.all([
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/categories`),
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/subcategories`),
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/products`),
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

  const onFinish = async (values) => {
    try {
      console.log("Sending data:", values);
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/couponcodes`,
        values
      );
      console.log("API Responsive: ", response.data);
      message.success({
        content: (
          <span className="font-montserrat">Thêm mã giảm giá thành công</span>
        ),
        className: "font-montserrat",
      });
      onClose();
      form.resetFields();
    } catch (error) {
      message.error({
        content: (
          <span className="font-montserrat">
            Thêm mã giảm giá không thành công
          </span>
        ),
        className: "font-montserrat",
      });
      console.error("API error", error);
    }
  };
  return (
    <Modal
      title="Add New Coupon Code"
      visible={visible}
      className=" font-montserrat "
      width="55%"
      onCancel={onClose}
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
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Form.Item>
          <Form.Item className="w-1/3" name="applicableSubCategory">
            <select className="border font-montserrat border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
              <option value="">Select subcategory</option>
              {subCategories.map((subCategory) => (
                <option key={subCategory._id} value={subCategory._id}>
                  {subCategory.name}
                </option>
              ))}
            </select>
          </Form.Item>
          <Form.Item className="w-1/3" name="applicableProduct">
            <select className="border font-montserrat border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
              <option value="">Select product</option>
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
            Add Coupon Code
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
