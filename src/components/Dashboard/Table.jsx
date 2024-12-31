/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import { Space, Table, message, Modal, Button, Input } from "antd";
import { MdEdit, MdDelete } from "react-icons/md";
import axios from "axios";
import ModalEditProduct from "./ModalEditProduct";
import { SearchOutlined } from "@ant-design/icons";

const TableScreen = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const searchInput = useRef(null);
  const API_URL =
    process.env.NODE_ENV === "production"
      ? "https://admin-estore-l29q.onrender.com"
      : "http://localhost:3000";
  const handleOpenModal = (productId) => {
    setSelectedProductId(productId);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedProductId(null);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <span style={{ backgroundColor: "#ffc069" }}>{text}</span>
      ) : (
        text
      ),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);

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
          await axios.delete(`${API_URL}/products/${key}`);
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
      ...getColumnSearchProps("name"),
      render: (text) => <a className="font-montserrat">{text}</a>,
      className: "font-montserrat",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      className: "font-montserrat",
      ...getColumnSearchProps("category"),
    },
    {
      title: "Sub Category",
      dataIndex: "subcategory",
      key: "subcategory",
      ...getColumnSearchProps("subcategory"),
      className: "font-montserrat",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      ...getColumnSearchProps("price"),
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
