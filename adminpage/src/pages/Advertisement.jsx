import {
  Col,
  Layout,
  notification,
  Row,
  Table,
  Button,
  Modal,
  Carousel,
} from "antd";
import QueueAnim from "rc-queue-anim";
import { useEffect, useState } from "react";
import CHeader from "./../components/layout/CHeader";
import day from "dayjs";
import {
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "./page-css/Table.css";
import { BANNER_URL } from "../constants/apiConfig";
import { getBanners, removeBanner } from "../services/bannerServices";
import { DeleteOutlined } from "@ant-design/icons";
import ModalAddBanner from "../components/Banner/ModalAddBanner";
import { getAllAds } from "./../services/adsServices";
const { confirm } = Modal;

const Advertisement = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastChanged, setLastChanged] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [dataCarousel, setDataCarousel] = useState([]);
  const [visible, setVisible] = useState(false);
  const handleRemove = async (e, bannerId) => {
    confirm({
      title: "Alert",
      icon: <ExclamationCircleOutlined />,
      content: `Do you want to remove this banner from live?`,
      async onOk() {
        try {
          setLoading(true);
          const removeBannerRes = await removeBanner(bannerId);
          if (removeBannerRes.data.status === "success") {
            notification.success({
              message: "Remove Banner from live successfully!",
            });
            getAdsData();
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
      },
    });
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      className: "text-center",
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      className: "text-center",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      className: "text-center",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: "20%",
      className: "flex justify-center",
      render: (text) => (
        <img className="w-3/4 h-32" alt={text} src={BANNER_URL + text} />
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      className: "text-center",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      className: "text-center",
    },
    {
      title: "Live",
      dataIndex: "active",
      key: "active",
      className: "text-center",
      render: (text) =>
        text ? (
          <CheckOutlined className="text-green-500" />
        ) : (
          <CloseOutlined className="text-red-500" />
        ),
    },
    {
      title: "Last Modified",
      dataIndex: "lastModified",
      key: "lastModified",
      className: "text-center",
    },
    {
      title: "Modified By",
      dataIndex: "modifiedBy",
      key: "modifiedBy",
    },
    {
      title: "Actions",
      key: "action",
      className: "text-center",
      render: (text, record) => (
        <Button
          className="border-0"
          onClick={(e) => handleRemove(e, record.bannerId)}
        >
          <DeleteOutlined className="text-red-600" />
        </Button>
      ),
    },
  ];
  const getAdsData = async () => {
    try {
      setLoading(true);
      const getAdsRes = await getAllAds();
      let data = [];
      let dataCarousel = [];
      getAdsRes.data.data.reverse().map((dt, index) => {
        if (index === 0) {
          setLastChanged(day(dt.createdDate).format("DD/MM/YYYY"));
        }

        data.push({
          image: dt.image,
          createdDate: day(dt.createdDate).format("DD/MM/YYYY"),
          createdBy: dt.createdBy.name,
          bannerId: dt._id,
          active: dt.active,
        });
      });
      setDataSource(data);
      setDataCarousel(dataCarousel);
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
    getAdsData();
    return () => setShow(false);
  }, []);
  return (
    <QueueAnim leaveReverse type={"right"} className="queue-simple">
      {show ? (
        <Layout key="content">
          <Layout.Header className="top-0 sticky z-30">
            <CHeader
              title={"Welcome to Banner management"}
              description={"Last changed " + lastChanged}
              showSearch
              searchType="banner"
            />
          </Layout.Header>
          <Layout.Content className="mt-5 mx-4">
            <ModalAddBanner
              setLoading={setLoading}
              getBannersData={getAdsData}
              visible={visible}
              setVisible={setVisible}
            />
            <Row>
              <Col className="flex justify-center mb-4" span={24}>
                <p className="text-3xl font-mono">Live Preview</p>
              </Col>
              <Col className="flex justify-center mb-4" span={24}>
                <img />
              </Col>
              <Col className="flex justify-center mb-4" span={24}>
                <Button
                  onClick={() => setVisible(true)}
                  className="h-12 w-fit text-base"
                  type="primary"
                >
                  Add Banner
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
export default Advertisement;
