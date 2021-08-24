import React, { useState } from "react";
import { Modal, Button, Input, Form } from "antd";
import { KeyOutlined, UserOutlined, ProfileOutlined } from "@ant-design/icons";

const ModalChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const [value, setValue] = React.useState(1);
  const [form] = Form.useForm();
  return (
    <>
      <Button onClick={showModal}>Chỉnh sửa mật khẩu</Button>
      <Modal
        title="Change password"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="change-password"
          initialValues={{
            prefix: "86",
          }}
          scrollToFirstError
          className="register-form"
        >
          <p>Old password</p>
          <Form.Item
            name="old-password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu cũ!",
              },
            ]}
            hasFeedback
          >
            <Input.Password prefix={<KeyOutlined />} placeholder="Mật khẩu" />
          </Form.Item>
          <p>New password</p>
          <Form.Item
            name="new-password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu mới!",
              },
            ]}
            hasFeedback
          >
            <Input.Password
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Phải chứa ít nhất một số và một chữ hoa và chữ thường và ít nhất 8 ký tự trở lên"
              prefix={<KeyOutlined />}
              placeholder="Mặt khẩu mới"
            />
          </Form.Item>

          <Form.Item
            name="new-passwordConfirm"
            dependencies={["new-password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Vui lòng xác nhận lại mật khẩu mới!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new-password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error(
                      "Mật khẩu nhập không chính xác"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<KeyOutlined />}
              placeholder="Xác nhận mặt khẩu"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalChangePassword;
