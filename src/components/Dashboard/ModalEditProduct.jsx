import { Form, Modal, Input, Button, message, Upload, Select } from "antd";
import ImgCrop from "antd-img-crop";
import axios from "axios";
import React, { useEffect, useState } from "react";

const { TextArea } = Input;
const { Option } = Select;

export default function ModalEditProduct({ visible, onClose, productId }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [variantTypes, setVariantTypes] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedVariantType, setSelectedVariantType] = useState("");
  const [filteredVariants, setFilteredVariants] = useState([]);
  const [productVariants, setProductVariants] = useState([]);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const API_URL =
    process.env.NODE_ENV === "production"
      ? "https://admin-estore-l29q.onrender.com"
      : "http://localhost:3000";
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const imgWindow = window.open(src);
    imgWindow.document.write('<img src="' + src + '" />');
  };

  useEffect(() => {
    const fetchVariantsAndProduct = async () => {
      try {
        const variantsResponse = await axios.get(`${API_URL}/variants`);
        const variantsData = variantsResponse.data.data;
        setVariants(variantsData);

        if (productId) {
          const productResponse = await axios.get(
            `${API_URL}/products/${productId}`
          );
          const productData = productResponse.data.data;

          let productVariantIds = [];
          try {
            const proVariantId = productData.proVariantId[0];
            if (proVariantId.startsWith("[")) {
              productVariantIds = JSON.parse(proVariantId);
              if (!Array.isArray(productVariantIds)) {
                throw new Error("Invalid format for proVariantId");
              }
            } else {
              productVariantIds = proVariantId.split(",");
            }
          } catch (e) {
            console.error("Failed to parse proVariantId:", e);
            productVariantIds = [];
          }

          const productVariantsWithNames = variantsData
            .filter((variant) => productVariantIds.includes(variant._id))
            .map((variant) => ({
              id: variant._id,
              name: variant.name,
            }));

          setProductVariants(productVariantsWithNames);
          const formattedSpecifications = productData.specifications
            ? Object.entries(productData.specifications)
                .map(([key, value]) => `${key}: ${value}`)
                .join("\n") // Nối các cặp khóa-giá trị với dấu xuống dòng
            : "";
          form.setFieldsValue({
            name: productData.name,
            description: productData.description,
            price: productData.price,
            offerPrice: productData.offerPrice,
            quantity: productData.quantity,
            proCategoryId: productData.proCategoryId?._id || null,
            proSubCategoryId: productData.proSubCategoryId?._id || null,
            proBrandId: productData.proBrandId?._id || null,
            proVariantTypeId: productData.proVariantTypeId?._id || null,
            proVariantId: productVariantsWithNames.map(
              (variant) => variant.name
            ),
            images: productData.images.map((image) => ({
              uid: image._id,
              name: `image-${image._id}`,
              status: "done",
              url: image.url,
            })),
            specifications: formattedSpecifications, // Assuming specifications are part of productData
          });

          setFileList(
            productData.images.map((image, index) => ({
              uid: image._id,
              name: `image-${index}`,
              status: "done",
              url: image.url,
            }))
          );
        }
      } catch (error) {
        console.error(error);
        message.error(
          "Không thể lấy thông tin sản phẩm hoặc danh sách biến thể"
        );
      }
    };

    fetchVariantsAndProduct();
  }, [productId, form]);

  const fetchDropdownData = async () => {
    try {
      const [
        categoriesResponse,
        subCategoriesResponse,
        brandsResponse,
        variantTypesResponse,
      ] = await Promise.all([
        axios.get(`${API_URL}/categories`),
        axios.get(`${API_URL}/subCategories`),
        axios.get(`${API_URL}/brands`),
        axios.get(`${API_URL}/variantTypes`),
      ]);
      setCategories(categoriesResponse.data.data);
      setSubcategories(subCategoriesResponse.data.data);
      setBrands(brandsResponse.data.data);
      setVariantTypes(variantTypesResponse.data.data);
    } catch (error) {
      message.error("Không thể lấy dữ liệu dropdown");
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("offerPrice", values.offerPrice);
      formData.append("quantity", values.quantity);
      formData.append("proCategoryId", values.proCategoryId);
      formData.append("proSubCategoryId", values.proSubCategoryId);
      formData.append("proBrandId", values.proBrandId);
      formData.append("proVariantTypeId", values.proVariantTypeId);

      // Kiểm tra và thêm 'specifications' vào formData nếu có
      if (values.specifications && values.specifications.trim() !== "") {
        formData.append("specifications", values.specifications);
      } else {
        formData.append("specifications", ""); // Nếu không có, để giá trị mặc định là chuỗi rỗng
      }

      formData.append(
        "proVariantId",
        JSON.stringify(
          values.proVariantId.map((name) => {
            const variant = variants.find((v) => v.name === name);
            return variant ? variant._id : null; // Sử dụng _id thay vì name
          })
        )
      );

      fileList.forEach((file, index) => {
        formData.append(`image${index + 1}`, file.originFileObj);
      });

      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      await axios.put(`${API_URL}/products/${productId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      message.success("Cập nhật sản phẩm thành công");
      onClose();
    } catch (error) {
      console.error("Error:", error);
      message.error("Cập nhật sản phẩm thất bại");
    }
  };

  const handleVariantTypeChange = (value) => {
    setSelectedVariantType(value);
    const filtered = variants.filter(
      (variant) => variant.variantTypeId._id === value
    );
    setFilteredVariants(filtered);

    const currentSelectedVariants = form.getFieldValue("proVariantId") || [];
    const validSelectedVariants = currentSelectedVariants.filter((name) =>
      filtered.some((variant) => variant.name === name)
    );

    form.setFieldsValue({
      proVariantId: validSelectedVariants,
    });
  };
  return (
    <Modal
      title="Edit Product"
      className=" font-montserrat"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width="75%"
    >
      <Form
        form={form}
        name="edit_product"
        layout="vertical"
        onFinish={handleSubmit}
        className="font-montserrat"
      >
        <Form.Item>
          <ImgCrop rotationSlider>
            <Upload
              className=" font-montserrat"
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
          label={<span className=" font-montserrat">Name</span>}
        >
          <Input className="font-montserrat" placeholder="Product Name" />
        </Form.Item>

        <Form.Item
          name="description"
          label={<span className=" font-montserrat">Description</span>}
        >
          <TextArea
            className=" font-montserrat"
            rows={4}
            placeholder="Product Description"
          />
        </Form.Item>
        <Form.Item
          name="specifications"
          label={<span className="font-montserrat">Specifications</span>}
        >
          <TextArea
            className="font-montserrat"
            rows={4}
            placeholder="Product Specifications"
          />
        </Form.Item>

        <div className="flex w-full justify-between gap-2">
          <Form.Item
            className="w-1/3"
            name="proCategoryId"
            label={<span className=" font-montserrat">Category</span>}
          >
            <Select placeholder="Select Category" className=" font-montserrat">
              {categories.map((category) => (
                <Option
                  key={category._id}
                  className=" font-montserrat"
                  value={category._id}
                >
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            className="w-1/3"
            name="proSubCategoryId"
            label={<span className=" font-montserrat">Subcategory</span>}
            rules={[
              { required: true, message: "Please select a subcategory!" },
            ]}
          >
            <Select
              placeholder="Select Subcategory"
              className=" font-montserrat"
            >
              {subcategories.map((subcategory) => (
                <Option
                  className=" font-montserrat"
                  key={subcategory._id}
                  value={subcategory._id}
                >
                  {subcategory.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            className="w-1/3"
            name="proBrandId"
            label={<span className=" font-montserrat">Brand</span>}
            rules={[{ required: true, message: "Please select a brand!" }]}
          >
            <Select placeholder="Select Brand" className=" font-montserrat">
              {brands.map((brand) => (
                <Option
                  className="font-montserrat"
                  key={brand._id}
                  value={brand._id}
                >
                  {brand.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div className="flex w-full justify-between gap-2">
          <Form.Item
            className="w-1/3"
            name="price"
            label={<span className=" font-montserrat">Price</span>}
          >
            <Input className=" font-montserrat" placeholder="Price" />
          </Form.Item>

          <Form.Item
            className="w-1/3"
            name="offerPrice"
            label={<span className=" font-montserrat">Offer price</span>}
          >
            <Input className=" font-montserrat" placeholder="Offer Price" />
          </Form.Item>

          <Form.Item
            className="w-1/3"
            name="quantity"
            label={<span className=" font-montserrat">Quantity</span>}
          >
            <Input className=" font-montserrat" pl />
          </Form.Item>
        </div>

        <Form.Item
          className="w-full"
          name="proVariantTypeId"
          label={<span className=" font-montserrat">Variant Type</span>}
        >
          <Select
            placeholder="Select Variant Type"
            className=" font-montserrat"
            onChange={handleVariantTypeChange}
          >
            {variantTypes.map((type) => (
              <Option
                className="font-montserrat"
                key={type._id}
                value={type._id}
              >
                {type.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          className="w-full"
          name="proVariantId"
          label={<span className=" font-montserrat">Variants</span>}
        >
          <Select
            mode="multiple"
            placeholder="Select Variants"
            optionLabelProp="label"
          >
            {filteredVariants.map((variant) => (
              <Option
                className="font-montserrat"
                key={variant._id}
                value={variant.name}
                label={variant.name}
              >
                {variant.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className=" font-montserrat">
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
