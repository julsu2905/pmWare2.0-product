import React, { useState, useEffect } from "react";
import { Modal, Form, Select, notification, Button } from "antd";
import { changeAssign } from "../../services/userServices";
import { useSelector } from "react-redux";
import { useForm } from "antd/lib/form/Form";
import Dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
Dayjs.extend(customParseFormat);
const { Option } = Select;
export default function ModalChangeAssignee({
  isModalChangeAssigneeSubTaskVisible,
  setIsModalChangeAssigneeSubTaskVisible,
  options,
  subTask,
  getDataProject,
  project,
}) {
  const handleOk = () => {
    setIsModalChangeAssigneeSubTaskVisible(false);
  };

  const handleCancel = () => {
    setIsModalChangeAssigneeSubTaskVisible(false);
  };
  const { dataLogin } = useSelector((state) => state.user);
  const [form] = Form.useForm();
  const getSubTask = async () => {
    if (subTask !== undefined)
      form.setFieldsValue({
        assignee: subTask.assignee,
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
  const handleChangeAssign = async (values) => {
    try {
      if (project.admin._id === dataLogin.data._id || isModerator()) {
        const changeAssignRes = await changeAssign(
          subTask.subTaskId,
          project._id,
          subTask.assigneeId,
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
    }
  };

  useEffect(() => {
    getSubTask();
  }, [subTask, project]);
  return (
    <>
      <Modal
        title="Thay đổi người thực hiện công việc"
        visible={isModalChangeAssigneeSubTaskVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={handleChangeAssign}>
          <Form.Item name="assignee" label="Chọn người thay thế">
            <Select defaultValue={subTask.assignee} options={options}></Select>
          </Form.Item>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button onClick={handleOk} htmlType="submit" type="primary">
            Cập nhật
          </Button>
        </Form>
      </Modal>
    </>
  );
}
