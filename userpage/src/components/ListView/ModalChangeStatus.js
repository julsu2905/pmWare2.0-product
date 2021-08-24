import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Select, notification } from "antd";
import { useSelector } from "react-redux";
import { changeStatus } from "../../services/userServices";
const { Option } = Select;
export default function ModalChangeStatus({
  isModalChangeStatusSubTaskVisible,
  setIsModalChangeStatusSubTaskVisible,
  subTask,
  project,
  getDataProject,
}) {
  const handleCancel = () => {
    setIsModalChangeStatusSubTaskVisible(false);
  };
  const { dataLogin } = useSelector((state) => state.user);
  const [form] = Form.useForm();
  const getSubTask = async () => {
    if (subTask !== undefined)
      form.setFieldsValue({
        status: subTask.status,
      });
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
  
  const handleChangeStatus = async (values) => {
    try {
      if (project.admin_id === dataLogin.data._id || isModerator()) {
        const changeStatusRes = await changeStatus(
          subTask.subTaskId,
          project._id,
          values.status,
          dataLogin.token
        );

        if (changeStatusRes.data.status === "success") {
          {
            notification.success({
              message: "Cập nhật công việc nhỏ thành công!",
            });
            getDataProject();
            setIsModalChangeStatusSubTaskVisible(false);
          }
        }
      } else if (project.admin_id !== dataLogin.data._id) {
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
  useEffect(() => {
    getSubTask();
  }, [subTask, project]);
  return (
    <>
      <Modal
        title="Cập nhật tiến độ công việc"
        visible={isModalChangeStatusSubTaskVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={handleChangeStatus}>
          <Form.Item name="status" label="Thay đổi trạng thái công việc">
            <Select placeholder="Vui lòng chọn trạng thái công việc">
              <Option value="assigned">Assigned</Option>
              <Option value="inProgress">In Progress</Option>
              <Option value="review">Review</Option>
              <Option value="done">Done</Option>
            </Select>
          </Form.Item>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button htmlType="submit" type="primary">
            Cập nhật
          </Button>
        </Form>
      </Modal>
    </>
  );
}
