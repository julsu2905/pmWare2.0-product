import { Col, Form, Input, notification, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";
import { getOrder } from "../../services/userServices";
import day from "dayjs";
import { useSelector } from "react-redux";
import emailKey from "../../helper/email";
import { init, send } from "emailjs-com";
init(emailKey.USER_ID);
const TabInvoice = ({ orderId }) => {
  const [form] = useForm();
  const [invoice, setInvoice] = useState();
  const { dataLogin } = useSelector((state) => state.user);
  const getDataInvoice = async () => {
    try {
      const getInvoiceRes = await getOrder(orderId, dataLogin.token);
      if (getInvoiceRes.data.status === "success") {
        const { createdDate, user, items, bill } = getInvoiceRes.data.data;
        const { name, email } = user;
        form.setFieldsValue({
          username: name,
          email: email,
          date: day(createdDate).format("DD/MM/YYYY HH:mm"),
          code: items[0].code.code,
          premiumPackage: items[0].code.premium,
          price: "$" + bill,
        });
        setInvoice({
          username: name,
          email: email,
          date: day(createdDate).format("DD/MM/YYYY HH:mm"),
          code: items[0].code.code,
          premiumPackage: items[0].code.premium,
          price: "$" + bill,
        });
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
  const sendMail = () => {
    send(emailKey.SERVICE_ID, emailKey.TEMPLATE_ID, {
      message: `Your order: ${invoice.premiumPackage} \t Fee: ${invoice.price} \n Code: ${invoice.code}`,
      from_name: "PMWare",
      to_name: `${invoice.username}`,
    }).then((res) =>
      notification.success({ message: "Giao dịch thành công!" })
    );
  };
  useEffect(() => {
    if (orderId !== undefined) getDataInvoice();
  }, [orderId]);
  useEffect(() => {
    if (invoice !== undefined) sendMail();
  }, [invoice]);
  return (
    <Form layout="vertical" form={form}>
      <Row gutter={[5, 0]}>
        <Col span={24} md={4}>
          <Form.Item label="Tên tài khoản" name="username">
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col span={24} md={4}>
          <Form.Item label="Email" name="email">
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col span={24} md={4}>
          <Form.Item label="Ngày mua" name="date">
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col span={24} md={4}>
          <Form.Item label="Mã kích hoạt" name="code">
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col span={24} md={4}>
          <Form.Item label="Gói" name="premiumPackage">
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col span={24} md={4}>
          <Form.Item label="Phí" name="price">
            <Input readOnly />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default TabInvoice;
