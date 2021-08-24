
import React,{createRef} from "react";
import {
  Form,
  Col,
  Row,
  Input,
  Button,
  Checkbox,
  Divider,
  notification,
} from "antd";
import {
  LockOutlined,
  UserOutlined,
  GooglePlusOutlined,
} from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";
import { login } from "../services/authServices";
import { useDispatch } from "react-redux";
import "./page-css/Login.css";
import { userLoggin } from "../redux/actions/userActions";

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const handleLogin = async (values) => {
    try {
      const loginRes = await login(values.email, values.password);
      if (loginRes.data.status === "success") {
        notification.success({ message: "Đăng nhập thành công!" });
        const { token } = loginRes.data.user;
        dispatch(
          userLoggin({
            data: { ...loginRes.data.user.data },
            token,
          })
        );
        if (values.Remember === true) {
          const localData = JSON.stringify({
            data: { ...loginRes.data.user.data },
            token,
          });
          localStorage.setItem("user", localData);
        }
        history.push("/home");
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
    }

  };
  return (
    <Row className="login-container">
      <Col offset={8} className="login-form-wrapper" span={8}>
        <h1>Đăng nhập</h1>
        <div className="btn-google">
          <Button>
            <GooglePlusOutlined style={{ color: "red" }} /> Đăng nhập với Google
          </Button>
        </div>
        <Divider plain> Hoặc</Divider>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={handleLogin}
          initialValues={{
            Remember: true,
          }}
          size="large"
        >
          <Form.Item
            className="input-login"
            name="email"
            rules={[
              {
                type: "email",
                message: "Bạn nhập không phải là Email !",
              },
              {
                required: true,
                message: "Vui lòng nhập Email !",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            className="input-login"
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu !",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Mật khẩu"
            />
          </Form.Item>
          <Form.Item name="Remember" valuePropName="checked" noStyle>
            <Checkbox>Ghi nhớ</Checkbox>
          </Form.Item>
          <Form.Item>
            <a className="login-form-forgot" href="">
              Quên mật khẩu
            </a>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            
            >
              Đăng nhập
            </Button>
            Or <Link to="/register">Đăng ký ngay bây giờ</Link>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
