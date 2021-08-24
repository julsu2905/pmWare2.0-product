import {
  Form,
  Modal,
  Button,
  Select,
  notification,
  Row,
  Col,
  Input,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";
import day from "dayjs";
import { useSelector } from "react-redux";
import { createCode } from "../../services/codeServices";
import { getPriceNames, getPrices } from "./../../services/priceServices";

const ModalCreateCode = ({ visible, setVisible, getCodeData, setLoading }) => {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [pricesData, setPricesData] = useState([]);
  const [pricesNameData, setPricesNameData] = useState([]);
  const [selectData, setSelectData] = useState();
  const [premium, setPremium] = useState("90");
  const { dataLogin } = useSelector((state) => state.user);
  const handleOk = async () => {
    try {
      setLoading(true);
      setConfirmLoading(true);
      const createPromotionRes = await createCode({
        code: form.getFieldValue("code"),
        premium: form.getFieldValue("premium"),
        createdDate: day(),
        activatedDate: null,
        createdBy: dataLogin.data._id,
        price: form.getFieldValue("price"),
      });
      if (createPromotionRes.data.status === "success") {
        notification.success({ message: "Create code Successfully!" });
        getCodeData();
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
  const getPricesData = async () => {
    try {
      setLoading(true);
      const getPricesRes = await getPrices();
      const getPricesNameRes = await getPriceNames();
      setPricesData(getPricesRes.data.data);
      setPricesNameData(getPricesNameRes.data.data);
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
      setLoading(false);
    }
  };
  const [form] = useForm();
  const generateCode = (length) => {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  useEffect(() => {
    getPricesData();
  }, []);
  useEffect(() => {
    form.setFieldsValue({ price: undefined });
    setSelectData(
      pricesData.map((price) => {
        if (price.name == premium)
          return (
            <Select.Option key={price._id} value={price._id}>
              {price.price}
              {price.currency}
            </Select.Option>
          );
      })
    );
  }, [premium, pricesData]);
  return (
    <>
      <Modal
        title="Create Code"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button
            onClick={() => {
              if (
                form.getFieldValue("code") === "" ||
                form.getFieldValue("code") === undefined
              )
                notification.warning({
                  message: "Please generate code!",
                });
              else if (
                form.getFieldValue("price") === undefined ||
                form.getFieldValue("price") === ""
              ) {
                notification.warning({
                  message: "Please choose a price!",
                });
              } else setConfirmVisible(true);
            }}
            type="primary"
          >
            OK
          </Button>,
          <Button onClick={() => setVisible(false)}>Cancel</Button>,
        ]}
      >
        <Form layout="vertical" initialValues={{ premium: "90" }} form={form}>
          <Row gutter={[5, 0]}>
            <Col span={15} md={17}>
              <Form.Item name="code" label="Code">
                <Input className="w-full" readOnly />
              </Form.Item>
            </Col>
            <Col span={4} md={7}>
              <Form.Item label=" ">
                <Button
                  onClick={() => {
                    form.setFieldsValue({ code: generateCode(13) });
                  }}
                  type="primary"
                >
                  Generate Code
                </Button>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item name="premium" label="Premium">
                <Select onChange={(e) => setPremium(e)}>
                  {pricesNameData.map((price) => (
                    <Select.Option value={price}>{price}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="price" label="Price">
                <Select>{selectData}</Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
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
        Do you want to create this code?
      </Modal>
    </>
  );
};
export default ModalCreateCode;
