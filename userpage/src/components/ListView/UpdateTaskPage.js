import React, { useEffect, useState } from "react";
import {
  Input,
  Form,
  Upload,
  Button,
  Row,
  Col,
  Select,
  notification,
  message,
} from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { UploadOutlined } from "@ant-design/icons";
import Dayjs from "dayjs";
import { useHistory } from "react-router-dom";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { UPLOAD_FILE_URL } from "../../constants/apiConfig";
import { removeFile } from "../../services/userServices";
import { useSelector } from "react-redux";
import { updateTask } from "../../services/userServices";
Dayjs.extend(customParseFormat);
const Option = Select;
export default function ModalUpdateTask({}) {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const task = useSelector((state) => state.task);
  const { projectAdmin } = useSelector((state) => state.project);
  const { dataLogin } = useSelector((state) => state.user);
  const [form] = Form.useForm();
  const getTask = async () => {
    if (task !== undefined)
      form.setFieldsValue({
        name: task.name,
        attachment: task.attachment,
        description: task.description,
        code: task.code,
        priority: task.priority,
        watchers: task.watchers,
      });
  };
  const isModerator = () => {
    var found = false;
    for (var i = 0; i < task.projectModerators.length; i++) {
      if (task.projectModerators[i]._id == dataLogin.data._id) {
        found = true;
        break;
      }
    }
    return found;
  };
  const handleUpdateTask = async (values) => {
    try {
      setLoading(true);
      if (projectAdmin === dataLogin.data._id || isModerator()) {
        const updateTaskRes = await updateTask(
          task.id,
          {
            name: values.name,
            priority: values.priority,
            watchers: values.watchers.map((dt) => dt.value),
            attachment: fileName,
            description: values.description,
          },
          task.project,
          dataLogin.token
        );
        if (updateTaskRes.data.status === "success") {
          {
            notification.success({
              message: "C???p nh???t c??ng vi???c th??nh c??ng!",
            });
          }
        }
        history.goBack();
      } else if (projectAdmin !== dataLogin.data._id || !isModerator()) {
        notification.error({
          message: "B???n kh??ng c?? quy???n s???a ?????i c??ng vi???c n??y",
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
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getTask();
  }, [task]);

  const [fileName, setFileName] = useState();
  function beforeUpload(file) {
    const isJpgOrPng =
      file.type === "application/pdf" ||
      file.type === "application/vnd.ms-excel";
    if (!isJpgOrPng) {
      notification.error({ message: "B???n ch??? c?? th??? t???i l??n PDF/CSV file!" });
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      notification.error({ message: "H??nh c???n ph???i nh??? h??n 2MB!" });
    }
    return isJpgOrPng && isLt2M;
  }
  const tailLayout = { labelCol: { span: 6 } };
  return (
    <div
      style={{
        paddingTop: "10px",
        marginTop: "20px",
        border: "1px solid ccc",
        boxShadow: " 0 0 11px rgba(33,33,33,.2)",
      }}
    >
      <Row style={{ marginTop: "20px" }}>
        <Col offset={6} span={5}>
          <Button onClick={() => history.goBack()}>
            <RollbackOutlined /> Tr??? v???
          </Button>
        </Col>
      </Row>
      <Row style={{ marginTop: "50px" }}>
        <Col offset={6} span={15}>
          <Form
            form={form}
            onFinish={handleUpdateTask}
            label={<p className="title-modal">Ch???nh s???a th??ng tin c??ng vi???c</p>}
          >
            <Row gutter={[16, 0]}>
              <Col span={12} md={12}>
                <Form.Item {...tailLayout} name="name" label="C??ng vi???c">
                  <Input placeholder="Vui l??ng nh???p t??n c??ng vi???c" />
                </Form.Item>
              </Col>

              <Col span={12} md={12}>
                <Form.Item
                  {...tailLayout}
                  wrapperCol={{ span: 12 }}
                  name="code"
                  label="M?? c??ng vi???c"
                >
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item {...tailLayout} name="priority" label="M???c ?????">
                  <Select placeholder="Vui l??ng ch???n m???c ?????">
                    <Option value="Critical">
                      <div className="priority">
                        <span className="priority-color" id="critical-color">
                          00
                        </span>
                        <span>Critical</span>
                      </div>
                    </Option>
                    <Option value="High">
                      <div className="priority">
                        <span className="priority-color" id="high-color">
                          00
                        </span>
                        <span>High</span>
                      </div>
                    </Option>
                    <Option value="Normal">
                      <div className="priority">
                        <span className="priority-color" id="normal-color">
                          00
                        </span>
                        <span>Normal</span>
                      </div>
                    </Option>
                    <Option value="Low">
                      <div className="priority">
                        <span className="priority-color" id="low-color">
                          00
                        </span>
                        <span>Low</span>
                      </div>
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  {...tailLayout}
                  name="watchers"
                  label="Ng?????i gi??m s??t"
                >
                  <Select
                    options={task.members}
                    mode="multiple"
                    allowClear
                    labelInValue
                    style={{ width: "100%" }}
                    placeholder="Please select"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  {...tailLayout}
                  name="attachment"
                  label="File ????nh k??m"
                >
                  <Upload
                    name="attachment"
                    multiple={false}
                    beforeUpload={beforeUpload}
                    action={UPLOAD_FILE_URL}
                    onChange={(info) => {
                      const { status } = info.file;
                      if (status === "uploading") {
                        return;
                      }
                      if (status === "done") {
                        message.success(`File uploaded successfully.`);
                        setFileName(info.file.response.attachment[0].filename);
                      } else if (status === "error") {
                        message.error(`File upload failed.`);
                      }
                    }}
                    onRemove={async (info) => {
                      try {
                        await removeFile(fileName);
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                    listType="text"
                  >
                    <Button icon={<UploadOutlined />}>T???i l??n</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 3 }}
                  name="description"
                  label="M?? t???"
                >
                  <Input.TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
            <Col span={24}
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                onClick={() => history.goBack()}
                style={{ marginRight: 8 }}
              >
                H???y
              </Button>
              <Button htmlType="submit" type="primary">
                C???p nh???t
              </Button>
            </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
