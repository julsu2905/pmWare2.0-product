import React, { useState } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Divider,
  notification,
  Upload,
  message,
} from "antd";
import "./page-css/Register.css";
import {
  FormOutlined,
  UserOutlined,
  GooglePlusOutlined,
  MailOutlined,
  KeyOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "./page-css/Register.css";
import { register } from "../services/userServices";
import { useHistory } from "react-router-dom";
import { UPLOAD_URL } from "./../constants/apiConfig";
import { removeFileAvatar } from "./../services/userServices";
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const Register = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState();

  const submit = async (values) => {
    try {
      setLoading(true);
      const { name, email, password, passwordConfirm, bio, avatar, premium } =
        values;
      if (avatar === undefined || avatar.fileList.length === 0) {
        const registerRes = await register({
          name,
          email,
          password,
          passwordConfirm,
          bio,
          premium,
        });
        if (registerRes.data.status === "success") {
          notification.success({ message: "Đăng ký tài khoản thành công!" });
          history.push("/login");
        }
      } else {
        const registerRes = await register({
          name,
          email,
          password,
          passwordConfirm,
          bio,
          avatar: imageUrl,
          premium,
        });
        if (registerRes.data.status === "success") {
          notification.success({ message: "Đăng ký tài khoản thành công!" });
          history.push("/login");
        }
      }
    } catch (error) {
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
      setLoading(false);
    }
  };
  function beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      notification.error({ message: "Bạn chỉ có thể tải lên JPG/PNG file!" });
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      notification.error({ message: "Hình cần phải nhỏ hơn 2MB!" });
    }
    return isJpgOrPng && isLt2M;
  }
  return (
    <Row className="register-container">
      <Col offset={9} className="register-form-wrapper" span={8}>
        <h1 id="register-title">
          <FormOutlined /> Mẫu đăng ký
        </h1>
        <div className="btn-google">
          <Button>
            <GooglePlusOutlined style={{ color: "red" }} /> Đăng nhập với Google
          </Button>
        </div>
        <Divider plain> Hoặc</Divider>
        <Form
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          {...formItemLayout}
          form={form}
          name="register"
          scrollToFirstError
          onFinish={submit}
          className="register-form"
          initialValues={{ premium: 0 }}
        >
          <Form.Item
            className="register-input"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập User name",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="User name"
            />
          </Form.Item>
          <Form.Item
            className="register-input"
            name="email"
            rules={[
              {
                type: "email",
                message: "Bạn vừa nhập không phải Email!",
              },
              {
                required: true,
                message: "Vui lòng nhập Email!",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} type="email" placeholder="Email" />
          </Form.Item>

          <Form.Item
            className="register-input"
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu",
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
            className="register-input"
            name="passwordConfirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Vui lòng xác nhận lại mật khẩu",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error("Mật nhẩu bạn nhập không khớp")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<KeyOutlined />}
              placeholder="Xác nhận mật khẩu"
            />
          </Form.Item>
          <Form.Item name="bio" className="register-input">
            <TextArea
              rows={3}
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Tiểu sử"
            />
          </Form.Item>

          <Form.Item
            name="avatar"
            valuePropName="fileList[0]"
            className="register-input"
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
              Your Avatar <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item className="register-input">
            <Button
              loading={loading}
              className="btn-register"
              type="primary"
              htmlType="submit"
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default Register;
