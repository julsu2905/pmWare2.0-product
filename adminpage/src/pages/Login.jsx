import { Row, Col, Input, Checkbox, Button, Form, notification } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./page-css/Login.css";
import { useHistory } from "react-router-dom";
import { login } from "./../services/authServices";
import { useDispatch } from "react-redux";
import { userLoggin } from "./../redux/actions/userActions";
import { useTranslation } from "react-i18next";
const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation("translation");

  const handleSubmit = async (values) => {
    const { email, password } = values;
    try {
      const loginRes = await login(email, password);
      if (loginRes.data.status === "success") {
        notification.success({ message: "Đăng nhập thành công!" });
        const localData = JSON.stringify(loginRes.data.user);
        const { email, name } = loginRes.data.user.data;
        const { token } = loginRes.data.user;
        if (values.Remember === "checked")
          localStorage.setItem("user", localData);
        dispatch(
          userLoggin({
            data: { email, name },
            token,
          })
        );
        history.push("/dashboard");
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
    <Row style={{ height: "100%" }}>
      <Col
        style={{ backgroundImage: "url(/img/login.jpg)" }}
        className="login-background"
        span={0}
        md={16}
      ></Col>
      <Col
        className="login-form-wrapper flex flex-col items-center"
        span={24}
        md={8}
      >
        <div className="image-wrapper">
          <img
            style={{ height: "80px" }}
            src={"/img/lock-black.png"}
            alt="login-logo"
          />
        </div>
        <h1 className="text-3xl text-white font-mono">{t("SignIn")}</h1>
        <div style={{ marginTop: 10, width: "100%" }}>
          <Form initialValues={{ Remember: "checked" }} onFinish={handleSubmit}>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: t("EmailRequiredMes") },
                    {
                      type: "email",
                      message: t("EmailInvalidMes"),
                    },
                  ]}
                >
                  <Input
                    className="form-controls"
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Email"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: t("PassRequiredMes") }]}
                >
                  <Input
                    className="form-controls"
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Form.Item>
                <Form.Item name="Remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-white border-white-900">
                    {t("Remember")}?
                  </Checkbox>
                </Form.Item>
              </Form.Item>
            </Row>
            <Row>
              <Col className="flex justify-center" span={24}>
                <Form.Item style={{ width: "100%" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button text-black font-semibold uppercase text-lg rounded-md"
                  >
                    {t("SignIn")}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="text-gray-400">
          Copyright © Project Manager Software 2021.
        </div>
      </Col>
    </Row>
  );
};
export default Login;
