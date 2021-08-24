import React, { useState } from "react";
import "antd/dist/antd.css";
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  InputNumber,
  notification,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import { createProject } from "../../services/projectServices";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { selectProject } from "./../../redux/actions/projectActions";

const { Option } = Select;
const ModalAddProject = ({ getProject }) => {
  const [loading, setLoading] = useState();
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const { dataLogin } = useSelector((state) => state.user);
  const { token } = dataLogin;
  const [form] = useForm();
  const showDrawer = () => {
    setVisible(true);
  };
  function nonAccentVietnamese(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
  }
  const onClose = () => {
    setVisible(false);
  };
  const createCode = (name) => {
    return name !== null && name !== ""
      ? nonAccentVietnamese(name)
          .match(/\b(\w)/g)
          .join("")
          .toUpperCase()
      : "";
  };
  const checkPrivate = () => {
    let check = 0;
    dataLogin.data.myProjects.forEach((project) => {
      if (project.visibility === "private") check++;
    });
    return check < 5;
  };
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (dataLogin.data.premium !== 0 || checkPrivate) {
        const createProjectRes = await createProject(
          {
            code: values.code,
            name: values.name,
            memberQuantity: values.amount,
            description: values.description,
            visibility: values.visibility,
            active: true,
          },
          token
        );
        if (createProjectRes.data.status === "success") {
          notification.success({
            message:
              "Tạo dự án thành công! Bạn sẽ được chuyển đến trang dự án!",
          });
          setVisible(false);
          dispatch(
            selectProject({
              projectId: createProjectRes.data.data._id,
              projectAdmin: createProjectRes.data.data.admin,
            })
          );
          localStorage.setItem(
            "project",
            JSON.stringify({
              projectId: createProjectRes.data.data._id,
              projectAdmin: createProjectRes.data.data.admin,
            })
          );
          history.push(`/projectpage/${createProjectRes.data.data.name}`);
          form.resetFields();
        }
      } else {
        notification.warning({
          message:
            "Bạn không thể tạo thêm dự án riêng tư! Vui lòng nâng cấp tài khoản!",
        });
        setVisible(true);
      }
    } catch (error) {
      notification.error({ message: error.response.data.message });
      setVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        <PlusOutlined /> Thêm project
      </Button>
      <Drawer
        title={<p className="title-modal">Tạo dự án mới</p>}
        width={720}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
        maskStyle={{
          backgroundImage: `url("https://www.nicepng.com/png/detail/114-1144436_we-bring-over-50-years-of-experience-to.png")`,
        }}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          hideRequiredMark
          initialValues={{ amount: 3 }}
        >
          <Row gutter={16}>
            <Col span={10}>
              <Form.Item
                name="name"
                label="Tên dự án"
                rules={[{ required: true, message: "Vui lòng nhập tên dự án" }]}
              >
                <Input
                  onChange={(e) => {
                    form.setFieldsValue({
                      code: createCode(e.target.value),
                    });
                  }}
                  placeholder="Vui lòng nhập tên dự án"
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item name="code" label="Mã dự án">
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                rules={[
                  { required: true, message: "Số lượng không thể để trống!" },
                ]}
                name="amount"
                label="Amount of member"
              >
                <InputNumber min={3} max={10} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="visibility"
                label="Trạng thái"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái" },
                ]}
              >
                <Select placeholder="Vui lòng chọn trạng thái">
                  <Option value="private">Private</Option>
                  <Option value="open">Open</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="description" label="Mô tả">
                <Input.TextArea rows={4} placeholder="Vui lòng nhập mô ta" />
              </Form.Item>
            </Col>
          </Row>
          <Row
            style={{
              textAlign: "right",
            }}
          >
            <Col span={24}>
              <Button onClick={onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button htmlType="submit" type="primary" loading={loading}>
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default ModalAddProject;
