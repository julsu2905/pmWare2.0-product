import React, { useEffect, useState } from "react";
import { Col, Row, Divider, notification } from "antd";
import "antd/dist/antd.css";
import "./page-css/Landingpage.css";
import "./page-css/Home.css";
import {
  CalendarOutlined
} from "@ant-design/icons";
import TableShowProject from "../components/HomePage/TableShowProject";
import DrawerLeft from "../components/components-layout/DrawerLeft";
import ModalAddProject from "../components/HomePage/ModalAddProject";
import { getUserProjects } from "../services/userServices";
import { useSelector } from "react-redux";

const Home = () => {
  const { dataLogin } = useSelector((state) => state.user);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const getProject = async () => {
    try {
      setLoading();
      const getProjectsRes = await getUserProjects(dataLogin.token);
      if (getProjectsRes.data.status === "success") {
       
        if (getProjectsRes.data.data.myProjects.length === 0)
          notification.info({ message: "Chưa có dự án!" }); 
        else {
          setProjects(getProjectsRes.data.data.myProjects);
        };
      }
      setLoading(false);
    } catch (error) {
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
    getProject();
  }, []);
  return (
    <>
      <Row className="row-home-content">
        <div className="drawer-left">
          <Col span={3}>
            <DrawerLeft />
          </Col>
        </div>
        <Col className="all-project" span={20}>
          <div className="project">
            <Row>
              <Col style={{ marginTop: "20px" }} offset={2} span={16}>
                <div>
                  <h1> <CalendarOutlined /> Dự án</h1>
                </div>
              </Col>
              <Col style={{ marginTop: "20px" }}>
                <ModalAddProject getProject={getProject} />
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col offset={3} span={20}>
                <TableShowProject
                  getProject={getProject}
                  loading={loading}
                  projects={projects}
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </>
  );
};
export default Home;
