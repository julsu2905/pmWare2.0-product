import { Col, Layout, notification, Row, Table, Button } from "antd";
import QueueAnim from "rc-queue-anim";
import { useEffect, useState } from "react";
import CHeader from "../components/layout/CHeader";
import day from "dayjs";
import "./page-css/Table.css";
import { AVATAR_URL } from "../constants/apiConfig";
import ModalCreateCode from "../components/Code/ModalCreateCode";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { getCodes } from "../services/codeServices";
const Code = () => {
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastChanged, setLastChanged] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const columns = [
    {
      title: "",
      dataIndex: "index",
      key: "index",
      width: "3%",
      className: "text-center",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      width: "10%",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      className: "text-center",
    },
    {
      title: "Premium Days",
      dataIndex: "premium",
      key: "premium",
      width: "5%",
      className: "text-center",
    },
    {
      title: "Available",
      dataIndex: "activated",
      key: "activated",
      width: "3%",
      className: "text-center",
      render: (text) =>
        !text ? (
          <CheckOutlined className="text-green-500" />
        ) : (
          <CloseOutlined className="text-red-500" />
        ),
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      width: "10%",
      className: "text-center",
    },
    {
      title: "Used By",
      dataIndex: "userActivate",
      key: "userActivate",
      width: "20%",
      render: (text, record) =>
        record.userActivate && (
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
      title: "Activated Date",
      dataIndex: "activatedDate",
      key: "activatedDate",
      width: "20%",
    },
  ];
  const getCodeData = async () => {
    try {
      setLoading(true);
      const getCodesRes = await getCodes();
      let data = [];
      getCodesRes.data.data.reverse().map((dt, index) => {
        if (index === 0) {
          setLastChanged(day(dt.createdDate).format("DD/MM/YYYY HH:mm"));
        }

        data.push({
          index: ++index,
          createdDate: day(dt.createdDate).format("DD/MM/YYYY HH:mm"),
          code: dt.code,
          userActivate: dt.userActivate === null ? "" : dt.userActivate.name,
          avatar: dt.userActivate && dt.userActivate.avatar,
          premium: dt.premium,
          createdBy: dt.createdBy && dt.createdBy.name,
          activatedDate:
            dt.activatedDate === null
              ? ""
              : day(dt.activatedDate).format("DD/MM/YYYY HH:mm"),
          activated: dt.activated,
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
    getCodeData();
    return () => setShow(false);
  }, []);
  return (
    <QueueAnim leaveReverse type={"right"} className="queue-simple">
      {show ? (
        <Layout key="content">
          <Layout.Header className="top-0 sticky z-30">
            <CHeader
              title={"Welcome to Code management"}
              description={"Last changed " + lastChanged}
              showSearch
              searchType="code"
            />
          </Layout.Header>
          <Layout.Content className="mt-5 mx-4">
            <Row>
              <ModalCreateCode
                setLoading={setLoading}
                getCodeData={getCodeData}
                visible={visible}
                setVisible={setVisible}
              />
              <Col className="flex justify-center mb-4" span={24}>
                <Button
                  onClick={() => setVisible(true)}
                  className="h-12 w-fit text-base"
                  type="primary"
                >
                  Create Code
                </Button>
              </Col>
              <Col className="flex justify-center" span={24}>
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
              </Col>
            </Row>
          </Layout.Content>
        </Layout>
      ) : null}
    </QueueAnim>
  );
};
export default Code;
