import { Col, Layout, notification, Row, Table, Button, Space } from "antd";
import {
  CheckOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import QueueAnim from "rc-queue-anim";
import { useEffect, useState } from "react";
import CHeader from "./../components/layout/CHeader";
import day from "dayjs";
import "./page-css/Table.css";
import { useSelector } from "react-redux";
import {
  blockPrice,
  getPrices,
  unblockPrice,
} from "./../services/priceServices";
import ModalUpdatePrice from "../components/Price/ModalUpdatePrice";
import { AVATAR_URL } from "../constants/apiConfig";
import PriceCard from "../components/Price/PriceCard";
import ModalCreatePrice from "../components/Price/ModalCreatePrice";
import confirm from "antd/lib/modal/confirm";
import { useTranslation } from "react-i18next";
const Price = () => {
  const [show, setShow] = useState(false);
  const { t } = useTranslation("translation");
  const [visible, setVisible] = useState(false);
  const [modalCreateVisible, setModalCreateVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastChanged, setLastChanged] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const { type } = useSelector((state) => state.view);
  const columns = [
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      className: "text-center",
    },
    {
      title: t("Price"),
      dataIndex: "price",
      key: "price",
      width: "30%",
      className: "text-center",
    },
    {
      title: t("PRICE.Currency"),
      dataIndex: "currency",
      key: "currency",
      width: "10%",
      className: "text-center",
    },
    {
      title: t("LastModified"),
      dataIndex: "lastModified",
      key: "lastModified",
      width: "30%",
      className: "text-center",
    },
    {
      title: t("ModifiedBy"),
      dataIndex: "modifiedBy",
      key: "modifiedBy",
      width: "30%",
      render: (text, record) => (
        <span>
          <img
            className="h-24 w-auto inline"
            alt="avatar"
            src={`${AVATAR_URL}${record.avatar}`}
          />
          {text}
        </span>
      ),
    },
    {
      title: t("Actions"),
      dataIndex: "id",
      key: "action",
      render: (id, record) => (
        <Space size="middle">
          {record.active ? (
            <Button className="border-0" onClick={(e) => handleBlock(e, id)}>
              <CloseCircleOutlined className="text-red-600" />
            </Button>
          ) : (
            <Button className="border-0" onClick={(e) => handleUnblock(e, id)}>
              <CheckOutlined className="text-green-500" />
            </Button>
          )}
        </Space>
      ),
      width: "5%",
    },
  ];
  const handleBlock = async (e, id) => {
    confirm({
      title: t("Annoucement"),
      icon: <ExclamationCircleOutlined />,
      content: t("PRICE.blockPackageMes"),
      async onOk() {
        try {
          setLoading(true);
          const blockRes = await blockPrice(id);
          if (blockRes.data.status === "success") {
            notification.success({
              message: t("PRICE.blockPackageSuccessMes"),
            });
            getPricesData();
          } else
            notification.error({ message: t("PRICE.blockPackageFailMes") });
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
      },
    });
  };
  const handleUnblock = async (e, id) => {
    confirm({
      title: "Thông báo",
      icon: <ExclamationCircleOutlined />,
      content: t("unblockPackageMes"),
      async onOk() {
        try {
          setLoading(true);
          const blockRes = await unblockPrice(id);
          if (blockRes.data.status === "success") {
            notification.success({
              message: t("PRICE.unblockPackageSuccessMes"),
            });
            getPricesData();
          } else
            notification.error({
              message: t("PRICE.unblockPackageFailMes"),
            });
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
      },
    });
  };
  const getPricesData = async () => {
    try {
      setLoading(true);
      const getPricesRes = await getPrices();
      let data = [];
      getPricesRes.data.data.reverse().map((dt, index) => {
        if (index === 0) {
          setLastChanged(day(dt.lastModified).format("DD/MM/YYYY"));
        }
        data.push({
          price:
            dt.currency === "VND"
              ? dt.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : dt.price,
          currency: dt.currency,
          lastModified: day(dt.lastModified).format("DD/MM/YYYY HH:mm"),
          modifiedBy: dt.modifiedBy.name,
          avatar: dt.modifiedBy.avatar,
          name: dt.name,
          id: dt._id,
          active: dt.active,
        });
      });
      setDataSource(data);
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
    setShow(true);
    getPricesData();
    return () => setShow(false);
  }, []);
  return (
    <QueueAnim leaveReverse type={"right"} className="queue-simple">
      {show ? (
        <Layout key="content">
          <Layout.Header className="top-0 sticky z-30">
            <CHeader
              title={t("NAVBAR.GreetingPrice")}
              description={t("NAVBAR.description") + lastChanged}
              showSwitch
            />
          </Layout.Header>
          <Layout.Content className="mt-5 mx-4">
            <Row>
              <ModalUpdatePrice
                setLoading={setLoading}
                getPricesData={getPricesData}
                visible={visible}
                setVisible={setVisible}
                loading={loading}
              />
              <ModalCreatePrice
                setLoading={setLoading}
                getPricesData={getPricesData}
                visible={modalCreateVisible}
                loading={loading}
                setVisible={setModalCreateVisible}
              />

              <Col className="flex justify-center mb-4" span={24}>
                <Button
                  onClick={() => setModalCreateVisible(true)}
                  className="h-12 mr-2 w-fit text-base"
                  type="primary"
                >
                  {t("PRICE.Create")}
                </Button>
                <Button
                  onClick={() => setVisible(true)}
                  className="h-12 w-fit text-base"
                  type="danger"
                >
                  {t("PRICE.Edit")}
                </Button>
              </Col>
              <Col className="flex justify-center" span={24}>
                {type === "list" ? (
                  <Table
                    className="table-user header-center header-bold select-blue mx-1 w-full"
                    bordered
                    loading={loading}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                      defaultPageSize: 10,
                      defaultCurrent: 1,
                      pageSizeOptions: [10, 20, 50, 100],
                      showQuickJumper: true,
                      showSizeChanger: true,
                      hideOnSinglePage: true,
                      onChange: () => {
                        window.scrollTo({
                          top: 0,
                          left: 0,
                          behavior: "smooth",
                        });
                      },
                    }}
                  />
                ) : (
                  <Row gutter={[8, 8]}>
                    {dataSource.map((price) => (
                      <Col span={4}>
                        <PriceCard price={price} />
                      </Col>
                    ))}
                  </Row>
                )}
              </Col>
            </Row>
          </Layout.Content>
        </Layout>
      ) : null}
    </QueueAnim>
  );
};
export default Price;
