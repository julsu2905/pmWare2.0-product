import React, { useState } from "react";
import { Col, Divider, Menu, Button, notification } from "antd";
import DrawerLeft from "./DrawerLeft";
import "antd/dist/antd.css";
import ModalAddMember from "./ModalSlidebar/ModalAddMember";
import ModalAddTask from "./ModalSlidebar/ModalAddTask";
import ModalAddSubTask from "./ModalSlidebar/ModalAddSubTask";
import ModalModerators from "./ModalSlidebar/ModalModerators";
import ModalTaskList from "./ModalSlidebar/ModalShowTaskList";
import ModalCloseProject from "./ModalSlidebar/ModalCloseProject";
import DrawerHistoryLog from "./DrawerHistoryLog";
import "../components-css/Slidebar.css";
import ModalShowMembers from "./ModalSlidebar/ModalShowMembers";
import ModalUpdateProject from "../HomePage/ModalUpdateProject";
import { useSelector } from "react-redux";
import {
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  MailOutlined,
  BulbOutlined,
} from "@ant-design/icons";
const { SubMenu } = Menu;
export default function Slidebar({
  setContent,
  options,
  tasks,
  project,
  logs,
  getDataProject,
}) {
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false);
  const [isModalAddSubTaskVisible, setIsModalAddSubTaskVisible] =
    useState(false);
  const [visibleHistoryLog, setVisibleHistoryLog] = useState(false);
  const showDrawerHistoryLog = () => {
    setVisibleHistoryLog(true);
  };
  const [isModalCloseProjectVisible, setIsModalCloseProjectVisible] =
    useState(false);

  const showModalCloseProject = () => {
    setIsModalCloseProjectVisible(true);
  };
  const [isModalTasksListVisible, setIsModalTasksListVisible] = useState(false);

  const showModalTasksList = () => {
    setIsModalTasksListVisible(true);
  };
  const [isModalShowMembersVisible, setIsModalShowMembersVisible] =
    useState(false);

  const showModalListMembers = () => {
    setIsModalShowMembersVisible(true);
  };
  const [isModalAddMemberVisible, setIsModalAddMemberVisible] = useState(false);
  const [isModalModeratorsVisible, setIsModalModeratorsVisible] =
    useState(false);

  const showModalModerators = () => {
    setIsModalModeratorsVisible(true);
  };
  const showModalAddSubTask = () => {
    setIsModalAddSubTaskVisible(true);
  };

  const showModal = () => {
    setIsModalAddMemberVisible(true);
  };
  const { dataLogin } = useSelector((state) => state.user);
  const { projectAdmin } = useSelector((state) => state.project);
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed({
      collapsed: collapsed,
    });
  };
  return (
    <>
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{ marginBottom: 16 }}
      >
        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
      </Button>
      <Menu
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        theme="light"
        inlineCollapsed={collapsed}
      >
        <SubMenu key="sub1" icon={<MailOutlined />} title="Bảng tính">
          <Menu.Item key="historyLog">
            <a onClick={showDrawerHistoryLog}>History Log</a>
            <DrawerHistoryLog
              logs={logs}
              visibleHistoryLog={visibleHistoryLog}
              setVisibleHistoryLog={setVisibleHistoryLog}
            />
          </Menu.Item>
          <Menu.Item key="kanban">
            <a onClick={() => setContent("kanban")}>
              <p>Kanban View</p>
            </a>
          </Menu.Item>
          <Menu.Item key="list">
            <a onClick={() => setContent("list")}>
              <p>List View</p>
            </a>
          </Menu.Item>
          <Menu.Item key="ganttChart">
            <a onClick={() => setContent("ganttChart")}>
              <p>Gantt Chart</p>
            </a>
          </Menu.Item>
          <Menu.Item key="members">
            <a onClick={showModalListMembers}>Member List</a>
            {project && (
              <ModalShowMembers
                options={options}
                project={project}
                isModalShowMembersVisible={isModalShowMembersVisible}
                setIsModalShowMembersVisible={setIsModalShowMembersVisible}
                getDataProject={getDataProject}
              />
            )}
          </Menu.Item>
          <Menu.Item key="tasksList">
            <a onClick={showModalTasksList}>Task List</a>
            <ModalTaskList
              tasks={tasks}
              project={project}
              isModalTasksListVisible={isModalTasksListVisible}
              setIsModalTasksListVisible={setIsModalTasksListVisible}
              getDataProject={getDataProject}
              options={options}
            />
          </Menu.Item>
        </SubMenu>
        <SubMenu key="" icon={<AppstoreOutlined />} title="Chức năng">
          {(project && project.archived === true) ||
          (project && project.active === false) ? (
            <Menu.Item disabled key="addMember">
              <a type="primary">Thêm thành viên</a>
            </Menu.Item>
          ) : (
            <Menu.Item key="addMember">
              <a type="primary" onClick={showModal}>
                Thêm thành viên
              </a>
              <ModalAddMember
                getDataProject={getDataProject}
                isModalVisible={isModalAddMemberVisible}
                setIsModalVisible={setIsModalAddMemberVisible}
                project={project}
                options={options}
              />
            </Menu.Item>
          )}
          {(project && project.archived === true) ||
          (project && project.active === false) ? (
            <Menu.Item disabled>
              <a type="primary">Thêm công việc</a>
            </Menu.Item>
          ) : (
            <Menu.Item key="addTask">
              <ModalAddTask
                project={project}
                getDataProject={getDataProject}
                tasks={tasks}
                options={options}
              />
            </Menu.Item>
          )}

          {(project && project.archived === true) ||
          (project && project.active === false) ? (
            <Menu.Item disabled>
              <a type="primary">Thêm SubTask</a>
            </Menu.Item>
          ) : (
            <Menu.Item key="subTask">
              <a onClick={showModalAddSubTask}>Thêm SubTask</a>
              {tasks &&
                tasks.map((task) => {
                  return (
                    <ModalAddSubTask
                      isModalAddSubTaskVisible={isModalAddSubTaskVisible}
                      setIsModalAddSubTaskVisible={setIsModalAddSubTaskVisible}
                      getDataProject={getDataProject}
                      tasks={tasks}
                      options={options}
                      project={project}
                      task={task}
                    />
                  );
                })}
            </Menu.Item>
          )}
          {(project && project.archived === true) ||
          (project && project.active === false) ? (
            <Menu.Item disabled>
              <a type="primary">Chỉnh sửa dự án</a>
            </Menu.Item>
          ) : (
            <Menu.Item key="UpdateProject">
              <a onClick={() => setModalUpdateVisible(true)}>Chỉnh sửa dự án</a>
              {modalUpdateVisible && (
                <ModalUpdateProject
                  setModalUpdateVisible={setModalUpdateVisible}
                  visible={modalUpdateVisible}
                  projectId={project._id}
                  projectAd={projectAdmin}
                />
              )}
            </Menu.Item>
          )}

          {(project && project.archived === true) ||
          (project && project.active === false) ? (
            <Menu.Item disabled>
              <a type="primary">Đóng dự án</a>
            </Menu.Item>
          ) : (
            <Menu.Item key="closeSubTask">
              <a onClick={showModalCloseProject}>Đóng dự án</a>
              <ModalCloseProject
                project={project}
                getDataProject={getDataProject}
                isModalCloseProjectVisible={isModalCloseProjectVisible}
                setIsModalCloseProjectVisible={setIsModalCloseProjectVisible}
              />
            </Menu.Item>
          )}
        </SubMenu>
        <SubMenu icon={<BulbOutlined />} title="Nâng cao">
          {(project && project.archived === true) ||
          (project && project.active === false) ? (
            <Menu.Item disabled>
              <a type="primary">Ủy quyền</a>
            </Menu.Item>
          ) : (
            <Menu.Item>
              {dataLogin.data.premium !== 0 ? (
                <p>
                  <a onClick={showModalModerators}>Ủy quyền</a>
                  <ModalModerators
                    isModalModeratorsVisible={isModalModeratorsVisible}
                    setIsModalModeratorsVisible={setIsModalModeratorsVisible}
                    options={options}
                    project={project}
                    getDataProject={getDataProject}
                  />
                </p>
              ) : (
                <p>
                  <a disabled onClick={showModalModerators}>
                    Uỷ quyền
                  </a>
                </p>
              )}
            </Menu.Item>
          )}
        </SubMenu>
      </Menu>
      <DrawerLeft />
    </>
  );
}
