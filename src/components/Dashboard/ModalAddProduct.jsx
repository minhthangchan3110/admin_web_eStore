import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Upload, Select } from "antd";
import ImgCrop from "antd-img-crop";
import axios from "axios";
const { TextArea } = Input;

export default function ModalAddProduct({ visible, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [variantTypes, setVariantTypes] = useState([]);
  const [variants, setVariants] = useState([]);
  const [filteredVariants, setFilteredVariants] = useState([]);
  const [selectedVariantType, setSelectedVariantType] = useState("");
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setFilteredSubCategories(
      subCategories.filter((sub) => sub.categoryId === value)
    );
    setSelectedSubCategory(null); // reset subCategory khi thay đổi category
    setFilteredBrands([]); // reset brands
  };

  // Khi subCategory thay đổi, lọc lại brands
  const handleSubCategoryChange = (value) => {
    setSelectedSubCategory(value);
    setFilteredBrands(brands.filter((brand) => brand.subCategoryId === value));
  };
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

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

  const handleCancel = () => setPreviewVisible(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          categoriesRes,
          subCategoriesRes,
          brandsRes,
          variantTypesRes,
          variantsRes,
        ] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/categories`),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/subCategories`),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/brands`),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/variantTypes`),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/variants`),
        ]);

        setCategories(categoriesRes.data.data);
        setSubCategories(subCategoriesRes.data.data);
        setBrands(brandsRes.data.data);
        setVariantTypes(variantTypesRes.data.data);
        setVariants(variantsRes.data.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, []);

  const handleVariantTypeChange = (value) => {
    setSelectedVariantType(value);
    const filtered = variants.filter(
      (variant) => variant.variantTypeId._id === value
    );
    setFilteredVariants(filtered);
  };

  const onFinish = async (values) => {
    try {
      const formData = new FormData();

      // Append files to formData with proper field names
      fileList.forEach((file, index) => {
        formData.append(`image${index + 1}`, file.originFileObj);
      });

      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("offerPrice", values.offerPrice);
      formData.append("quantity", values.quantity);
      formData.append("proCategoryId", values.proCategoryId);
      formData.append("proSubCategoryId", values.proSubCategoryId);
      formData.append("proBrandId", values.proBrandId);

      // Only append variant type if it is not null
      if (values.proVariantTypeId) {
        formData.append("proVariantTypeId", values.proVariantTypeId);
      }

      formData.append("specifications", values.specifications);

      // Only append variant names if selected variants are not null
      if (values.proVariantId && values.proVariantId.length > 0) {
        const selectedVariants = filteredVariants.filter((variant) =>
          values.proVariantId.includes(variant._id)
        );
        selectedVariants.forEach((variant, index) => {
          formData.append(`variantName${index + 1}`, variant.name);
        });

        formData.append("proVariantId", values.proVariantId);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/products`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API Response:", response.data);
      onClose();
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  return (
    <Modal
      title="Add Product"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width="75%"
      className="font-montserrat "
    >
      <Form
        name="add_product"
        layout="vertical"
        onFinish={onFinish}
        className="font-montserrat"
      >
        <Form.Item>
          <ImgCrop rotationSlider>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
              customRequest={({ file, onSuccess }) => {
                onSuccess();
              }}
            >
              {fileList.length < 5 && "+ Upload"}
            </Upload>
          </ImgCrop>
        </Form.Item>

        <Form.Item
          name="name"
          rules={[
            { required: true, message: "Please input the product name!" },
          ]}
        >
          <Input className="font-montserrat p-2" placeholder="Product Name" />
        </Form.Item>

        <Form.Item
          name="description"
          rules={[
            {
              required: true,
              message: "Please input the product description!",
            },
          ]}
        >
          <TextArea
            rows={4}
            className="font-montserrat p-2"
            placeholder="Product Description"
          />
        </Form.Item>

        <Form.Item
          name="specifications"
          rules={[
            {
              required: true,
              message: "Please input the product specifications!",
            },
          ]}
        >
          <TextArea
            rows={4}
            className="font-montserrat p-2"
            placeholder="Product Specifications"
          />
        </Form.Item>

        <div className="flex justify-between gap-2 font-montserrat">
          <Form.Item name="proCategoryId" className="w-1/3">
            <select
              id="proCategoryId"
              className="border font-montserrat border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Form.Item>
          <Form.Item name="proBrandId" className="w-1/3">
            <select
              id="proBrandId"
              className="border font-montserrat border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              disabled={!selectedSubCategory}
            >
              <option value="">Select Brand</option>
              {filteredBrands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </Form.Item>
          <Form.Item name="proBrandId" className="w-1/3">
            <select
              id="proBrandId"
              className="border font-montserrat border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </Form.Item>
        </div>

        <div className="flex gap-2">
          <Form.Item
            className="w-1/3"
            name="price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <Input className="font-montserrat p-2" placeholder="Price" />
          </Form.Item>
          <Form.Item
            name="offerPrice"
            className="w-1/3"
            rules={[
              { required: true, message: "Please input the offer price!" },
            ]}
          >
            <Input className="font-montserrat p-2" placeholder="Offer Price" />
          </Form.Item>
          <Form.Item
            name="quantity"
            className="w-1/3"
            rules={[{ required: true, message: "Please input the quantity!" }]}
          >
            <Input className="font-montserrat p-2" placeholder="Quantity" />
          </Form.Item>
        </div>

        <div className="flex justify-between gap-2">
          <Form.Item name="proVariantTypeId" className="w-1/2">
            <select
              onChange={(e) => handleVariantTypeChange(e.target.value)}
              id="proVariantTypeId"
              className="border font-montserrat border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value="">Select Variant Type</option>
              {variantTypes.map((variantType) => (
                <option key={variantType._id} value={variantType._id}>
                  {variantType.name}
                </option>
              ))}
            </select>
          </Form.Item>
          <Form.Item name="proVariantId" className="w-1/2">
            <Select
              mode="multiple"
              placeholder="Select Variant"
              className="w-full font-montserrat"
              style={{ height: "40px", borderRadius: "8px" }}
              options={filteredVariants.map((variant) => ({
                value: variant._id,
                label: variant.name,
              }))}
            />
          </Form.Item>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="font-montserrat">
            Add Product
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
