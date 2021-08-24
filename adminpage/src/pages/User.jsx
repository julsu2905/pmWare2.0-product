import { Col, Layout, notification, Row, Table, Space, Button } from "antd";
import QueueAnim from "rc-queue-anim";
import { useEffect, useState } from "react";
import { blockUser, getAllUsers, unblockUser } from "../services/userServices";
import CHeader from "./../components/layout/CHeader";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "./page-css/Table.css";
import { useSelector } from "react-redux";
import { AVATAR_URL } from "./../constants/apiConfig";
import { deleteUser } from "./../services/userServices";
import confirm from "antd/lib/modal/confirm";
import UserCard from "../components/User/UserCard";
const User = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const { type } = useSelector((state) => state.view);

  const handleBlock = async (e, id) => {
    confirm({
      title: "Thông báo",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có muốn chặn người dùng này?`,
      async onOk() {
        try {
          setLoading(true);
          const blockRes = await blockUser(id);
          if (blockRes.data.status === "success") {
            notification.success({ message: "Chặn người dùng thành công!" });
            getUsers();
          } else notification.error({ message: "Chặn người dùng thất bại!" });
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
      },
    });
  };
  const handleUnblock = async (e, id) => {
    confirm({
      title: "Thông báo",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có muốn hủy chặn người dùng này?`,
      async onOk() {
        try {
          setLoading(true);
          const blockRes = await unblockUser(id);
          if (blockRes.data.status === "success") {
            notification.success({
              message: "Hủy chặn người dùng thành công!",
            });
            getUsers();
          } else
            notification.error({ message: "Hủy chặn người dùng thất bại!" });
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
      },
    });
  };
  const handleDel = async (e, id) => {
    try {
      setLoading(true);
      const blockRes = await deleteUser(id);
      if (blockRes.data.status === "success") {
        notification.success({ message: "Xóa người dùng thành công!" });
        getUsers();
      } else notification.error({ message: blockRes.data.message });
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
  const columns = [
    {
      title: "Username",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "30%",
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      width: "5%",
      className: "text-center",
      render: (text) =>
        text ? (
          <CheckOutlined className="text-green-500" />
        ) : (
          <CloseOutlined className="text-red-500" />
        ),
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      width: "30%",
      className: "text-center",
      render: (text) =>
        text ? (
          <img
            className="h-24 w-auto inline"
            alt="avatar"
            src={`${AVATAR_URL}${text}`}
          />
        ) : (
          <img
            className="h-24 w-auto inline"
            alt="avatar"
            src={`./img/no-avatar.png`}
          />
        ),
    },
    {
      title: "Premium",
      dataIndex: "premium",
      key: "premium",
      width: "5%",
      className: "text-center",
    },
    {
      title: "Actions",
      dataIndex: "id",
      key: "action",
      className: "text-center",
      render: (id, record) => (
        <Space size="middle">
          {record.active ? (
            <Button className="border-0" onClick={(e) => handleBlock(e, id)}>
              <CloseCircleOutlined className="text-red-600" />
            </Button>
          ) : (
            <Button className="border-0" onClick={(e) => handleUnblock(e, id)}>
              <CheckOutlined className="text-green-500" />
            </Button>
          )}
          <Button className="border-0" onClick={(e) => handleDel(e, id)}>
            <DeleteOutlined className="text-red-600" />
          </Button>
        </Space>
      ),
      width: "5%",
    },
  ];
  const getUsers = async () => {
    try {
      setLoading(true);
      const getAllUsersRes = await getAllUsers();
      let data = [];
      getAllUsersRes.data.data.forEach((dt) => {
        data.push({
          name: dt.name,
          email: dt.email,
          active: dt.active,
          avatar: dt.avatar,
          premium: dt.premium,
          id: dt._id,
        });
      });
      setDataSource(data);
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
  useEffect(() => {
    setShow(true);
    getUsers();
    return () => setShow(false);
  }, []);
  return (
    <QueueAnim leaveReverse type={"right"} className="queue-simple">
      {show ? (
        <Layout key="content">
          <Layout.Header className="top-0 sticky z-30">
            <CHeader
              title={"Welcome to User management"}
              description={"Last changed"}
              showSearch
              showSwitch
              searchType="user"
            />
          </Layout.Header>
          <Layout.Content className="mt-5">
            <Row>
              <Col className="flex justify-center" span={24}>
                {type === "list" ? (
                  <Table
                    className="table-user header-center header-bold select-blue mx-3 w-full"
                    bordered
                    loading={loading}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                      defaultPageSize: 10,
                      defaultCurrent: 1,
                      pageSizeOptions: [10, 20, 50, 100],
                      showQuickJumper: true,
                      showSizeChanger: true,
                      hideOnSinglePage: true,
                      onChange: () => {
                        window.scrollTo({
                          top: 0,
                          left: 0,
                          behavior: "smooth",
                        });
                      },
                    }}
                  />
                ) : (
                  <Row gutter={[8, 8]}>
                    {dataSource.map((user) => (
                      <Col span={6}>
                        <UserCard
                          user={user}
                          handleBlock={handleBlock}
                          handleDel={handleDel}
                          handleUnblock={handleUnblock}
                        />
                      </Col>
                    ))}
                  </Row>
                )}
              </Col>
            </Row>
          </Layout.Content>
        </Layout>
      ) : null}
    </QueueAnim>
  );
};
export default User;
