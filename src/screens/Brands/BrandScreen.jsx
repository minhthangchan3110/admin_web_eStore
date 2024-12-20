/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Modal, Space, Table, message } from "antd";
import { IoIosAdd } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import axios from "axios";
import ModalAddBrand from "../../components/Brands/ModalAddBrand";
import ModalEditBrand from "../../components/Brands/ModalEditBrand";
const BrandScreen = () => {
  const [data, setData] = useState([]);
  const [isModalAdd, setIsModalAdd] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState(null);

  const handleOpenAdd = () => {
    setIsModalAdd(true);
  };

  const handleOpenModalEdit = (brandId) => {
    setIsModalEdit(true);
    setSelectedBrandId(brandId);
  };
  const handleCloseAdd = () => {
    setIsModalAdd(false);
  };
  const handleCloseModalEdit = () => {
    setIsModalEdit(false);
    setSelectedBrandId(null);
  };

  const columns = [
    {
      title: "Brands Name",
      dataIndex: "name",
      key: "name",
      className: "font-montserrat",
      render: (text) => <a className="font-montserrat">{text}</a>,
    },
    {
      title: "Sub Category",
      dataIndex: "subcategory",
      key: "subcategory",
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
      const response = await axios.get("http://localhost:3000/brands");
      console.log("Dữ liệu nhận được từ API: ", response.data);
      if (response.data && Array.isArray(response.data.data)) {
        const formattedData = response.data.data.map((brand) => ({
          key: brand._id,
          name: brand.name,
          subcategory: brand.subcategoryId.name,
          createdAt: brand.createdAt,
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
          await axios.delete(`http://localhost:3000/brands/${key}`);
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
        <h2 className="font-semibold text-lg">My Brands</h2>
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
      <ModalAddBrand visible={isModalAdd} onClose={handleCloseAdd} />
      <ModalEditBrand
        visible={isModalEdit}
        onClose={handleCloseModalEdit}
        brandId={selectedBrandId}
      />
    </div>
  );
};
export default BrandScreen;
