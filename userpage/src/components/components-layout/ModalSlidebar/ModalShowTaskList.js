import React, { useEffect, useState } from "react";
import { Modal, Table, Space, notification, Button, Popover, Tag } from "antd";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTask } from "../../../redux/actions/taskAction";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { deleteTask } from "../../../services/userServices";
import {
  RestOutlined,
  SettingOutlined,
  SyncOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import confirm from "antd/lib/modal/confirm";
import DayJS from "dayjs";
export default function ModalTaskList({
  isModalTasksListVisible,
  setIsModalTasksListVisible,
  getDataProject,
  project,
  options,
}) {
  const [loading, setLoading] = useState(false);
  const { dataLogin } = useSelector((state) => state.user);
  const [dataSource, setDataSource] = useState([]);
  const isModerator = () => {
    var found = false;
    for (var i = 0; i < project.moderators.length; i++) {
      if (project.moderators[i]._id == dataLogin.data._id) {
        found = true;
        break;
      }
    }
    return found;
  };
  const showModalDeleteTask = (e, taskId) => {
    confirm({
      title: "Thông báo",
      icon: <ExclamationCircleOutlined />,
      content: (
        <p>
          Bạn có chắc chắn muốn
          <span style={{ color: "red", fontWeight: "bold" }}> XÓA</span> công
          việc này ra khỏi dự án
        </p>
      ),
      async onOk() {
        try {
          setLoading(true);
          if (project.admin._id === dataLogin.data._id || isModerator()) {
            const deleteTaskRes = await deleteTask(
              taskId,
              project._id,
              dataLogin.token
            );
            if (deleteTaskRes.data.status === "success") {
              notification.success({ message: "Xóa công việc thành công!" });
              getDataProject();
            }
          } else if (project.admin._id !== dataLogin.data._id) {
            notification.error({
              message: "Bạn không có quyền xóa công việc trong dự án này",
            });
          }
        } catch (error) {
          notification.error({ message: error.response.data.message });
        } finally {
          setLoading(false);
        }
      },
    });
  };
  const history = useHistory();
  const dispatch = useDispatch();

  const linkToUpdateTask = (e, record, project) => {
    dispatch(
      selectTask({
        id: record.id,
        code: record.code,
        name: record.name,
        description: record.description,
        dueDate: record.dueDate,
        startDate: record.startDate,
        priority: record.priority,
        project: record.projectId,
        watchers: record.watchers,
        prerequisiteTasks: record.prerequisiteTasks,
        subTasks: record.subTasks,
        members: options,
        projectModerators: project.moderators,
      })
    );
    localStorage.setItem(
      "task",
      JSON.stringify({
        id: record.id,
        code: record.code,
        name: record.name,
        description: record.description,
        dueDate: record.dueDate,
        startDate: record.startDate,
        priority: record.priority,
        project: record.projectId,
        watchers: record.watchers,
        prerequisiteTasks: record.prerequisiteTasks,
        subTasks: record.subTasks,
        members: options,
        projectModerators: project.moderators,
      })
    );
    history.push(`/task/${record.name}`);
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      className: "text-center",
      fixed: "left",
    },
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      className: "text-center",
      fixed: "left",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      className: "text-center",
      fixed: "left",
    },

    {
      title: "Số lượng Subtask",
      dataIndex: "subTasksLength",
      key: "subTasksLength",
      className: "text-center",
    },
    {
      title: "Người giám sát",
      key: "watchers",
      dataIndex: "watchers",
      className: "text-center",

      render: (watchers) =>
        watchers.map((watcher, index) => (
          <span>
            {watcher.label}
            {index !== watchers.length - 1 && ", "}
          </span>
        )),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      className: "text-center",
      render: (startDate) => (
        <Tag icon={<SyncOutlined spin />} color="processing">
          {startDate}
        </Tag>
      ),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "dueDate",
      key: "dueDate",
      className: "text-center",
      render: (dueDate) => (
        <Tag icon={<MinusCircleOutlined />} color="default">
          {dueDate}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (text, record) => (
        <Space size="middle">
          {project.admin._id !== dataLogin.data._id || !isModerator() || (project && project.archived === true) ||
          (project && project.active === false) ? (
            <a disabled>
            <Popover content="Sửa">
              <SettingOutlined style={{ color: "blue" }} />
            </Popover>{" "}
          </a>
          
          ) : (
            <a onClick={(e) => linkToUpdateTask(e, record, project)}>
              <Popover content="Sửa">
                <SettingOutlined style={{ color: "blue" }} />
              </Popover>{" "}
            </a>
          )}
          {(project && project.archived === false) ||
          (project && project.active === true) ? (
            <a
              loading={loading}
              onClick={(e) => showModalDeleteTask(e, record.id)}
            >
              <Popover content="Xóa">
                {" "}
                <RestOutlined style={{ color: "red" }} />
              </Popover>
            </a>
          ) : (
            <a disabled>
              <Popover content="Xóa">
                {" "}
                <RestOutlined style={{ color: "red" }} />
              </Popover>
            </a>
          )}
        </Space>
      ),
    },
  ];

  const loadData = () => {
    if (project !== undefined) {
      let data = [];
      project.projectTasks.map((dt, i) => {
        let listWatchers = [];
        dt.watchers.forEach((watcher) =>
          listWatchers.push({ label: watcher.name, value: watcher._id })
        );
        data.push({
          index: ++i,
          code: dt.code,
          name: dt.name,
          subTasksLength: dt.subTasks.length,
          watchers: listWatchers,
          id: dt._id,
          description: dt.description,
          startDate: DayJS(dt.startDate).format("DD/MM/YYYY"),
          dueDate: DayJS(dt.dueDate).format("DD/MM/YYYY"),
          priority: dt.priority,
          projectId: dt.project,
          subTasks: dt.subTasks,
        });
      });
      setDataSource(data);
    }
  };
  const handleOk = () => {
    setIsModalTasksListVisible(false);
  };

  const handleCancel = () => {
    setIsModalTasksListVisible(false);
  };

  useEffect(() => {
    loadData();
  }, [project]);
  return (
    <>
      <Modal
        width={1000}
        title={<p className="title-modal">Danh sách gói công việc lớn</p>}
        visible={isModalTasksListVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Table
          pagination={{ hideOnSinglePage: true }}
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1300 }}
        />
      </Modal>
    </>
  );
}
