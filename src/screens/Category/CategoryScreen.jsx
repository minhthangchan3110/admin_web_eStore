/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Space, Table, message, Modal } from "antd";
import { MdEdit, MdDelete } from "react-icons/md";
import axios from "axios";
import { IoIosAdd } from "react-icons/io";
import ModalAddCategory from "../../components/Category/ModalAddCategory";
import ModalEditCategory from "../../components/Category/ModalEditCategory";

const CategoryScreen = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleOpenModalEdit = (categoryId) => {
    setIsModalEdit(true);
    setSelectedCategoryId(categoryId);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  const handleCloseModalEdit = () => {
    setIsModalEdit(false);
    setSelectedCategoryId(null);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/categories");
      console.log("Dữ liệu nhận được từ API: ", response.data);

      if (response.data && Array.isArray(response.data.data)) {
        const formattedData = response.data.data.map((category) => ({
          key: category._id,
          name: category.name,
          createdAt: category.createdAt,
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

  const handleCategoryAdded = (newCategory) => {
    const formattedCategory = {
      key: newCategory._id,
      name: newCategory.name,
      createdAt: new Date().toISOString(), // Giả sử ngày thêm là ngày hiện tại
    };
    setData((prevData) => [...prevData, formattedCategory]);
  };
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
          await axios.delete(`http://localhost:3000/categories/${key}`);
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
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      className: "font-montserrat",
      render: (text) => <a className="font-montserrat">{text}</a>,
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

  return (
    <div className="font-montserrat my-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">My Categories</h2>
        <div
          onClick={handleOpenModal}
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
      <ModalAddCategory
        visible={isModalVisible}
        onClose={handleCloseModal}
        onCategoryAdded={handleCategoryAdded} // Truyền callback để cập nhật danh sách
      />
      <ModalEditCategory
        visible={isModalEdit}
        onClose={handleCloseModalEdit}
        categoryId={selectedCategoryId}
      />
    </div>
  );
};

export default CategoryScreen;