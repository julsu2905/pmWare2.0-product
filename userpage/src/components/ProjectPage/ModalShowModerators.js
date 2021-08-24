import React, { useState, useEffect } from "react";
import { Modal, Space, Popover, Table, notification } from "antd";
import { RestOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import confirm from "antd/lib/modal/confirm";
import { useSelector } from "react-redux";
import { removeModerators } from "../../services/userServices";
export default function ModalShowModerators({
  project,
  getDataProject,
  isModalModeratorsVisible,
  setIsModalModeratorsVisible,
}) {
  const { dataLogin } = useSelector((state) => state.user);
  const showModalDeleteModerator = (e, moderatorName,moderatorId) => {
    console.log(moderatorId);
    confirm({
      title: "Thông báo",
      icon: <ExclamationCircleOutlined />,
      content: (
        <p>
          Bạn có chắc chắn muốn &nbsp;
          <span style={{ color: "red", fontWeight: "bold" }}>XÓA </span> thành
          viên<span style={{ color: "blue" }}> {moderatorName}</span>
          &nbsp; ra khỏi dự án
        </p>
      ),
      async onOk() {
        try {
          setLoading(true);
          if (project.admin._id === dataLogin.data._id) {
            const removeModeratorRes = await removeModerators(
              project._id,
              {
                moderatorId: moderatorId,
              },
              dataLogin.token
            );
            if (removeModeratorRes.data.status === "success") {
              notification.success({
                message: "Xóa thành viên ủy quyền thành công!",
              });
              getDataProject();
            }
          } else if (project.admin._id !== dataLogin.data._id) {
            notification.error({
              message:
                "Bạn không có quyền xóa thành viên ủy quyền trong dự án này",
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
  const [loading, setLoading] = useState();
  const handleOk = () => {
    setIsModalModeratorsVisible(false);
  };

  const handleCancel = () => {
    setIsModalModeratorsVisible(false);
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      className: "text-center",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      className: "text-center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      className: "text-center",
    },
    {
      title:"Action",
      className: "text-center",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Popover content="Xóa">
            <a
              loading={loading}
              onClick={(e) => showModalDeleteModerator(e, record.name,record.moderatorId)}
            >
              {" "}
              <RestOutlined style={{ color: "red" }} />
            </a>
          </Popover>
        </Space>
      ),
    },
  ];
  const [dataSource, setDataSource] = useState();
  console.log(project);
  const loadData = () => {
    if (project !== undefined) {
      let data = [];
      project.moderators.map((dt, i) => {
        data.push({
          index: ++i,
          name: dt.name,
          moderatorId: dt._id,
          email: dt.email,
        });
      });
      setDataSource(data);
    }
  };
  useEffect(() => {
    loadData();
  }, [project]);
  return (
    <div>
      <Modal
        width={1000}
        title={
          <p className="title-modal">
            Danh sách thành viên được
            <br /> ủy quyền
          </p>
        }
        visible={isModalModeratorsVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Table
          pagination={{ hideOnSinglePage: true }}
          columns={columns}
          dataSource={dataSource}
        />
      </Modal>
    </div>
  );
}
