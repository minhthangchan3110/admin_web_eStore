/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Modal, Space, Table, message } from "antd";
import { MdDelete, MdEdit } from "react-icons/md";
import axios from "axios";
import { IoReload } from "react-icons/io5";
import ModalEditOrder from "../../components/Orders/ModalEditOrder";
import { SearchOutlined } from "@ant-design/icons";

const Orders = () => {
  const [data, setData] = useState([]);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [filter, setFilter] = useState("all"); // State cho lọc
  const searchInput = useRef(null);
  const handleOpenModalEdit = (orderId) => {
    setIsModalEdit(true);
    setSelectedOrderId(orderId);
  };

  const handleCloseModalEdit = () => {
    setIsModalEdit(false);
    setSelectedOrderId(null);
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

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/orders`
      );
      console.log("Dữ liệu nhận được từ API: ", response.data);

      if (response.data && Array.isArray(response.data.data)) {
        const formattedData = response.data.data.map((order) => ({
          key: order._id,
          email: order.userID ? order.userID.email : "Unknown",
          amount: order.totalPrice,
          paymentMethod: order.paymentMethod,
          status: order.orderStatus,
          createdAt: order.orderDate,
        }));
        // Lọc dữ liệu theo trạng thái
        const filteredData =
          filter === "all"
            ? formattedData
            : formattedData.filter((order) => order.status === filter);
        setData(filteredData);
      } else {
        console.log(
          "Dữ liệu không phải là một mảng hoặc không có trường data."
        );
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      message.error("Đã xảy ra lỗi khi lấy dữ liệu");
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]); // Thêm filter vào dependency array
  const handleReload = () => {
    fetchData();
  };
  const columns = [
    {
      title: "Customer Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
      className: "font-montserrat",
      render: (text) => <a className="font-montserrat">{text}</a>,
    },
    {
      title: "Order Amount",
      dataIndex: "amount",
      key: "amount",
      ...getColumnSearchProps("amount"),
      className: "font-montserrat",
    },
    {
      title: "Payment",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      ...getColumnSearchProps("paymentMethod"),
      className: "font-montserrat",
    },
    {
      title: "Status",
      dataIndex: "status",

      className: "font-montserrat",
      key: "status",
    },
    {
      title: "Added Date",
      dataIndex: "createdAt",
      ...getColumnSearchProps("createdAt"),
      key: "createdAt",
      className: "font-montserrat",
      render: (createdAt) => {
        const date = new Date(createdAt);
        return <span>{date.toLocaleDateString()}</span>;
      },
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => handleOpenModalEdit(record.key)}
            className="hover:opacity-50 duration-150 font-montserrat"
          >
            <MdEdit color="green" size={18} />
          </a>
          <a
            onClick={() => handleDelete(record.key)}
            className="hover:opacity-50 duration-150 font-montserrat"
          >
            <MdDelete color="red" size={18} />
          </a>
        </Space>
      ),
    },
  ];
  const handleDelete = async (key) => {
    Modal.confirm({
      title: (
        <span className="font-montserrat">Bạn có chắc muốn xóa danh mục?</span>
      ),
      content: (
        <span className="font-montserrat">
          Sau khi xóa, danh mục sẽ không thể khôi phục.
        </span>
      ),
      okText: <span className="font-montserrat">Xóa ngay</span>,
      okType: "danger",
      cancelText: <span className="font-montserrat">Hủy bỏ</span>,
      onOk: async () => {
        try {
          await axios.delete(
            `${process.env.REACT_APP_API_BASE_URL}/orders/${key}`
          );
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
  return (
    <div className="font-montserrat my-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">My Orders</h2>
        <div className="flex items-center gap-2">
          <div>
            <select
              className="border font-montserrat border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div onClick={handleReload} className="cursor-pointer">
            <IoReload size={20} />
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        className="mt-4 font-montserrat"
      />
      <ModalEditOrder
        visible={isModalEdit}
        orderId={selectedOrderId}
        onClose={handleCloseModalEdit}
      />
    </div>
  );
};

export default Orders;
