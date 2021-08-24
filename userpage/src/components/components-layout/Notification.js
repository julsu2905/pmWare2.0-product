import React, { useState } from "react";
import {
  Col,
  Menu,
  Row,
  Badge,
  Dropdown,
  Divider,
  notification,
  Button,
} from "antd";
import {
  BellOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FolderOpenOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import confirm from "antd/lib/modal/confirm";
import "../components-css/Header.css";
import { useSelector, useDispatch } from "react-redux";
import DayJS from "dayjs";
import { useHistory, Link } from "react-router-dom";
import { selectProject } from "../../redux/actions/projectActions";
import noNotification from "../components-img/no_notification.png";
import {
  markAllNotifications,
  removeNotification,
} from "../../services/userServices";
import { changeStatusNotification } from "../../services/userServices";

export default function Notification({
  notifications,
  counts,
  getNotification,
}) {
  let now = DayJS();
  const { dataLogin } = useSelector((state) => state.user);
  const history = useHistory();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const linkToProject = (e, project) => {
    if (project !== null) {
      dispatch(
        selectProject({
          projectId: project,
        })
      );
      localStorage.setItem(
        "project",
        JSON.stringify({
          projectId: project,
        })
      );
      history.push(`/projectpage/${project}`);
    }
  };

  const handleIsReadNoti = async (e, notiId) => {
    try {
      const changNotificationRes = await changeStatusNotification(
        notiId,
        dataLogin.token
      );
      if (changNotificationRes.data.status === "success") {
        notification.success({
          message: "Đánh dấu thành công!",
          placement: "topLeft",
        });
        getNotification();
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
  const handldeRemoveNoti = async (e, noteId) => {
    confirm({
      title: "Thông báo",
      className: "modal-removeNoti",
      icon: <ExclamationCircleOutlined />,
      content: (
        <p>
          Bạn có chắc chắn muốn &nbsp;
          <span style={{ color: "red", fontWeight: "bold" }}>
            GỠ thông báo này
          </span>
        </p>
      ),
      async onOk() {
        try {
          const removeNotificationRes = await removeNotification(
            noteId,
            dataLogin.token
          );
          if (removeNotificationRes.data.status === "success") {
            notification.success({ message: "Gỡ thành công!" });
            getNotification();
          }
        } catch (error) {
          notification.error({ message: error.response.data.message });
        }
      },
      zIndex: 99,
    });
  };
  const markAllAsRead = async () => {
    try {
      setLoading(true);
      const markAllRes = await markAllNotifications(dataLogin.token);
      if (markAllRes.data.status === "success") {
        notification.success({
          message: "Đánh dấu thành công!",
          placement: "topLeft",
        });
        getNotification();
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
    } finally {
      setLoading(false);
    }
  };
  const listNotifications = () => {
    return (
      <>
        <div style={{ zIndex: 3 }} className="div-nofitication">
          <p>
            <h2>Thông báo</h2>
          </p>
          <p className="markAll">
            <Button loading={loading} onClick={markAllAsRead}>
              Đánh dấu tất cả đã đọc
            </Button>
          </p>
          {notifications != undefined ? (
            <div>
              {notifications &&
                notifications.map((note) => (
                  <div className="content-nofitication">
                    <Row>
                      <Col offset={2} span={18}>
                        <a onClick={(e) => linkToProject(e, note.project)}>
                          <Divider
                            className="divider-actorName"
                            orientation="left"
                          >
                            {" "}
                            {note.actorName} <FolderOpenOutlined />
                          </Divider>

                          <p>
                            <a>
                              <div>{note.description}</div>
                            </a>
                          </p>

                          <p className="time-change">
                            {DayJS(note.time).format("DD/MM/YYYY HH:mm")} (
                            {now.diff(note.time, "days") > 0
                              ? now.diff(note.time, "days") + " ngày trước"
                              : now.diff(note.time, "hours") + " giờ trước"}
                            )
                          </p>
                        </a>
                      </Col>
                      <Col style={{ textAlign: "center" }} span={2}>
                        <div>
                          <a>
                            <p className="action-noti">
                              <Dropdown
                                placement="topLeft"
                                overlay={() => (
                                  <Menu>
                                    <Menu.Item>
                                      {note.isRead === true ? (
                                        <a
                                          onClick={(e) =>
                                            handleIsReadNoti(e, note._id)
                                          }
                                        >
                                          <CloseOutlined
                                            style={{ color: "gray" }}
                                          />
                                          Đánh dấu chưa đọc
                                        </a>
                                      ) : (
                                        <a
                                          onClick={(e) =>
                                            handleIsReadNoti(e, note._id)
                                          }
                                        >
                                          <CheckOutlined
                                            style={{ color: "green" }}
                                          />
                                          Đánh dấu đã đọc
                                        </a>
                                      )}
                                    </Menu.Item>
                                    <Menu.Item></Menu.Item>
                                    <Menu.Item>
                                      <a
                                        onClick={(e) =>
                                          handldeRemoveNoti(e, note._id)
                                        }
                                      >
                                        {" "}
                                        <DeleteOutlined
                                          style={{ color: "red" }}
                                        />
                                        Gỡ thông báo
                                      </a>
                                    </Menu.Item>
                                  </Menu>
                                )}
                                trigger={["click"]}
                              >
                                <a>
                                  <EllipsisOutlined />
                                </a>
                              </Dropdown>
                            </p>
                          </a>
                          <p>
                            <a onClick={(e) => handleIsReadNoti(e, note._id)}>
                              {note.isRead === false && (
                                <div className="Badge"></div>
                              )}
                            </a>
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </div>
                ))}
            </div>
          ) : (
            <div className="no-Notifications">
              <img
                className="no-Notifications-img"
                src={noNotification}
                alt="không có thông báo"
              />
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <Dropdown
      placement="bottomCenter"
      overlay={listNotifications}
      trigger={["click"]}
    >
      <Menu.Item key="nofitication">
        <Badge count={counts} overflowCount={10}>
          <BellOutlined style={{ fontSize: "21px" }} />
        </Badge>
      </Menu.Item>
    </Dropdown>
  );
}
