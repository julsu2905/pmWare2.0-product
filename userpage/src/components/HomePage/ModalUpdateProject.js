import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Modal,
  Form,
  Col,
  Row,
  Input,
  InputNumber,
  notification,
  List,
  Divider,
  Radio,
  Button,
  Space,
} from "antd";
import { getProject } from "../../services/projectServices";
import { updateProject } from "../../services/projectServices";
const ModalUpdateProject = ({
  projectId,
  visible,
  setModalUpdateVisible,
  projectAd,
  loadData,
}) => {
  const [loading, setLoading] = useState(false);
  const [listMember, setListMember] = useState([]);
  const { dataLogin } = useSelector((state) => state.user);
  const [form] = Form.useForm();
  const getProjects = async () => {
    try {
      const getProjectRes = await getProject(projectId, dataLogin.token);
      if (getProjectRes.data.status === "success") {
        setListMember(getProjectRes.data.data.members);
        form.setFieldsValue({
          name: getProjectRes.data.data.name,
          description: getProjectRes.data.data.description,
          code: getProjectRes.data.data.code,
          memberQuantity: getProjectRes.data.data.memberQuantity,
          visibility: getProjectRes.data.data.visibility,
        });
      } else {
        notification.error({ message: getProjects.data.message });
      }
    } catch (error) {
      notification.error({ message: "Loi" });
    }
  };
  const handleUpdateProject = async (values) => {
    try {
      setLoading(true);
      if (projectAd === dataLogin.data._id) {
        const updateProjectRes = await updateProject(
          projectId,
          {
            name: values.name,
            description: values.description,
            memberQuantity: values.memberQuantity,
            visibility: values.visibility,
          },
          dataLogin.token
        );
        if (updateProjectRes.data.status === "success") {
          {
            notification.success({
              message: "Cập nhật dự án thành công!",
            });
            loadData();
          }
        }
      } else if (projectAd !== dataLogin.data._id) {
        notification.error({
          message: "Bạn không có quyền sửa đổi dự án này",
        });
      }
    } catch (error) {
      console.log(error);
      /*     let errorStatus;
      if (!error.response) {
        errorStatus = "Error: Network Error";
      } else {
        if (error.response.data.status === "fail") {
          errorStatus = error.response.data.message;
        }
      }
      notification.error({ message: errorStatus }); */
    } finally {
      setLoading(false);
      setModalUpdateVisible(false);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <>
      <Modal
        title={<p className="title-modal">Chỉnh sửa thông tin dự án</p>}
        visible={visible}
        footer={null}
        onCancel={() => setModalUpdateVisible(false)}
      >
        <Form
          form={form}
          onFinish={handleUpdateProject}
          layout="vertical"
          hideRequiredMark
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Tên dự án">
                <Input />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item name="code" label="Mã dự án">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="memberQuantity" label="Số thành viên">
                <InputNumber min={3} max={10} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="visibility" label="Trạng thái">
                <Radio.Group>
                  <Radio checked value={"private"}>
                    Private
                  </Radio>
                  <Radio value={"open"}>Open</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="description" label="Mô tả">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="members">
                <Divider orientation="left">Danh sách thành viên</Divider>
                <List
                  size="small"
                  dataSource={listMember}
                  bordered
                  renderItem={(item) => <List.Item>{item.name}</List.Item>}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col
              span={24}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Space>
                <Button onClick={() => setModalUpdateVisible(false)}>
                  Hủy
                </Button>
                <Button loading={loading} htmlType="submit" type="primary">
                  Cập nhật
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalUpdateProject;
