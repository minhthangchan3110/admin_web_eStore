import { Modal, Form, Input, Button, message, Switch } from "antd"; // Thêm Switch
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function SettingAdmin({ visible, onClose, userId }) {
  const [form] = Form.useForm();
  const [userData, setUserData] = useState(null);
  const [isChangePasswordEnabled, setIsChangePasswordEnabled] = useState(false); // State cho toggle

  useEffect(() => {
    if (userId) {
      console.log("Fetching data for userId:", userId);
      const fetchUserData = async () => {
        try {
          const userRes = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/users/${userId}`
          );
          setUserData(userRes.data.data);
          form.setFieldsValue({
            name: userRes.data.data.name || "",
            email: userRes.data.data.email || "",
            password: "", // Không tự động điền mật khẩu
            new_password: "", // Không tự động điền mật khẩu mới
            confirm_new_password: "", // Không tự động điền xác nhận mật khẩu mới
          });
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu: ", error);
          message.error("Không thể lấy dữ liệu người dùng!");
        }
      };
      fetchUserData();
    }
  }, [userId, form]);

  const onFinish = async (values) => {
    try {
      console.log("Sending updated data:", values);

      // Kiểm tra định dạng email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(values.email)) {
        return message.error("Email không hợp lệ!");
      }

      // Kiểm tra mật khẩu mới
      if (isChangePasswordEnabled) {
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{12,})/;
        if (!passwordRegex.test(values.new_password)) {
          return message.error(
            "Mật khẩu mới phải có ít nhất 12 ký tự, bao gồm cả chữ hoa, chữ thường, số và ký tự đặc biệt!"
          );
        }
      }

      // Tạo đối tượng dữ liệu để gửi đến API
      const dataToUpdate = {
        name: values.name,
        email: values.email,
        confirm_new_password: values.confirm_new_password,
      };

      // Nếu thay đổi mật khẩu được bật, thêm mật khẩu vào dữ liệu
      if (isChangePasswordEnabled) {
        dataToUpdate.password = values.password; // Mật khẩu cũ
        dataToUpdate.new_password = values.new_password; // Mật khẩu mới
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/users/${userId}`,
        dataToUpdate
      );
      console.log("API Response:", response.data);
      message.success("Cập nhật thành công!");
      onClose();
      form.resetFields();
      setUserData(null);
    } catch (error) {
      console.error("API Error:", error);
      message.error("Cập nhật không thành công!");
    }
  };

  return (
    <Modal
      visible={visible}
      className="font-montserrat"
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label={<span className="font-montserrat">Tên tài khoản</span>}
          rules={[{ required: true, message: "Vui lòng nhập tên tài khoản!" }]}
        >
          <Input placeholder="Nhập tên tài khoản" className="font-montserrat" />
        </Form.Item>
        <Form.Item
          className="font-montserrat"
          name="email"
          label={<span className="font-montserrat">Email</span>}
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="Nhập email" className="font-montserrat" />
        </Form.Item>

        {/* Nút toggle cho chức năng thay đổi mật khẩu */}
        <Form.Item
          label={<span className="font-montserrat">Thay đổi mật khẩu</span>}
        >
          <Switch
            checked={isChangePasswordEnabled}
            onChange={setIsChangePasswordEnabled}
          />
        </Form.Item>

        {/* Chỉ hiển thị các trường mật khẩu khi toggle được bật */}
        {isChangePasswordEnabled && (
          <>
            <Form.Item
              name="password"
              label={<span className="font-montserrat">Mật khẩu cũ</span>}
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu cũ!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="new_password"
              label={<span className="font-montserrat">Mật khẩu mới</span>}
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirm_new_password"
              label={
                <span className="font-montserrat">Xác nhận mật khẩu mới</span>
              }
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("new_password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu xác nhận không khớp!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </>
        )}

        <Form.Item>
          <Button className=" font-montserrat" type="primary" htmlType="submit">
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
