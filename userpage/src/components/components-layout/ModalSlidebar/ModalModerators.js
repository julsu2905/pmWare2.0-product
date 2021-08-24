import React, { useState, createRef } from "react";
import { Modal, Button, Col, Row, Form, Select, notification, Space } from "antd";
import { grantAuthority } from "../../../services/projectServices";
import { useSelector } from "react-redux";
import { useForm } from "antd/lib/form/Form";
export default function ModalModerators({
  isModalModeratorsVisible,
  setIsModalModeratorsVisible,
  options,
  project,
  getDataProject,
}) {
  const [form]= useForm();
  const [loading, setLoading] = useState(false);
  const { dataLogin } = useSelector((state) => state.user);
  const handleGrantAuthority = async (values) => {
    try {
      setLoading(true)
      if (project.admin._id === dataLogin.data._id) {
        const grantAuthorityRes = await grantAuthority(
          project._id,
          values.moderators,
          dataLogin.token
        );
        if (grantAuthorityRes.data.status === "success") {
          notification.success({ message: "Thêm người ủy quyền thành công!" });
          getDataProject();
        }
      } else if (project.admin._id !== dataLogin.data._id) {
        notification.error({
          message: "Bạn không có quyền thêm người ủy quyền vào dự án này",
        });
      }
    } catch (error) {
      notification.error({ message: error.response.data.message });
    }
    finally{
      setLoading(false);
      setIsModalModeratorsVisible(false)
      form.resetFields();
    }
  };
  const handleCancel = () => {
    setIsModalModeratorsVisible(false);
  };
  return (
    <>
      <Modal
        title={<p className="title-modal">Chọn người ủy quyền</p>}
        visible={isModalModeratorsVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <Form ref={form} onFinish={handleGrantAuthority}>
          <Row gutter={16}>
            <Col span={22}>
              <Form.Item name="moderators" label="Người ủy quyền">
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  options={options}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={22} style={{display:"flex",justifyContent:"flex-end"}}>
              <Space>
              <Button onClick={handleCancel} >
            Hủy
          </Button>
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
