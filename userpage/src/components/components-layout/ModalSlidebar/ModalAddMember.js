import React, { useEffect, useState, createRef } from "react";
import {
  Modal,
  Button,
  Form,
  notification,
  AutoComplete,
  Row,
  Col,
  Space,
  Input,
} from "antd";
import { addMemberProject, getAllUsers } from "../../../services/userServices";
import { useSelector } from "react-redux";
import { useForm } from "antd/lib/form/Form";
import Select from "rc-select";
export default function ModalAddMember({
  isModalVisible,
  setIsModalVisible,
  getDataProject,
  project,
}) {
  const [form] = useForm();
  const { dataLogin } = useSelector((state) => state.user);
  const { projectId } = useSelector((state) => state.project);
  const { token } = dataLogin;
  const [option, setOption] = useState([]);
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    try {
      const getUserRes = await getAllUsers(dataLogin.token);
      let data = [];
      getUserRes.data.data.map((dt) => {
        data.push({
          value: dt.name,
        });
      });
      setOption(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
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
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (project.admin._id === dataLogin.data._id || isModerator()) {
        const addMemberProjectRes = await addMemberProject(
          projectId,
          {
            username: values.username,
          },
          token
        );
        if (addMemberProjectRes.data.status === "success") {
          notification.success({ message: "Thêm thành công!" });
          getDataProject();
          setIsModalVisible(false);
          form.resetFields();
        }
      } else if (project.admin_id !== dataLogin.data._id) {
        notification.error({
          message: "Bạn không có quyền thêm thành viên vào dự án này",
        });
        setIsModalVisible(true);
      }
    } catch (error) {
      notification.error({ message: error.response.data.message });
      setIsModalVisible(true);
    } finally {
      setLoading(false);
      form.resetFields();
    }
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <>
      <Modal
        title={<p className="title-modal">Thêm thành viên</p>}
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        maskStyle={{
          backgroundImage: `url("https://www.pngitem.com/pimgs/m/59-591257_trabajadores-transparent-background-business-png-png-download.png")`,
        }}
      >
        <Form ref={form} form={form} onFinish={handleSubmit}>
          <Form.Item name="username" label="Chọn thành viên">
            <AutoComplete
              style={{
                width: "300px",
              }}
              options={option}
              placeholder="Nhập tên thành viên cần thêm"
            />
          </Form.Item>
          <Row>
            <Col
              span={24}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Space>
                <Button loading={loading} htmlType="submit" type="primary">
                  Thêm
                </Button>
                <Button onClick={handleCancel}>Hủy</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
