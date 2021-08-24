import {
  Form,
  Modal,
  Button,
  notification,
  Row,
  Col,
  Upload,
  Input,
  message,
  Select,
} from "antd";
import {
  FormOutlined,
  UserOutlined,
  MailOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { UploadOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import day from "dayjs";
import { useSelector } from "react-redux";
import { UPLOAD_URL } from "../../constants/apiConfig";
import { removeFileAvatar } from "../../services/userServices";
import { createAccount } from "../../services/userServices";

const ModalAddUserAdmin = ({ visible, setVisible, setLoading }) => {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const { dataLogin } = useSelector((state) => state.user);
  const handleOk = async () => {
    try {
      setLoading(true);
      setConfirmLoading(true);
      const createAccountRes = await createAccount({
        avatar: imageUrl,
        createdDate: day(),
        createdBy: dataLogin.data._id,
        name: form.getFieldValue("name"),
        email: form.getFieldValue("email"),
        password: form.getFieldValue("password"),
        passwordConfirm: form.getFieldValue("passwordConfirm"),
        role: form.getFieldValue("role"),
      });
      if (createAccountRes.data.status === "success") {
        notification.success({ message: "Create account Successfully!" });
        form.resetFields();
      }
      setVisible(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      let errorStatus;
      if (!error.response) {
        errorStatus = "Error: Network Error";
      } else {
        if (error.response.data.status === "fail") {
          errorStatus = error.response.data.message;
        }
      }
      notification.error({ message: errorStatus });
    } finally {
      setConfirmLoading(false);
      setConfirmVisible(false);
    }
  };
  const [form] = useForm();
  function beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      notification.error({ message: "You need to upload JPG/PNG file!" });
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      notification.error({ message: "The picture has to be below 2MB!" });
    }
    return isJpgOrPng && isLt2M;
  }
  return (
    <>
      <Modal
        title="Add User Admin"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button
            onClick={() => {
              if (
                form.getFieldValue("avatar") === "" ||
                form.getFieldValue("avatar") === undefined
              )
                notification.warning({
                  message: "Please upload an image",
                });
              else setConfirmVisible(true);
            }}
            type="primary"
          >
            OK
          </Button>,
          <Button onClick={() => setVisible(false)}>Cancel</Button>,
        ]}
      >
        <Row>
          <Col span={24}>
            <Form
              initialValues={{ role: "Admin" }}
              Layout="vertical"
              form={form}
            >
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input Username",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Username"
                />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "Invalid Email!",
                  },
                  {
                    required: true,
                    message: "Please input Email!",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  type="email"
                  placeholder="Email"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please Input password",
                  },
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<KeyOutlined />}
                  placeholder="Mật khẩu"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Phải chứa ít nhất một số và một chữ hoa và chữ thường và ít nhất 8 ký tự trở lên"
                />
              </Form.Item>

              <Form.Item
                name="passwordConfirm"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm password",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error("Confirm and password are not the same!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<KeyOutlined />}
                  placeholder="Password Confirm..."
                />
              </Form.Item>
              <Form.Item name="role" hasFeedback>
                <Select>
                  <Select.Option value="Admin">Admin</Select.Option>
                  <Select.Option value="Operator">Operator</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="avatar"
                valuePropName="fileList[0]"
                label="Avatar"
              >
                <Upload
                  name="avatar"
                  action={UPLOAD_URL}
                  withCredentials
                  listType="picture"
                  multiple={false}
                  beforeUpload={beforeUpload}
                  onChange={(info) => {
                    const { status } = info.file;
                    if (status === "uploading") {
                      return;
                    }
                    if (status === "done") {
                      message.success(`File uploaded successfully.`);
                      setImageUrl(info.file.response.avatar[0].filename);
                    } else if (status === "error") {
                      message.error(`File upload failed.`);
                    }
                  }}
                  onRemove={async (info) => {
                    try {
                      await removeFileAvatar(imageUrl);
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Modal>
      <Modal
        title="Alert"
        visible={confirmVisible}
        confirmLoading={confirmLoading}
        onCancel={() => setVisible(false)}
        footer={[
          <Button onClick={handleOk} type="primary">
            OK
          </Button>,
          <Button onClick={() => setConfirmVisible(false)}>Cancel</Button>,
        ]}
      >
        Do you want to add this user as this role?
      </Modal>
    </>
  );
};
export default ModalAddUserAdmin;
