/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Space, Table, message, Modal } from "antd";
import { MdEdit, MdDelete } from "react-icons/md";
import axios from "axios";
import ModalEditProduct from "./ModalEditProduct";

const TableScreen = () => {
  const [data, setData] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const handleOpenModal = (productId) => {
    setSelectedProductId(productId);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedProductId(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products");

        console.log("Dữ liệu nhận được từ API:", response.data);

        if (Array.isArray(response.data.data)) {
          const formattedData = response.data.data.map((product) => ({
            key: product._id,
            name: product.name,
            category: product.proCategoryId
              ? product.proCategoryId.name
              : "Không có danh mục",
            subcategory: product.proSubCategoryId
              ? product.proSubCategoryId.name
              : "Không có danh mục phụ",
            price: product.price,
          }));

          setData(formattedData);
        } else {
          console.error("Dữ liệu không phải là một mảng");
          message.error("Dữ liệu nhận được không đúng định dạng");
        }
      } catch (error) {
        console.error(error);
        message.error("Đã xảy ra lỗi khi lấy dữ liệu");
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (key) => {
    Modal.confirm({
      title: (
        <span className="font-montserrat">Bạn có chắc muốn xóa sản phẩm?</span>
      ),
      content: (
        <span className="font-montserrat">
          Sau khi xóa, sản phẩm sẽ không thể khôi phục.
        </span>
      ),
      okText: <span className="font-montserrat">Xóa ngay</span>,
      okType: "danger",
      cancelText: <span className="font-montserrat">Hủy bỏ</span>,
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:3000/products/${key}`);
          message.success({
            content: (
              <span className="font-montserrat">
                Sản phẩm đã được xóa thành công
              </span>
            ),
            className: "font-montserrat",
          });

          // Cập nhật lại danh sách sản phẩm sau khi xóa
          setData((prevData) => prevData.filter((item) => item.key !== key));
        } catch (error) {
          console.error(error);
          message.error({
            content: (
              <span className="font-montserrat">
                Có lỗi xảy ra, vui lòng thử lại sau
              </span>
            ),
            className: "font-montserrat",
          });
        }
      },
    });
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a className="font-montserrat">{text}</a>,
      className: "font-montserrat",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      className: "font-montserrat",
    },
    {
      title: "Sub Category",
      dataIndex: "subcategory",
      key: "subcategory",
      className: "font-montserrat",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      className: "font-montserrat",
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            className="hover:opacity-50 duration-150 font-montserrat"
            onClick={() => handleOpenModal(record.key)}
          >
            <MdEdit color="green" size={18} />
          </a>
          <a
            className="hover:opacity-50 duration-150 font-montserrat"
            onClick={() => handleDelete(record.key)}
          >
            <MdDelete color="red" size={18} />
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table className="font-montserrat" columns={columns} dataSource={data} />
      <ModalEditProduct
        visible={isModalVisible}
        onClose={handleCloseModal}
        productId={selectedProductId}
      />
    </div>
  );
};

export default TableScreen;
