import React, { useState, useEffect } from "react";
import { Modal, Space, Table, notification, Popover } from "antd";
import { removeMemberProject } from "../../../services/userServices";
import { useSelector } from "react-redux";
import confirm from "antd/lib/modal/confirm";
import { ExclamationCircleOutlined,RestOutlined} from "@ant-design/icons";
export default function ModalShowMembers({
  isModalShowMembersVisible,
  setIsModalShowMembersVisible,
  project,
  getDataProject,
 
}) {
  const [loading, setLoading] = useState(false);
  const { dataLogin } = useSelector((state) => state.user);
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
  const showModalDeleteMember = (e, memberName) => {
    confirm({
      title: "Thông báo",
      icon: <ExclamationCircleOutlined />,
      content: (
        <p>
          Bạn có chắc chắn muốn &nbsp;
          <span style={{ color: "red", fontWeight: "bold" }}>
            XÓA</span> thành viên<span style={{ color: "blue" }}> {memberName}</span>
          &nbsp; ra khỏi dự án
        </p>
      ),
      async onOk() {
        try {
          setLoading(true)
          if (project.admin._id === dataLogin.data._id || isModerator()) {
            const memoveMemberRes = await removeMemberProject(
              project._id,
              {
                username: memberName,
              },
              dataLogin.token
            );
            if (memoveMemberRes.data.status === "success") {
              notification.success({ message: "Xóa thành viên thành công!" });
              getDataProject();
            }
          } else if (project.admin._id !== dataLogin.data._id) {
            notification.error({
              message: "Bạn không có quyền xóa thành viên trong dự án này",
            });
          }
        } catch (error) {
          notification.error({ message: error.response.data.message });
        }
        finally{
          setLoading(false)
        }
      },
    });
  };

  const [dataSource, setDataSource] = useState([]);
  const task = useSelector((state) => state.task);
  const handleOk = () => {
    setIsModalShowMembersVisible(false);
  };

  const handleCancel = () => {
    setIsModalShowMembersVisible(false);
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
      title: "Số lượng project",
      dataIndex: "myProjects",
      key: "myProjects",
      className: "text-center",
    },
    {
      title: "Số lượng SubTask trong dựa án",
      key: "assignedSubTasks",
      dataIndex: "assignedSubTasks",
      className: "text-center",
    },
    {
      title: "Số lượng task đang giám sát trong dự án",
      key: "watchTasks",
      dataIndex: "watchTasks",
      className: "text-center",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          {(project && project.archived === false) ||
          (project && project.active === true) ?(
            <Popover content="Xóa">
            <a loading={loading} onClick={(e) => showModalDeleteMember(e, record.name)}> <RestOutlined style={{color:"red"}} /></a>
          </Popover>
          ) :(
            <Popover content="Xóa">
            <a disabled> <RestOutlined style={{color:"red"}} /></a>
          </Popover>
          )}
         
        </Space>
      ),
    },
  ];

  const loadData = () => {
    if (project !== undefined) {
      let data = [];
      project.members.map((dt, i) => {
        let projectWatchTasks = [];
        dt.watchTasks.forEach((watchTask) => {
          if (watchTask.project === project._id) {
            projectWatchTasks.push(watchTask);
          }
        });
        let projectSubTasks = [];
        dt.assignedSubTasks.forEach((subTask) => {
          if (subTask.task.project === project._id) {
            projectSubTasks.push(subTask);
          }
        });
        data.push({
          index: ++i,
          name: dt.name,
          memberId: dt._id,
          email: dt.email,
          myProjects: dt.myProjects.length,
          assignedSubTasks: projectSubTasks.length,
          watchTasks: projectWatchTasks.length,
        });
      });
      setDataSource(data);
    }
  };
  useEffect(() => {
    if (isModalShowMembersVisible) loadData();
  }, [project, isModalShowMembersVisible]);
  return (
    <>
      <Modal
        width={1000}
        title={<p className="title-modal">Danh sách thành viên đã tham gia</p>}
        visible={isModalShowMembersVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Table
          pagination={{ hideOnSinglePage: true }}
          columns={columns}
          dataSource={dataSource}
        />
      </Modal>
    </>
  );
}
