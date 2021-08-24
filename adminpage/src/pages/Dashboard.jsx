import { Row, Col, Layout, notification, Table } from "antd";
import {
  UserOutlined,
  CarryOutOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import QueueAnim from "rc-queue-anim";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import CHeader from "./../components/layout/CHeader";
import { getAllUsers } from "../services/userServices";
import { getAllProjects } from "./../services/projectServices";
import "./page-css/Dashboard.css";
import StatusCard from "./../components/DashBoard/StatusCard";
import { getOrders } from "./../services/orderServices";
import day from "dayjs";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const [show, setShow] = useState(false);
  const [totalUser, setTotalUser] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const { t } = useTranslation("translation");
  const [totalProject, setTotalProject] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [dataChart, setDataChart] = useState([]);

  const date = new Date();
  let thisMonth = date.getMonth() + 1;
  let months = [];
  for (let i = 1; i <= thisMonth; i++) {
    months.push(i);
  }

  const getData = async () => {
    try {
      setLoading(true);
      const getAllUsersRes = await getAllUsers();
      const getAllProjectRes = await getAllProjects();
      const getAllOrdersRes = await getOrders();
      let _totalIncome = 0;
      let _data = [];
      let _dataChart = [];
      months.forEach((dt) => _dataChart.push(0));
      getAllOrdersRes.data.data.forEach((dt, index) => {
        _totalIncome += dt.bill;
        months.forEach((month) => {
          if (month == day(dt.createdDate).format("MM")) {
            _dataChart[month - 1] += dt.bill;
          } else _dataChart[month - 1] = 0;
        });

        _data.push({
          key: ++index,
          name: dt.user.name,
          package: dt.items[0].code.premium + " premium",
          bill: dt.bill,
          createdDate: day(dt.createdDate).format("DD/MM/YYYY HH:mm"),
        });
      });
      setDataSource(_data.slice(0, 4));
      setTotalIncome(
        "$" + _totalIncome.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
      setTotalUser(getAllUsersRes.data.results);
      setTotalProject(getAllProjectRes.data.results);
      setDataChart(_dataChart);
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
    getData();
    return () => setShow(false);
  }, []);

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
      x: {
        display: true,
        title: {
          display: true,
          text: "Months",
        },
      },
    },
  };
  const columns = [
    {
      title: "",
      dataIndex: "key",
      key: "key",
      className: "text-center",
    },
    {
      title: t("User"),
      dataIndex: "name",
      key: "name",
      className: "text-center",
    },
    {
      title: t("DASHBOARD.TotalBill"),
      dataIndex: "bill",
      key: "bill",
      className: "text-center",
    },
    {
      title: t("DASHBOARD.Package"),
      dataIndex: "package",
      key: "package",
      className: "text-center",
    },
    {
      title: t("DASHBOARD.Date"),
      dataIndex: "createdDate",
      key: "createdDate",
      className: "text-center",
    },
  ];
  return (
    <QueueAnim leaveReverse type={"right"} className="queue-simple">
      {show ? (
        <Layout key="content">
          <Layout.Header className="top-0 sticky z-30">
            <CHeader
              className="h-full"
              title={t("NAVBAR.GreetingDashboard")}
              description={`${t("NAVBAR.description")} ${day().format(
                "DD/MM/YYYY HH:mm"
              )}`}
            />
          </Layout.Header>
          <Layout.Content className="my-5">
            <Row>
              <Col span={12}>
                <Row>
                  <Col className="flex justify-center" span={24}>
                    <StatusCard
                      className="w-full mx-10"
                      icon={<CarryOutOutlined />}
                      title={t("DASHBOARD.TotalProject")}
                      count={totalProject}
                    />
                    <StatusCard
                      className="w-full mx-10"
                      icon={<UserOutlined />}
                      title={t("DASHBOARD.TotalUser")}
                      count={totalUser}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col className="flex justify-evenly" span={24}>
                    <StatusCard
                      className="w-full mx-10"
                      icon={<DollarOutlined />}
                      title={t("DASHBOARD.TotalIncome")}
                      count={totalIncome}
                    />
                  </Col>
                </Row>
              </Col>
              <Col
                className="card-dashboard border-gray-300 border py-6 px-8"
                span={11}
              >
                <h3 className="text-center font-bold text-xl">
                  {t("DASHBOARD.Sales")}
                </h3>
                <Bar
                  data={{
                    labels: months,
                    datasets: [
                      {
                        label: "Sales",
                        data: [...dataChart],
                        backgroundColor: [
                          "rgba(255, 99, 132, 0.2)",
                          "rgba(54, 162, 235, 0.2)",
                          "rgba(255, 206, 86, 0.2)",
                          "rgba(75, 192, 192, 0.2)",
                          "rgba(153, 102, 255, 0.2)",
                          "rgba(255, 159, 64, 0.2)",
                        ],
                        borderColor: [
                          "rgba(255, 99, 132, 1)",
                          "rgba(54, 162, 235, 1)",
                          "rgba(255, 206, 86, 1)",
                          "rgba(75, 192, 192, 1)",
                          "rgba(153, 102, 255, 1)",
                          "rgba(255, 159, 64, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={options}
                />
              </Col>
            </Row>
            <Row>
              <Col className="mx-4" span={11}>
                <p className="text-center text-xl mb-4 font-semibold">
                  {t("DASHBOARD.LastestOrders")}
                </p>
                <Table
                  className="header-center header-bold"
                  loading={loading}
                  dataSource={dataSource}
                  columns={columns}
                  pagination={false}
                />
              </Col>
            </Row>
          </Layout.Content>
        </Layout>
      ) : null}
    </QueueAnim>
  );
};
export default Dashboard;
