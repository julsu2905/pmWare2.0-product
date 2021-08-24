import { useEffect, useRef, useState } from "react";
import { createOrder, getItem, getCode } from "./../../services/userServices";
import { notification } from "antd";
import { useSelector } from "react-redux";

const Paypal = ({ itemName, setActiveKey, setStage, setInvoice }) => {
  const paypal = useRef();
  const [item, setItem] = useState(null);
  const { dataLogin } = useSelector((state) => state.user);
  const getItemData = async () => {
    try {
      const getItemRes = await getItem(itemName);
      if (getItemRes.data.status === "success") setItem(getItemRes.data.check);
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
  
  const createOrderData = async (order) => {
    try {
      let codeId;
      const getCodeByPriceNameRes = await getCode(
        order.purchase_units[0].description
      );
      if (getCodeByPriceNameRes.data.status === "success") {
        codeId = getCodeByPriceNameRes.data.data._id;
      }
      const createOrderRes = await createOrder(
        {
          user: dataLogin.data._id,
          items: [
            {
              code: codeId,
              quantity: 1,
            },
          ],
          bill: order.purchase_units[0].amount.value,
        },
        dataLogin.token
      );
      if (createOrderRes.data.status === "success") {
        setStage("invoice");
        setActiveKey("invoice");
        setInvoice(createOrderRes.data.data._id);
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
    if (item !== null) {
      window.paypal
        .Buttons({
          createOrder: (data, actions, err) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  description: item.name,
                  amount: {
                    currency_code: "USD",
                    value: item.price,
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            console.log(order);
            if (order.status === "COMPLETED") createOrderData(order);
          },
          onError: (err) => {
            console.log(err);
            notification.error({ message: "Vui lòng thử lại sau!" });
          },
          style: { shape: "pill", size: "small", layout: "vertical" },
        })
        .render(paypal.current);
    }
  }, [item]);
  useEffect(() => {
    if (itemName !== undefined) getItemData();
  }, [itemName]);
  return (
    <div key="paypal-key">
      <div ref={paypal}></div>
    </div>
  );
};
export default Paypal;
