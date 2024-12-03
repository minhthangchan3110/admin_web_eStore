/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Modal, Space, Table, Tag, message } from "antd";
import { IoIosAdd } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import axios from "axios";
import ModalEditUser from "../../components/User/ModalEditUser";
const UserScreen = () => {
  const [data, setData] = useState([]);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleOpenModalEdit = (userId) => {
    setIsModalEdit(true);
    setSelectedUserId(userId);
  };
  const handleCloseModalEdit = () => {
    setIsModalEdit(false);
    setSelectedUserId(null);
  };
  const columns = [
    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
      className: "font-montserrat",
      render: (text) => <a className="font-montserrat">{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      className: "font-montserrat",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      className: "font-montserrat",
    },
    {
      title: "Added Date",
      dataIndex: "createdAt",
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

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token"); // Giả sử token được lưu trong localStorage
      const response = await axios.get("http://localhost:3000/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Dữ liệu nhận được từ API: ", response.data);
      if (response.data && Array.isArray(response.data.data)) {
        const formattedData = response.data.data.map((user) => ({
          key: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        }));
        setData(formattedData);
      } else {
        console.log("Dữ liệu không phải là một mảng hoặc không có trường data");
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ API: ", error);
      message.error("Đã xảy ra lỗi khi lấy dữ liệu");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleDelete = async (key) => {
    Modal.confirm({
      title: (
        <span className="font-montserrat">Bạn có chắc muốn xóa hãng?</span>
      ),
      content: (
        <span className="font-montserrat">
          Sau khi xóa, hãng sẽ không thể khôi phục.
        </span>
      ),
      okText: <span className="font-montserrat">Xóa ngay</span>,
      okType: "danger",
      cancelText: <span className="font-montserrat">Hủy bỏ</span>,
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:3000/users/${key}`);
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
    <div className=" font-montserrat my-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">All user</h2>
      </div>
      <Table
        className="mt-4 font-montserrat"
        columns={columns}
        dataSource={data}
      />

      <ModalEditUser
        visible={isModalEdit}
        onClose={handleCloseModalEdit}
        userId={selectedUserId}
      />
    </div>
  );
};
export default UserScreen;