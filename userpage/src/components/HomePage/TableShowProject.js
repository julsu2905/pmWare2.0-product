import React, { useState } from "react";
import "antd/dist/antd.css";
import CardAllProject from "./CardProject";
import "../../pages/page-css/Home.css";
import { useSelector } from "react-redux";
import { Tabs, Row, Col, Button, Skeleton } from "antd";

const { TabPane } = Tabs;

const TableShowProject = ({ projects, loading, getProject }) => {
  const { dataLogin } = useSelector((state) => state.user);
  const [loadmore, setLoadmore] = useState(4);
  const showMoreProject = () => {
    setLoadmore((preValue) => preValue + 4);
  };
  return (
    <>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Tất cả" key="1">
          <Skeleton loading={loading}>
            <Row>
              {projects.slice(0, loadmore).map(
                (project) =>
                  project && (
                    <Col key={project._id} className="cards">
                      <CardAllProject
                        getProject={getProject}
                        project={project}
                      />
                    </Col>
                  )
              )}
            </Row>
          </Skeleton>
          <Row style={{ marginTop: "30px" }}>
            <Col offset={10} xl={12} span={24}>
              <Button
                style={{ alignItems: "center" }}
                onClick={showMoreProject}
              >
                Load more...
              </Button>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Dự án đang quản lý" key="4">
          <Skeleton loading={loading}>
            <Row>
              {projects.slice(0, loadmore).map(
                (project) =>
                  project.admin === dataLogin.data._id && (
                    <Col key={project._id} className="cards">
                      <CardAllProject
                        getProject={getProject}
                        projectAd={project.admin_id}
                        project={project}
                      />
                    </Col>
                  )
              )}
            </Row>
          </Skeleton>
        </TabPane>
        <TabPane tab=" Dự án đang tham gia" key="5">
          <Skeleton loading={loading}>
            <Row>
              {projects.slice(0, loadmore).map((project) => (
                <Col key={project._id} className="cards">
                  <CardAllProject getProject={getProject} project={project} />
                </Col>
              ))}
            </Row>
          </Skeleton>
        </TabPane>
        <TabPane tab="Hoạt động" key="2">
          <Skeleton loading={loading}>
            <Row>
              {projects.slice(0, loadmore).map(
                (project) =>
                  project.active === true && (
                    <Col key={project._id} className="cards">
                      <CardAllProject
                        getProject={getProject}
                        project={project}
                      />
                    </Col>
                  )
              )}
            </Row>
          </Skeleton>
        </TabPane>
        <TabPane tab="Lưu trữ" key="3">
          <Skeleton loading={loading}>
            <Row>
              {projects.slice(0, loadmore).map(
                (project) =>
                  project.archived === true && (
                    <Col key={project._id} className="cards">
                      <CardAllProject
                        getProject={getProject}
                        project={project}
                      />
                    </Col>
                  )
              )}
            </Row>
          </Skeleton>
        </TabPane>
        <TabPane tab="Đã đóng" key="6">
          <Skeleton loading={loading}>
            <Row>
              {projects.slice(0, loadmore).map(
                (project) =>
                  project.active === false && (
                    <Col key={project._id} className="cards">
                      <CardAllProject
                        getProject={getProject}
                        project={project}
                      />
                    </Col>
                  )
              )}
            </Row>
          </Skeleton>
        </TabPane>
      </Tabs>
    </>
  );
};

export default TableShowProject;
