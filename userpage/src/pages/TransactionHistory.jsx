import React, { useEffect, useState } from "react";
import { Col, Row, Divider, notification, Table, Typography } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import DrawerLeft from "../components/components-layout/DrawerLeft";
import { getUserOrders } from "./../services/userServices";
import { useSelector } from "react-redux";
import day from "dayjs";
const TransactionHistory = () => {
  const [dataSource, setDataSource] = useState([]);
  const [user, setUserInfo] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const { dataLogin } = useSelector((state) => state.user);
  const columns = [
    {
      title: "",
      dataIndex: "key",
      key: "key",
      width: "3%",
      className: "text-center",
    },
    {
      title: "Premium Pack",
      dataIndex: "premium",
      key: "premium",
      width: "10%",
      className: "text-center",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: "10%",
    },
    {
      title: "Available",
      dataIndex: "activated",
      key: "activated",
      width: "10%",
      className: "text-center",
      render: (text, record) =>
        record.userActivate === "" ? (
          <CheckOutlined style={{ color: "green" }} />
        ) : (
          <CloseOutlined style={{ color: "red" }} />
        ),
    },
    {
      title: "Activated By",
      dataIndex: "userActivate",
      key: "userActivate",
      width: "20%",
      className: "text-center",
      render: (text, record) => record.userActivate && <span>{text}</span>,
    },
    {
      title: "Buy Date",
      dataIndex: "createdDate",
      key: "createdDate",
      width: "20%",
    },
  ];
  const getDataOrders = async () => {
    try {
      setLoading(true);
      const getUserOrdersRes = await getUserOrders(dataLogin.token);
      let data = [];
      if (getUserOrdersRes.data.status === "success") {
        if (getUserOrdersRes.data.data.length === 0) {
          notification.info("Chưa có giao dịch!");
          return;
        }
        getUserOrdersRes.data.data.map((dt, index) => {
          if (index === 0) {
            setUserInfo({ name: dt.user.name, email: dt.user.email });
          }

          data.push({
            key: ++index,
            premium: dt.items[0].code.premium,
            code: dt.items[0].code.code,
            activated: dt.items[0].code.activated,
            userActivate:
              dt.items[0].code.userActivate !== null
                ? dt.items[0].code.userActivate.name
                : "",
            createdDate: day(dt.createdDate).format("DD/MM/YYYY HH:mm"),
          });
        });
        setDataSource(data);
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
      setLoading(false);
    }
  };
  useEffect(() => {
    getDataOrders();
  }, []);
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
                  <h1>Lịch sử giao dịch</h1>
                </div>
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
                span={24}
              >
                <Typography style={{ fontSize: "16px", textAlign: "center" }}>
                  Tên tài khoản: {user.name}
                </Typography>
                <Typography style={{ fontSize: "16px", textAlign: "center" }}>
                  Email: {user.email}
                </Typography>
                <Table
                  className="center-header"
                  style={{ marginTop: "20px" }}
                  columns={columns}
                  dataSource={dataSource}
                  loading={loading}
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </>
  );
};
export default TransactionHistory;
