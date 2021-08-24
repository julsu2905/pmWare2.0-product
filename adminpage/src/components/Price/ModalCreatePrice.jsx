import {
  Form,
  Modal,
  Button,
  InputNumber,
  Select,
  notification,
  Input,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { createPrice } from "../../services/priceServices";
import { useSelector } from "react-redux";
import day from "dayjs";
import { useTranslation } from "react-i18next";

const ModalCreatePrice = ({
  visible,
  setVisible,
  getPricesData,
  setLoading,
  loading,
}) => {
  const { t } = useTranslation("translation");
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = useForm();
  const { dataLogin } = useSelector((state) => state.user);

  const handleOk = async () => {
    try {
      setLoading(true);
      setConfirmLoading(true);
      const createPriceRes = await createPrice({
        name: form.getFieldValue("name"),
        price: form.getFieldValue("price"),
        currency: form.getFieldValue("currency"),
        modifiedBy: dataLogin.data._id,
        lastModified: day(),
      });

      if (createPriceRes.data.status === "success") {
        notification.success({ message: "Create Price Successfully!" });
        getPricesData();
        form.resetFields();
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
    } finally {
      setConfirmLoading(false);
      setConfirmVisible(false);
      setVisible(false);
      setLoading(false);
    }
  };
  const tailLayout = { labelCol: { span: 8 } };

  return (
    <>
      <Modal
        title="Create Price"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button
            onClick={() => {
              if (
                form.getFieldValue("price") === "" ||
                form.getFieldValue("price") === undefined
              )
                notification.warning({
                  message: t("PRICE.CREATE.PriceRequiredMes"),
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
        <Form form={form}>
          <Form.Item {...tailLayout} name="name" label="Price Name">
            <Input />
          </Form.Item>
          <Form.Item {...tailLayout} name="price" label="Enter price">
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item {...tailLayout} name="currency" label="Currency">
            <Select>
              <Select.Option value="USD">USD</Select.Option>
              <Select.Option value="VND">VND</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Alert"
        visible={confirmVisible}
        confirmLoading={confirmLoading}
        onCancel={() => setVisible(false)}
        footer={[
          <Button loading={loading} onClick={handleOk} type="primary">
            OK
          </Button>,
          <Button onClick={() => setConfirmVisible(false)}>
            {t("Cancel")}
          </Button>,
        ]}
      >
        {t("PRICE.CREATE.ConfirmMes")}
      </Modal>
    </>
  );
};
export default ModalCreatePrice;
