import React, { useEffect, useState } from "react";
import { Table, Space, Tag, notification, Popover, Select, Button } from "antd";
import DayJS from "dayjs";
import "../components-css/ProjectPage/ListView.css";
import { useHistory } from "react-router-dom";
import ModalDeleteSubTask from "./ModalDeleteSubTask";
import { selectSubTask } from "../../redux/actions/subTaskAction.js";
import { changeAssign, changeStatus } from "../../services/userServices";
import { useSelector, useDispatch } from "react-redux";
import {
  RestOutlined,
  SettingOutlined,
  MinusCircleOutlined,
  SyncOutlined,
  NotificationOutlined,
  InfoOutlined
} from "@ant-design/icons";

export default function TableListView({ project, getDataProject, loading }) {
  const [isModalDeleteSubTaskVisible, setIsModalDeleteSubTaskVisible] =
    useState(false);
  const showModalDeleteSubTask = () => {
    setIsModalDeleteSubTaskVisible(true);
  };

  const { dataLogin } = useSelector((state) => state.user);
  const history = useHistory();
  const dispatch = useDispatch();

  const linkToUpdateSubTask = (e, record, project) => {
    dispatch(
      selectSubTask({
        id: record.subTaskId,
        assignee: record.assignee,
        assigneeId: record.assigneeId,
        code: record.code,
        description: record.description,
        dueDate: record.dueDate,
        name: record.name,
        startDate: record.startDate,
        status: record.status,
        task: record.task,
        taskId: record.taskId,
        projectName: project.name,
        projectModerators: project.moderators,
      })
    );
    localStorage.setItem(
      "subTask",
      JSON.stringify({
        id: record.subTaskId,
        assignee: record.assignee,
        assigneeId: record.assigneeId,
        code: record.code,
        description: record.description,
        dueDate: record.dueDate,
        name: record.name,
        startDate: record.startDate,
        status: record.status,
        task: record.task,
        taskId: record.taskId,
        projectName: project.name,
        projectModerators: project.moderators,
      })
    );
    history.push(`/subTask/${record.name}`);
  };
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
  const handleChangeStatus = async (e, subTaskId, prevValue, assigneeId) => {
    try {
      if (
        project.admin._id === dataLogin.data._id ||
        isModerator() ||
        dataLogin.data._id === assigneeId
      ) {
        const changeStatusRes = await changeStatus(
          subTaskId,
          project._id,
          e,
          dataLogin.token
        );

        if (changeStatusRes.data.status === "success") {
          {
            notification.success({
              message: "Cập nhật công việc nhỏ thành công!",
            });
            getDataProject();
          }
        }
      } else {
        e = prevValue;
        notification.error({
          message: "Bạn không có quyền sửa đổi công việc này",
        });
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
    }
  };
  const handleChangeAssign = async (e, subTaskId, assigneeId) => {
    try {
      if (project.admin._id === dataLogin.data._id || isModerator()) {
        const changeAssignRes = await changeAssign(
          subTaskId,
          project._id,
          e,
          dataLogin.token
        );
        if (changeAssignRes.data.status === "success") {
          {
            notification.success({
              message: "Cập nhật thành viên thành công!",
            });
            getDataProject();
          }
        }
      } else if (project.admin._id !== dataLogin.data._id) {
        notification.error({
          message: "Bạn không có quyền sửa đổi thành viên cho công việc này",
        });
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
    }
  };
  const columns = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      fixed: "left",
      render: (text, record) => {
        return (
          <div>
            {now.diff(record.dueDate, "days") > -1 ? (
              <div className="expiration-date">
                {record.code}
                <br />
                <div className="noti-expiration-date">
                  <Popover
                    content={
                      <div>
                        {now.diff(record.dueDate, "days") > 0 ? (
                          <p>
                            {" "}
                            Đã hết hạn{" "}
                            {now.diff(record.dueDate, "days") + " ngày trước"}
                          </p>
                        ) : (
                          <p>
                            {now.diff(record.dueDate, "hours") * -1 +
                              " giờ nữa hết hạn"}
                          </p>
                        )}
                      </div>
                    }
                  >
                    <a>
                      <InfoOutlined style={{ color: "red",fontSize:"18px", fontWeight:"bold" }} />
                    </a>
                  </Popover>
                </div>
              </div>
            ) : (
              <div>
                {record.code}
                <br />
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      fixed: "left",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      fixed: "left",
      className: "text-center",
    },
    {
      title: "Phân công",
      dataIndex: "assignee",
      key: "assignee",
      className: "text-center",
      render: (text, record) => {
        return (
          <div>
            {(project && project.archived === true) ||
            (project && project.active === false) ? (
              <Popover content="Thay đổi người phân công">
                <Select disabled style={{ width: "100%" }} defaultValue={text}>
                  {project.members.map((member) => {
                    if (member._id !== record.assigneeId) {
                      return (
                        <Select.Option value={member._id}>
                          {member.name}
                        </Select.Option>
                      );
                    }
                  })}
                </Select>
              </Popover>
            ) : (
              <Popover content="Thay đổi người phân công">
                <Select
                  onChange={(e) =>
                    handleChangeAssign(e, record.subTaskId, record.assigneeId)
                  }
                  style={{ width: "100%" }}
                  defaultValue={text}
                >
                  {project.members.map((member) => {
                    if (member._id !== record.assigneeId) {
                      return (
                        <Select.Option value={member._id}>
                          {member.name}
                        </Select.Option>
                      );
                    }
                  })}
                </Select>
              </Popover>
            )}
          </div>
        );
      },
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      className: "text-center",
      render: (text, record) => {
        return (
          <div>
            {(project && project.archived === true) ||
            (project && project.active === false) ? (
              <Popover content="Thay đổi trạng thái công việc">
                <Select disabled style={{ width: "100%" }} defaultValue={text}>
                  <Select.Option value="assigned">Assigned</Select.Option>
                  <Select.Option value="working">In Progress</Select.Option>
                  <Select.Option value="pending">Review</Select.Option>
                  <Select.Option value="done">Done</Select.Option>
                </Select>
              </Popover>
            ) : (
              <Popover content="Thay đổi trạng thái công việc">
                <Select
                  onChange={(e) =>
                    handleChangeStatus(
                      e,
                      record.subTaskId,
                      text,
                      record.assigneeId
                    )
                  }
                  style={{ width: "100%" }}
                  defaultValue={text}
                >
                  <Select.Option value="assigned">Assigned</Select.Option>
                  <Select.Option value="working">In Progress</Select.Option>
                  <Select.Option value="pending">Review</Select.Option>
                  <Select.Option value="done">Done</Select.Option>
                </Select>
              </Popover>
            )}
          </div>
        );
      },
    },
    {
      title: "Công việc",
      dataIndex: "task",
      className: "text-center",
      key: "task",
      render: (task) => (
        <div style={{ textAlign: "center" }}>
          {" "}
          <Tag
            style={{
              borderRadius: "10px",
              fontFamily: "cursive",
              fontSize: "15px",
            }}
            color="#2db7f5"
            color="#87d068"
          >
            <a>{task}</a>
          </Tag>
        </div>
      ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      className: "text-center",
      render: (startDate) => (
        <Tag icon={<SyncOutlined spin />} color="processing">
          {DayJS(startDate).format("DD/MM/YYYY")}
        </Tag>
      ),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "dueDate",
      className: "text-center",
      key: "dueDate",
      render: (dueDate) => (
        <Tag icon={<MinusCircleOutlined />} color="default">
          {DayJS(dueDate).format("DD/MM/YYYY")}
        </Tag>
      ),
    },

    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      className: "text-center",
      render: (text, record) => (
        <Space size="middle">
          {project.admin._id !== dataLogin.data._id ||
          !isModerator() ||
          (project && project.archived === true) ||
          (project && project.active === false) ? (
            <Popover content="Sửa">
              <a disabled>
                <SettingOutlined style={{ color: "blue" }} />
              </a>
            </Popover>
          ) : (
            <Popover content="Sửa">
              <a onClick={(e) => linkToUpdateSubTask(e, record, project)}>
                <SettingOutlined style={{ color: "blue" }} />
              </a>
            </Popover>
          )}
          {(project && project.archived === true) ||
          (project && project.active === false) ? (
            <a disabled>
              {" "}
              <RestOutlined style={{ color: "red" }} /> {/* xóa */}
            </a>
          ) : (
            <Popover content="Xóa">
              <a
                onClick={(e) => {
                  showModalDeleteSubTask(e);
                }}
              >
                <RestOutlined style={{ color: "red" }} /> {/* xóa */}
              </a>
              <ModalDeleteSubTask
                status={record.status}
                project={project}
                subTaskId={record.subTaskId}
                getDataProject={getDataProject}
                isModalDeleteSubTaskVisible={isModalDeleteSubTaskVisible}
                setIsModalDeleteSubTaskVisible={setIsModalDeleteSubTaskVisible}
              />
            </Popover>
          )}
        </Space>
      ),
    },
  ];

  const [subTasks, setSubTasks] = useState([]);
  let now = DayJS();
  const getDataAllTasks = async () => {
    try {
      if (project !== undefined) {
        let data = [];
        project.projectTasks.map((task) => {
          task.subTasks.map((subTask) => {
            data.push({
              code: subTask.code,
              name: subTask.name,
              description: subTask.description,
              assignee: subTask.assignee.name,
              startDate: subTask.startDate,
              dueDate: subTask.dueDate,
              task: task.name,
              subTaskId: subTask._id,
              assigneeId: subTask.assignee._id,
              taskId: task._id,
              status: subTask.status,
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

  return (
    <Table
      style={{ textAlign: "center" }}
      tableLayout="auto"
      loading={loading}
      columns={columns}
      dataSource={subTasks}
      scroll={{ x: 1300 }}
    />
  );
}
