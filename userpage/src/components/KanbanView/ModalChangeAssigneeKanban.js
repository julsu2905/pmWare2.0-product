import React, { useEffect, useState } from "react";
import { Modal, Form, Select, notification, Button } from "antd";
import { useSelector } from "react-redux";
import { changeAssign } from "../../services/userServices";
const { useForm } = Form;

export default function ModalChangeAssignee({
  isModalChangeAssigneeVisible,
  setIsModalChangeAssigneeVisible,
  members,
  project,
  subTaskid,
  getDataProject,
}) {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  /* console.log(assignee.name); */
  const handleCancel = () => {
    setIsModalChangeAssigneeVisible(false);
  };
  /* console.log(project);
  console.log(subTask);
  console.log(assignee._id); */

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
  const handleChangeAssign = async (values) => {
    try {
      setLoading(true);
      const { assignee } = values;
      if (project.admin._id === dataLogin.data._id || isModerator()) {
        const changeAssignRes = await changeAssign(
          subTaskid,
          project._id,
          assignee,
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
      setIsModalChangeAssigneeVisible(false);
    }
  };

  return (
    <>
      <Modal
        title={
          <p className="title-modal">Thay đổi người thực hiện công việc</p>
        }
        visible={isModalChangeAssigneeVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={handleChangeAssign}>
          <Form.Item name="assignee" label="Chọn người thay thế">
            <Select options={members}></Select>
          </Form.Item>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button loading={loading} htmlType="submit" type="primary">
            Cập nhật
          </Button>
        </Form>
      </Modal>
    </>
  );
}
