import React, { useEffect, useState } from "react";
import { Col, Row, Divider, Tag,Popover } from "antd";
import "../components-css/ProjectPage/KanbanView.css";
import DragNDrop from "../KanbanView/DragNDrop";
import { useDispatch, useSelector } from "react-redux";
import {
  UserOutlined,
  UsergroupAddOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { selectProject } from "../../redux/actions/projectActions";
import ModalShowModerators from "./ModalShowModerators";

export default function KanbanView({ project, members, getDataProject }) {
  const [isModalModeratorsVisible, setIsModalModeratorsVisible] =
    useState(false);

  const showModalModerators = () => {
    setIsModalModeratorsVisible(true);
  };
  const dispatch = useDispatch();
  const projectStore = useSelector((state) => state.project);
  useEffect(() => {
    getDataProject();
    dispatch(selectProject({ ...projectStore, projectMembers: members }));
  }, []);
  return (
    <>
      <div className="kanban-content">
        <Row className="row-kanban-content">
          <Col className="all-project" span={23}>
            <div>
              <Row>
                <Col style={{ marginTop: "20px" }} offset={1} span={6}>
                  <h2 style={{ textTransform: "uppercase", fontSize: "32px" }}>
                    {" "}
                    {project && project.name}
                  </h2>
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
                              {" "}
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
                {project.projectTasks &&
                  project.projectTasks.map((task) => {
                    return (
                      <Col key={task._id} span={24}>
                        <DragNDrop
                          getDataProject={getDataProject}
                          members={members}
                          project={project}
                          task={task}
                        />
                      </Col>
                    );
                  })}
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}
