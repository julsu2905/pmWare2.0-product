import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  Col,
  Row,
  Divider,
  Tag,
  Card,
  Menu,
  Dropdown,
  notification,
  Popover,
} from "antd";
import {
  UserSwitchOutlined,
  ExclamationCircleOutlined,
  EllipsisOutlined,
  SyncOutlined,
  MinusCircleOutlined,
  InfoOutlined,
} from "@ant-design/icons";
import confirm from "antd/lib/modal/confirm";
import "../components-css/ProjectPage/KanbanView.css";
import { deleteSubTask } from "../../services/userServices";
import { useSelector, useDispatch } from "react-redux";
import { selectSubTask } from "../../redux/actions/subTaskAction";
import { useHistory } from "react-router-dom";
import ModalChangeAssignee from "./ModalChangeAssigneeKanban";
import { changeStatus } from "../../services/userServices";
import ModalShowDescriptions from "./ModalShowDescriptions";
import DayJS from "dayjs";

function DragNDrop({ task, project, getDataProject, members }) {
  const { dataLogin } = useSelector((state) => state.user);
  const [modalDescription, setModalDescription] = useState({});
  const [modalData, setModalData] = useState({});
  const [isModalDescriptionVisible, setIsModalDescriptionVisible] =
    useState(false);

  const showModalDescription = (e, description) => {
    setModalDescription(description);
    setIsModalDescriptionVisible(true);
  };
  const [isModalChangeAssigneeVisible, setIsModalChangeAssigneeVisible] =
    useState(false);
  const showModalChangeAssignee = (e, data) => {
    setModalData(data);
    setIsModalChangeAssigneeVisible(true);
  };
  const [isUpdate, setIsUpdate] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const linkToUpdateSubTask = (e, record, project) => {
    dispatch(
      selectSubTask({
        id: record.id,
        code: record.code,
        description: record.description,
        dueDate: record.dueDate,
        name: record.name,
        startDate: record.startDate,
        status: record.status,
        assignee: record.assignee.name,
        assigneeId: record.assignee._id,
        projectModerators: project.moderators,
        projectName: project.name,
        task: record.task,
        taskId: record.taskId,
        project: record.project,
      })
    );
    localStorage.setItem(
      "subTask",
      JSON.stringify({
        id: record.id,
        code: record.code,
        description: record.description,
        dueDate: record.dueDate,
        name: record.name,
        startDate: record.startDate,
        status: record.status,
        assignee: record.assignee.name,
        assigneeId: record.assignee._id,
        projectModerators: project.moderators,
        projectName: project.name,
        task: record.task,
        taskId: record.taskId,
        project: record.project,
      })
    );
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
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

  const onDragEnd = async (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      try {
        if (
          (project.admin._id === dataLogin.data._id || isModerator()) &&
          destination.droppableId !== "assigned" &&
          project.active
        ) {
          const changeStatusRes = await changeStatus(
            result.draggableId,
            project._id,
            destination.droppableId,
            dataLogin.token
          );
          if (changeStatusRes.data.status === "success") {
            notification.success({
              message: "Cập nhật trạng thái công việc thành công!",
            });
            getDataProject();
          }
          const sourceColumn = columns[source.droppableId];
          const destColumn = columns[destination.droppableId];
          const sourceItems = [...sourceColumn.items];
          const destItems = [...destColumn.items];
          const [removed] = sourceItems.splice(source.index, 1);
          destItems.splice(destination.index, 0, removed);
          setColumns({
            ...columns,
            [source.droppableId]: {
              ...sourceColumn,
              items: sourceItems,
            },
            [destination.droppableId]: {
              ...destColumn,
              items: destItems,
            },
          });
          setIsUpdate(!isUpdate);
        } else {
          notification.error({
            message: "Bạn không thể cập nhật trạng thái công việc này!",
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
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  const handleDeleteSubTask = async (e, subTaskId, status) => {
    confirm({
      title: "Thông báo",
      icon: <ExclamationCircleOutlined />,
      content: (
        <p>
          Bạn có chắc chắn muốn &nbsp;
          <span style={{ color: "red", fontWeight: "bold" }}>
            XÓA công việc này kh
          </span>
          &nbsp; ra khỏi dự án
        </p>
      ),
      async onOk() {
        try {
          if (
            (project.admin._id === dataLogin.data._id || isModerator()) &&
            status === "assigned"
          ) {
            const deleteSubTaskRes = await deleteSubTask(
              subTaskId,
              project._id,
              dataLogin.token
            );
            if (deleteSubTaskRes.data.status === "success") {
              {
                notification.success({
                  message: "Xóa công việc nhỏ thành công!",
                });
                getDataProject();
              }
            }
          } else if (
            project.admin_id !== dataLogin.data._id ||
            status !== "assigned"
          ) {
            notification.error({
              message: "Bạn không có quyền xóa công việc này",
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
      },
    });
  };
  let now = DayJS();
  let dataCol1 = [];
  let dataCol2 = [];
  let dataCol3 = [];
  let dataCol4 = [];
  task.subTasks.map((subTask) => {
    console.log(subTask);
    if (subTask.status === "assigned") {
      dataCol1.push({
        id: subTask._id,
        name: subTask.name,
        assignee: subTask.assignee,
        description: subTask.description,
        code: subTask.code,
        dueDate: DayJS(subTask.dueDate).format("DD/MM/YYYY"),
        startDate: DayJS(subTask.startDate).format("DD/MM/YYYY"),
        task: subTask.task.name,
        taskId: subTask.task._id,
        project: subTask.task.project,
        status: subTask.status,
      });
    }
    if (subTask.status === "working") {
      dataCol2.push({
        id: subTask._id,
        name: subTask.name,
        assignee: subTask.assignee,
        description: subTask.description,
        code: subTask.code,
        dueDate: DayJS(subTask.dueDate).format("DD/MM/YYYY"),
        startDate: DayJS(subTask.startDate).format("DD/MM/YYYY"),
        task: subTask.task.name,
        taskId: subTask.task._id,
        project: subTask.task.project,
        status: subTask.status,
      });
    }
    if (subTask.status === "pending") {
      dataCol3.push({
        id: subTask._id,
        name: subTask.name,
        assignee: subTask.assignee,
        description: subTask.description,
        code: subTask.code,
        dueDate: DayJS(subTask.dueDate).format("DD/MM/YYYY"),
        startDate: DayJS(subTask.startDate).format("DD/MM/YYYY"),
        task: subTask.task.name,
        taskId: subTask.task._id,
        project: subTask.task.project,
        status: subTask.status,
      });
    }
    if (subTask.status === "done") {
      dataCol4.push({
        id: subTask._id,
        name: subTask.name,
        assignee: subTask.assignee,
        description: subTask.description,
        code: subTask.code,
        dueDate: DayJS(subTask.dueDate).format("DD/MM/YYYY"),
        startDate: DayJS(subTask.startDate).format("DD/MM/YYYY"),
        task: subTask.task.name,
        taskId: subTask.task._id,
        project: subTask.task.project,
        status: subTask.status,
      });
    }
  });

  const [itemsCol1, setItemsCol1] = useState(dataCol1);
  const [itemsCol2, setItemsCol2] = useState(dataCol2);
  const [itemsCol3, setItemsCol3] = useState(dataCol3);
  const [itemsCol4, setItemsCol4] = useState(dataCol4);
  const [columns, setColumns] = useState({
    ["assigned"]: {
      name: "Assigned",
      items: itemsCol1,
    },
    ["working"]: {
      name: "In progress",
      items: itemsCol2,
    },
    ["pending"]: {
      name: "Review",
      items: itemsCol3,
    },
    ["done"]: {
      name: "Done",
      items: itemsCol4,
    },
  });
  useEffect(() => {
    dataCol1 = [];
    dataCol2 = [];
    dataCol3 = [];
    dataCol4 = [];
    task.subTasks.map((subTask) => {
      if (subTask.status === "assigned") {
        dataCol1.push({
          id: subTask._id,
          name: subTask.name,
          assignee: subTask.assignee,
          description: subTask.description,
          code: subTask.code,
          dueDate: subTask.dueDate,
          startDate: subTask.startDate,
          task: subTask.task.name,
          taskId: subTask.task._id,
          project: subTask.task.project,
          status: subTask.status,
        });
      }
      if (subTask.status === "working") {
        dataCol2.push({
          id: subTask._id,
          name: subTask.name,
          assignee: subTask.assignee,
          description: subTask.description,
          code: subTask.code,
          dueDate: subTask.dueDate,
          startDate: subTask.startDate,
          task: subTask.task.name,
          taskId: subTask.task._id,
          project: subTask.task.project,
          status: subTask.status,
        });
      }
      if (subTask.status === "pending") {
        dataCol3.push({
          id: subTask._id,
          name: subTask.name,
          assignee: subTask.assignee,
          description: subTask.description,
          code: subTask.code,
          dueDate: subTask.dueDate,
          startDate: subTask.startDate,
          task: subTask.task.name,
          taskId: subTask.task._id,
          project: subTask.task.project,
          status: subTask.status,
        });
      }
      if (subTask.status === "done") {
        dataCol4.push({
          id: subTask._id,
          name: subTask.name,
          assignee: subTask.assignee,
          description: subTask.description,
          code: subTask.code,
          dueDate: subTask.dueDate,
          startDate: subTask.startDate,
          task: subTask.task.name,
          taskId: subTask.task._id,
          project: subTask.task.project,
          status: subTask.status,
        });
      }
    });
    setItemsCol1(dataCol1);
    setItemsCol2(dataCol2);
    setItemsCol3(dataCol3);
    setItemsCol4(dataCol4);
    setColumns({
      ...columns,
      ["assigned"]: {
        name: "Assigned",
        items: dataCol1,
      },
      ["working"]: {
        name: "In progress",
        items: dataCol2,
      },
      ["pending"]: {
        name: "Review",
        items: dataCol3,
      },
      ["done"]: {
        name: "Done",
        items: dataCol4,
      },
    });
    setIsUpdate(!isUpdate);
  }, [project, task]);
  return (
    <>
      <Divider dashed orientation="left">
        <h3 className="name-task">
          <span>{task.name}</span>
        </h3>
      </Divider>
      <ModalChangeAssignee
        assignee={modalData.assignee}
        subTaskid={modalData.subTaskId}
        isModalChangeAssigneeVisible={isModalChangeAssigneeVisible}
        setIsModalChangeAssigneeVisible={setIsModalChangeAssigneeVisible}
        members={members}
        project={project}
        getDataProject={getDataProject}
      />
      <Row className="border-task">
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                key={columnId}
              >
                <Col span={24}>
                  <h2 className="column-name">{column.name}</h2>
                  <div style={{ margin: "8px 0px 30px 8px" }}>
                    <Droppable droppableId={columnId} key={columnId}>
                      {(provided, snapshot) => {
                        return (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              background: snapshot.isDraggingOver
                                ? "#F2F2F2"
                                : "#D8D8D8",
                              padding: 4,
                              width: 250,
                              minHeight: 150,
                              borderRadius: "5px",
                            }}
                          >
                            {column.items.map((item, index) => {
                              return (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}
                                  assigneeId={item.assignee._id}
                                >
                                  {(provided, snapshot) => {
                                    return (
                                      <div
                                        className="subTasks"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                          userSelect: "none",
                                          padding: "16",
                                          margin: "0 0 8px 0",
                                          minHeight: "50px",
                                          backgroundColor: snapshot.isDragging
                                            ? "#FAFAFA"
                                            : "#FFFFFF",
                                          ...provided.draggableProps.style,
                                          borderRadius: "5px",
                                        }}
                                      >
                                        <Card
                                          size="small"
                                          title={
                                            <p id="nameSubTask">
                                             
                                              <span>
                                                {now.diff(
                                                  item.dueDate,
                                                  "days"
                                                ) > -1 ? (
                                                  <p className="expiration-date">
                                                    
                                                    {item.name} <span className="noti-expiration-date">
                                                    <Popover
                                                      content={
                                                        <div>
                                                          {now.diff(
                                                            item.dueDate,
                                                            "days"
                                                          ) > 0 ? (
                                                            <p>
                                                              {" "}
                                                              Đã hết hạn{" "}
                                                              {now.diff(
                                                                item.dueDate,
                                                                "days"
                                                              ) + " ngày trước"}
                                                            </p>
                                                          ) : (
                                                            <p>
                                                              {now.diff(
                                                                item.dueDate,
                                                                "hours"
                                                              ) *
                                                                -1 +
                                                                " giờ nữa hết hạn"}
                                                            </p>
                                                          )}
                                                        </div>
                                                      }
                                                    >
                                                      <a>
                                                        <InfoOutlined
                                                          style={{
                                                            color: "red",
                                                            fontSize: "16px",
                                                            fontWeight: "bold",
                                                          }}
                                                        />
                                                      </a>  
                                                    </Popover>
                                                  </span>
                                                </p>
                                                ) : (
                                                  <div>
                                                    {item.name}
                                                  </div>
                                                )}
                                              </span> 
                                            </p>
                                          }
                                          extra={
                                            <div className="action-kanban">
                                              <Dropdown
                                                placement="topRight"
                                                trigger={["click"]}
                                                overlay={
                                                  <div
                                                    style={{
                                                      border:
                                                        "1px solid #A4A4A4",
                                                    }}
                                                  >
                                                    <Menu>
                                                      {(project &&
                                                        project.archived ===
                                                          true) ||
                                                      (project &&
                                                        project.active ===
                                                          false) ? (
                                                        <Menu.Item>
                                                          <a disabled>Sửa</a>
                                                        </Menu.Item>
                                                      ) : (
                                                        <Menu.Item>
                                                          <a
                                                            onClick={(e) =>
                                                              linkToUpdateSubTask(
                                                                e,
                                                                item,
                                                                project
                                                              )
                                                            }
                                                          >
                                                            Sửa
                                                          </a>
                                                        </Menu.Item>
                                                      )}

                                                      <hr />
                                                      {(project &&
                                                        project.archived ===
                                                          true) ||
                                                      (project &&
                                                        project.active ===
                                                          false) ? (
                                                        <Menu.Item>
                                                          <a disabled>Xóa</a>
                                                        </Menu.Item>
                                                      ) : (
                                                        <Menu.Item>
                                                          <a
                                                            onClick={(e) =>
                                                              handleDeleteSubTask(
                                                                e,
                                                                item.id,
                                                                item.status
                                                              )
                                                            }
                                                          >
                                                            Xóa
                                                          </a>
                                                        </Menu.Item>
                                                      )}
                                                    </Menu>
                                                  </div>
                                                }
                                              >
                                                <a>
                                                  <EllipsisOutlined
                                                    style={{
                                                      fontWeight: "bold",
                                                    }}
                                                  />
                                                </a>
                                              </Dropdown>
                                            </div>
                                          }
                                          style={{ width: "100%" }}
                                        >
                                          <Row>
                                            <Col span={12}>
                                              {(() => {
                                                switch (task.priority) {
                                                  case "High":
                                                    return (
                                                      <Tag color="orange">
                                                        {task.priority}
                                                      </Tag>
                                                    );
                                                  case "Critical":
                                                    return (
                                                      <Tag color="magenta">
                                                        {task.priority}
                                                      </Tag>
                                                    );
                                                  case "Normal":
                                                    return (
                                                      <Tag color="green">
                                                        {task.priority}
                                                      </Tag>
                                                    );
                                                  default:
                                                    return (
                                                      <Tag color="gold">
                                                        {task.priority}
                                                      </Tag>
                                                    );
                                                }
                                              })()}
                                            </Col>
                                            <Col span={6} offset={1}>
                                              {" "}
                                              {item.assignee.name}
                                            </Col>
                                            <Col
                                              style={{ marginTop: "10px" }}
                                              offset={15}
                                              span={4}
                                            >
                                              {(project &&
                                                project.archived === true) ||
                                              (project &&
                                                project.active === false) ? (
                                                <a disabled>
                                                  {" "}
                                                  <UserSwitchOutlined />
                                                </a>
                                              ) : (
                                                <a
                                                  onClick={(e) =>
                                                    showModalChangeAssignee(e, {
                                                      assignee: item.assignee,
                                                      subTaskId: item.id,
                                                    })
                                                  }
                                                >
                                                  <UserSwitchOutlined />
                                                </a>
                                              )}

                                              {/* thay đổi người phân công */}
                                            </Col>
                                            <Col
                                              span={12}
                                              style={{ marginTop: "-20px" }}
                                            >
                                              <a
                                                key={item.id}
                                                onClick={(e) =>
                                                  showModalDescription(
                                                    e,
                                                    item.description
                                                  )
                                                }
                                              >
                                                Description
                                              </a>

                                              <ModalShowDescriptions
                                                description={modalDescription}
                                                setIsModalDescriptionVisible={
                                                  setIsModalDescriptionVisible
                                                }
                                                isModalDescriptionVisible={
                                                  isModalDescriptionVisible
                                                }
                                              />
                                            </Col>
                                          </Row>
                                          <br />
                                          <Row>
                                            <Col span={12}>
                                              <Tag
                                                icon={<SyncOutlined spin />}
                                                color="processing"
                                              >
                                                {DayJS(item.startDate).format("DD/MM/YYYY")}{" "}
                                              </Tag>
                                            </Col>
                                            <Col span={12}>
                                              <Tag
                                                icon={<MinusCircleOutlined />}
                                                color="default"
                                              >
                                                {DayJS(item.dueDate).format("DD/MM/YYYY")}
                                              </Tag>
                                            </Col>
                                          </Row>
                                        </Card>
                                      </div>
                                    );
                                  }}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        );
                      }}
                    </Droppable>
                  </div>
                </Col>
              </div>
            );
          })}
        </DragDropContext>
      </Row>
    </>
  );
}

export default DragNDrop;
