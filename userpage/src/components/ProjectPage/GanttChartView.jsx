import React, { useEffect, useState } from "react";
import { Col, Row, Divider, Tag,Popover } from "antd";
import "../components-css/ProjectPage/GanttChart.css";
import { UserOutlined, UsergroupAddOutlined,SettingOutlined } from "@ant-design/icons";
import ModalShowModerators from "./ModalShowModerators";
import { Gantt } from "@dhtmlx/trial-react-gantt";
export default function GanttChart({ project,getDataProject }) {
  const [isModalModeratorsVisible, setIsModalModeratorsVisible] =
    useState(false);

  const showModalModerators = () => {
    setIsModalModeratorsVisible(true);
  };
  const [subTasks, setSubTasks] = useState([]);

  const getDataAllTasks = async () => {
    try {
      if (project !== undefined) {
        let data = [];
        project.projectTasks.map((task) => {
          task.subTasks.map((subTask) => {
            data.push({
              text: subTask.name,
              id: subTask._id,
              start_date: subTask.startDate,
              end_date: subTask.dueDate,
              type: "project",
            });
          });
        });
        setSubTasks(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDataAllTasks();
  }, []);
  useEffect(() => {
    getDataAllTasks();
  }, [project]);
  console.log(subTasks);
  const columns = [
    { name: "text", label: "SubTask name", width: "100%" },
    { name: "start", label: "Ngày bắt đầu", align: "center" },
    { name: "end", label: "Ngày kết thúc", align: "center" },
    { name: "duration", label: "Duration", width: "100px", align: "center" },
  ];
  const links = [{ source: 2, target: 1, type: 0 }];

  return (
    <>
      <div className="kanban-content">
        <Row className="row-kanban-content">
          <Col className="all-project" span={23}>
            <div>
              <Row>
                <Col style={{ marginTop: "20px" }} offset={1} span={6}>
                  <h1 style={{ textTransform: "uppercase" }}>
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
                <Col style={{ minHeight: "500px" }} span={24}>
                  <Gantt columns={columns} tasks={subTasks} links={links} />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}
