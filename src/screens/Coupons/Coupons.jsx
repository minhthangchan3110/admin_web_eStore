/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Modal, Space, Table, Tag, message } from "antd";
import { IoIosAdd } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import axios from "axios";
import ModalAddCoupon from "../../components/Coupons/ModalAddCoupon";
import ModalEditCoupon from "../../components/Coupons/ModalEditCoupon";
import { SearchOutlined } from "@ant-design/icons";
const Coupons = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isModalAdd, setIsModalAdd] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [selectedCouponCodeId, setSelectedCouponCodeId] = useState(null);
  const searchInput = useRef(null);
  const handleOpenAdd = () => {
    setIsModalAdd(true);
  };
  const handleOpenModalEdit = (couponCodeId) => {
    setIsModalEdit(true);
    setSelectedCouponCodeId(couponCodeId);
  };
  const handleCloseAdd = () => {
    setIsModalAdd(false);
  };
  const handleCloseModalEdit = () => {
    setIsModalEdit(false);
    setSelectedCouponCodeId(null);
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
        `${process.env.REACT_APP_API_BASE_URL}/couponcodes`
      );
      console.log("Dữ liệu nhận được từ API: ", response.data);

      if (response.data && Array.isArray(response.data.data)) {
        const formattedData = response.data.data.map((coupon) => ({
          key: coupon._id,
          name: coupon.couponCode,
          status: coupon.status,
          type: coupon.discountType,
          amount: coupon.discountAmount,
        }));
        setData(formattedData);
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
  }, []);
  const columns = [
    {
      title: "Coupon Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      className: "font-montserrat",
      render: (text) => <a className=" font-montserrat">{text}</a>,
    },
    {
      title: "Status",
      dataIndex: "status",
      ...getColumnSearchProps("status"),
      className: "font-montserrat",
      key: "status",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      ...getColumnSearchProps("type"),
      className: "font-montserrat",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      ...getColumnSearchProps("amount"),
      className: "font-montserrat",
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
            `${process.env.REACT_APP_API_BASE_URL}/couponcodes/${key}`
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
        <h2 className="font-semibold text-lg">Coupon Codes</h2>
        <div
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-green-500 font-semibold text-white p-2 rounded-lg shadow-md cursor-pointer duration-200 hover:bg-green-700"
        >
          <IoIosAdd size={24} />
          <div>Add New</div>
        </div>
      </div>
      <Table
        className="mt-4 font-montserrat"
        columns={columns}
        dataSource={data}
      />
      <ModalAddCoupon visible={isModalAdd} onClose={handleCloseAdd} />
      <ModalEditCoupon
        visible={isModalEdit}
        couponCodeId={selectedCouponCodeId}
        onClose={handleCloseModalEdit}
      />
    </div>
  );
};
export default Coupons;
