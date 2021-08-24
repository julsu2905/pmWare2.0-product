/* eslint-disable */
import React, { useState } from "react";
import { Col, Row, Divider, Tag, Popover } from "antd";
import "../components-css/ProjectPage/ListView.css";
import TableListView from "../ListView/TableListView";
import ModalShowModerators from "./ModalShowModerators";
import {
  CalendarOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  SettingOutlined,
} from "@ant-design/icons";
export default function ListView({
  options,
  tasks,
  getDataProject,
  project,
  loading,
}) {
  const [isModalModeratorsVisible, setIsModalModeratorsVisible] =
    useState(false);

  const showModalModerators = () => {
    setIsModalModeratorsVisible(true);
  };
  return (
    <Row className="row-list-content">
      <Col className="list-view-project" span={23}>
        <Row>
          <Col style={{ marginTop: "20px" }} offset={1} span={6}>
            <CalendarOutlined style={{ fontSize: "24px" }} />
            <h1
              style={{
                textTransform: "uppercase",
                fontFamily: "monospace",
                fontWeight: "bold",
              }}
            >
              {project && project.name}
            </h1>
          </Col>
          <Col className="box-moderator" span={7} offset={10}>
            <Row style={{ paddingTop: "10px" }}>
              <Col span={12}>
                <UserOutlined /> <b>Admin</b>
              </Col>
              <Col span={12}>
                <Tag color="blue">{project && project.admin.name}</Tag>
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col span={12}>
                <UsergroupAddOutlined /> <b>Moderators</b>
              </Col>
              <Col className="croll-moderators" span={12}>
                {project &&
                  project.moderators.map((moderator) => {
                    return (
                      <div>
                        <p>
                          <Tag color="green">{moderator.name}</Tag>
                        </p>
                        <hr />
                      </div>
                    );
                  })}
              </Col>
            </Row>
            <Row>
              <Col style={{ marginTop: "-40px" }} key="moderators" span={12}>
                {(project && project.archived === true) ||
                (project && project.active === false) ? (
                  <Popover content="Sửa">
                    <a disabled>
                      <SettingOutlined />
                    </a>
                  </Popover>
                ) : (
                  <div>
                    <Popover content="Sửa">
                      <a onClick={showModalModerators}>
                        <SettingOutlined />
                      </a>
                    </Popover>
                    {project && (
                      <ModalShowModerators
                        project={project}
                        getDataProject={getDataProject}
                        isModalModeratorsVisible={isModalModeratorsVisible}
                        setIsModalModeratorsVisible={
                          setIsModalModeratorsVisible
                        }
                      />
                    )}
                  </div>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider />

        <Row>
          <Col className="tableListView" offset={1} span={20}>
            <TableListView
              loading={loading}
              options={options}
              project={project}
              getDataProject={getDataProject}
              task={tasks}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
