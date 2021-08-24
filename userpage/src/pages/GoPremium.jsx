import React from "react";
import { Col, Row, Divider, notification, Form, Input, Button } from "antd";
import DrawerLeft from "../components/components-layout/DrawerLeft";
import { useForm } from "antd/lib/form/Form";
import { activeKeyCode } from "../services/userServices";
import { logout } from "../services/authServices";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "./../redux/actions/userActions";
const Premium = () => {
  const [form] = useForm();
  const { dataLogin } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const submit = async (values) => {
    try {
      const activeRes = await activeKeyCode(
        dataLogin.data._id,
        values.key,
        dataLogin.token
      );
      if (activeRes.data.status === "success") {
        notification.success({
          message: "Kích hoạt thành công! Vui lòng đăng nhập lại để cập nhật!",
        });
        await logout();
        localStorage.getItem("user") && localStorage.removeItem("user");
        dispatch(userLogout());
      }
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
    }
  };
  return (
    <>
      <Row className="row-home-content">
        <Col span={3}>
          <DrawerLeft />
        </Col>
        <Col className="all-project" span={20}>
          <div>
            <Row>
              <Col style={{ marginTop: "20px" }} span={16}>
                <div>
                  <h1>Kích hoạt mã</h1>
                </div>
              </Col>
            </Row>
            <Divider />
            <Row
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Col span={24}>
                <Form form={form} onFinish={submit}>
                  <Row gutter={[10, 0]}>
                    <Col span={12}>
                      <Form.Item label="Nhập mã kích hoạt" name="key">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="">
                        <Button type="primary" htmlType="submit">
                          Kích hoạt
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </>
  );
};
export default Premium;
