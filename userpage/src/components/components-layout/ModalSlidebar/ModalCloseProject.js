import React, { useState } from "react";
import { Modal, notification, Form, Button, Row, Col, Space } from "antd";
import { useSelector } from "react-redux";
import { closeProject } from "../../../services/projectServices";
import { useHistory } from "react-router";

export default function ModalCloseProject({
  isModalCloseProjectVisible,
  setIsModalCloseProjectVisible,
  project,
  getDataProject,
}) {
  const { dataLogin } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const handleCloseProject = async () => {
    try {
      setLoading(true);
      if (project.admin._id === dataLogin.data._id) {
        const closeProjectRes = await closeProject(
          project._id,
          dataLogin.token
        );
        if (closeProjectRes.data.status === "success") {
          notification.success({ message: "Lưu dự án thành công" });
          getDataProject();
          history.push(`/home`);
        }
      } else if (project.admin._id !== dataLogin.data._id) {
        notification.error({
          message: "Bạn không có quyền đống dự án này",
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
      setIsModalCloseProjectVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalCloseProjectVisible(false);
  };
  return (
    <>
      <Modal
        title={<p className="title-modal">Đóng dự án</p>}
        visible={isModalCloseProjectVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <Form onFinish={handleCloseProject}>
          <Form.Item>
            <p>
              Bạn có chắc muốn{" "}
              <span style={{ color: "red", fontWeight: "bold" }}>ĐÓNG</span> dự
              án này hay không?
            </p>
          </Form.Item>
          <Row>
            <Col
              span={24}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Space>
                <Button onClick={handleCancel}>Hủy</Button>
                <Button loading={loading} htmlType="submit" type="primary">
                  Xác nhận
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
