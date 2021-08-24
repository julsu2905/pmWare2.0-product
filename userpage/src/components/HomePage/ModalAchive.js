import React, { useState } from "react";
import { Modal, Button, Form, notification, Col, Row, Space } from "antd";
import { archiveProject } from "../../services/projectServices";
import { useSelector } from "react-redux";

export default function ModalAchive({
  isModalArchiveVisible,
  setIsModalArchiveVisible,
  getProject,
  project,
}) {

  const [loading, setLoading] = useState(false);
  const { dataLogin } = useSelector((state) => state.user);
  const onChangeArchiveProject = async () => {
    try {
      setLoading(true);
      if (project.active === false) {
        const onChangeArchiveProjectRes = await archiveProject(
          project._id,
          dataLogin.token
        );
        if (onChangeArchiveProjectRes.data.status === "success") {
          notification.success({ message: "Lưu dự án thành công" });
          getProject();
        }
      } else {
        notification.error({
          message: "Dự án chưa đóng nên bạn không thể lưu trữ",
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
      setIsModalArchiveVisible(false)
    }
  };
  const handleCancel = () => {
    setIsModalArchiveVisible(false);
  };
  return (
    <>
      <Modal
        title={<p className="title-modal">Lưu trữ dự án</p>}
        visible={isModalArchiveVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form onFinish={onChangeArchiveProject}>
          <Form.Item>
            <p>
              Bạn có muốn{" "}
              <span
                style={{
                  textTransform: "capitalize",
                  fontWeight: "bold",
                  color: "blue",
                }}
              >
                lưu trữ{" "}
              </span>{" "}
              dự án này
            </p>
          </Form.Item>
          <Row>
            <Col
              span={24}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Space>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button loading={loading} htmlType="submit" type="primary">
                  Submit
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
