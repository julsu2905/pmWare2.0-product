import { Form, Modal, Button, InputNumber, Select, notification } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useState, useEffect } from "react";
import { getPriceNames, updatePrice } from "../../services/priceServices";
import { useSelector } from "react-redux";
import day from "dayjs";
import { getPrice } from "./../../services/priceServices";
import { useTranslation } from "react-i18next";

const ModalUpdatePrice = ({
  visible,
  setVisible,
  getPricesData,
  setLoading,
  loading,
}) => {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = useForm();
  const [priceOptions, setPriceOptions] = useState([]);
  const { t } = useTranslation("translation");
  const [idPrice, setIdPrice] = useState("");
  const [name, setName] = useState("90");
  const [currency, setCurrency] = useState("USD");
  const { dataLogin } = useSelector((state) => state.user);
  const handleOk = async () => {
    try {
      setLoading(true);
      setConfirmLoading(true);
      const updatePriceRes = await updatePrice(idPrice, {
        name: form.getFieldValue("name"),
        price: form.getFieldValue("price"),
        currency: form.getFieldValue("currency"),
        modifiedBy: dataLogin.data._id,
        lastModified: day(),
      });
      if (updatePriceRes.data.status === "success") {
        notification.success({ message: t("PRICE.UPDATE.SuccesMes") });
        getPricesData();
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
  const getDataPrice = async () => {
    try {
      const getPriceRes = await getPrice(name, currency);
      if (getPriceRes.data.status === "success") {
        form.setFieldsValue({ price: getPriceRes.data.check.price });
        setIdPrice(getPriceRes.data.check._id);
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
  const getPriceNamesData = async () => {
    try {
      const getPriceNamesRes = await getPriceNames();
      if (getPriceNamesRes.data.status === "success") {
        form.setFieldsValue({ name: getPriceNamesRes.data.data[0] });
        setPriceOptions(getPriceNamesRes.data.data);
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
  useEffect(() => {
    getDataPrice();
  }, [name, currency]);
  useEffect(() => {
    getPriceNamesData();
  }, []);
  return (
    <>
      <Modal
        title={t("PRICE.Edit")}
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
                  message: t("PRICE.UPDATE.PriceRequiredMes"),
                });
              else setConfirmVisible(true);
            }}
            type="primary"
          >
            OK
          </Button>,
          <Button onClick={() => setVisible(false)}>{t("Cancel")}</Button>,
        ]}
      >
        <Form form={form} initialValues={{ currency: "USD" }}>
          <Form.Item {...tailLayout} name="name" label="Choose price to edit">
            <Select onChange={(e) => setName(e)}>
              {priceOptions.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item {...tailLayout} name="price" label="Enter new price">
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item {...tailLayout} name="currency" label="Currency">
            <Select onChange={(e) => setCurrency(e)}>
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
        {t("PRICE.UPDATE.ConfirmMes")}
      </Modal>
    </>
  );
};
export default ModalUpdatePrice;
