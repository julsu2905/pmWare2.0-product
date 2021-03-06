import React, { useState, useEffect, createRef } from "react";
import "antd/dist/antd.css";
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  notification,
  Upload,
  message,
  Spin,
} from "antd";
import { createTask } from "../../../services/userServices";
import { UploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import DayJS from "dayjs";
import { useForm } from "antd/lib/form/Form";
import { UPLOAD_FILE_URL } from "../../../constants/apiConfig";
import { removeFile } from "../../../services/userServices";
import { getLatestDueDate } from "../../../services/userServices";

const { Option } = Select;

const ModalAddTask = ({ options, tasks, getDataProject, project }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = useForm();
  const [fileName, setFileName] = useState();
  const { dataLogin } = useSelector((state) => state.user);
  const { projectId } = useSelector((state) => state.project);
  const { token } = dataLogin;
  const onChangePrerequisiteTask = (e) => {
    form.resetFields(["dateTime"]);
    getDataTask(e);
  };

  const [dataTasks, setDataTasks] = useState();
  const getDataTask = async (e) => {
    try {
      const getTaskRes = await getLatestDueDate(e, dataLogin.token);
      setDataTasks(getTaskRes.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  const now = DayJS();
  const disabledDate = (current) => {
    return (
      current &&
      (now.diff(DayJS(dataTasks)) > 0
        ? current < now
        : current < DayJS(dataTasks) || current < now)
    );
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
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (project.admin._id === dataLogin.data._id || isModerator()) {
        const createTaskRes = await createTask(
          projectId,
          {
            code: values.code,
            name: values.name,
            priority: values.priority,
            watchers: values.watchers,
            attachment: fileName,
            startDate: DayJS(values.dateTime[0]),
            dueDate: DayJS(values.dateTime[1]),
            description: values.description,
            prerequisiteTasks: values.prerequisiteTasks,
          },
          token
        );
        if (createTaskRes.data.status === "success")
          notification.success({ message: "T???o c??ng vi???c th??nh c??ng!" });
        getDataProject();
        setVisible(false);
        form.resetFields();
      } else if (project.admin._id !== dataLogin.data._id) {
        notification.error({
          message: "B???n kh??ng c?? quy???n th??m c??ng vi???c v??o d??? ??n n??y",
        });
        setVisible(true);
      }
    } catch (error) {
      notification.error({ message: error.response.data.message });
      setVisible(true);
    } finally {
      setVisible(false);
      setLoading(false);
      form.resetFields();
    }
  };

  const showDrawer = () => {
    setVisible(true);
  };
  const getTaskCode = () => {
    let lastCode = project.projectTasks[project.projectTasks.length - 1].code;
    let code = lastCode.slice(0, lastCode.indexOf("-"));
    let number =
      parseInt(lastCode.slice(lastCode.indexOf("-") + 1, lastCode.length)) + 1;

    return code + "-" + number;
  };
  const onClose = () => {
    setVisible(false);
  };
  useEffect(() => {
    if (project.projectTasks.length > 0) {
      form.setFieldsValue({
        code: getTaskCode(),
      });
    } else {
      form.setFieldsValue({
        code: project.code + "-" + "0",
      });
    }
  }, [project]);
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
  return (
    <>
      <a onClick={showDrawer}>Th??m c??ng vi???c</a>
      <Drawer
        title={<p className="title-modal">T???o c??ng vi???c (Task)</p>}
        width={720}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
        maskStyle={{
          backgroundImage: `url("https://www.netclipart.com/pp/m/71-710488_grant-clip-art-business-illustration.png")`,
        }}
      >
        <Form
          initialValues={{
            watchers: [],
            prerequisiteTasks: [],
            description: "",
            prerequisiteTasks: [],
          }}
          onFinish={handleSubmit}
          layout="vertical"
          hideRequiredMark
          form={form}
          ref={form}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="C??ng vi???c"
                rules={[
                  { required: true, message: "Vui l??ng nh???p t??n c??ng vi???c" },
                ]}
              >
                <Input placeholder="Vui l??ng nh???p t??n c??ng vi???c" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item name="code" label="M?? c??ng vi???c">
                <Input readOnly />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="M???c ?????"
                rules={[{ required: true, message: "Vui l??ng ch???n m???c ?????" }]}
              >
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
              <Form.Item name="watchers" label="Ng?????i gi??m s??t">
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
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                valuePropName="fileList[0]"
                name="attachment"
                label="File ????nh k??m"
              >
                <p style={{ fontSize: "12px" }}>
                  {" "}
                  <i>
                    <span style={{ color: "red" }}>(*) </span>PDF ho???c CSV
                  </i>
                </p>
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
          <Row>
            <Col span={24}>
              <Form.Item name="prerequisiteTasks" label="Task ti??n quy???t">
                <Select
                  onChange={(e) => {
                    onChangePrerequisiteTask(e);
                  }}
                  mode="multiple"
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  options={tasks}
                ></Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="dateTime"
                label="Th???i gian th???c thi c??ng vi???c"
                rules={[{ required: true, message: "Vui l??ng ch???n ng??y" }]}
              >
                <DatePicker.RangePicker
                  disabledDate={disabledDate}
                  placeholder={["Ng??y b???t ?????u", "Ng??y k???t th??c"]}
                  style={{ width: "100%" }}
                  getPopupContainer={(trigger) => trigger.parentElement}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="description" label="M?? t???">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
          <div
            style={{
              textAlign: "right",
            }}
          >
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              H???y
            </Button>
            <Button loading={loading} htmlType="submit" type="primary">
              T???o c??ng vi???c
            </Button>
          </div>
        </Form>
      </Drawer>
    </>
  );
};

export default ModalAddTask;
