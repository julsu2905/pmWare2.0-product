import React, { useState, createRef } from "react";
import { useSelector } from "react-redux";
import { createSubTask } from "../../../services/userServices";
import DayJS from "dayjs";
import { useForm } from "antd/lib/form/Form";
import { UploadOutlined } from "@ant-design/icons";
import {
  Modal,
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
} from "antd";
import { UPLOAD_FILE_URL } from "../../../constants/apiConfig";
import { removeFile } from "../../../services/userServices";
import { getTask } from "../../../services/userServices";

export default function ModalAddSubTask({
  isModalAddSubTaskVisible,
  setIsModalAddSubTaskVisible,
  options,
  tasks,
  getDataProject,
  project,
}) {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const { dataLogin } = useSelector((state) => state.user);
  const { projectId } = useSelector((state) => state.project);
  const { token } = dataLogin;
  const [disable, setDisable] = useState(false);
  const defaultSelect = (e) => {
    getDataTask(e);
    setDisable(true);
  };

  const [dataTasks, setDataTasks] = useState();
  const getDataTask = async (e) => {
    try {
      const getTaskRes = await getTask(e, dataLogin.token);
      setDataTasks(getTaskRes.data.task);
    } catch (error) {
      console.log(error);
    }
  };

  const disabledDate = (current) => {
    return (
      current &&
      (current < DayJS(dataTasks && dataTasks.startDate) ||
        current > DayJS(dataTasks && dataTasks.dueDate))
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
  console.log(project);
  const handleSubmit = async (values) => {
    try {
      setLoading(true)
      if (project.admin._id === dataLogin.data._id || isModerator()) {
        const createSubTaskRes = await createSubTask(
          values.task,
          projectId,
          {
            code: values.code,
            name: values.name,
            status: values.status,
            assignee: values.assignee,
            attachment: fileName,
            startDate: DayJS(values.dateTime[0]),
            dueDate: DayJS(values.dateTime[1]),
            description: values.description,
          },
          token
        );
        if (createSubTaskRes.data.status === "success") {
          notification.success({ message: "T???o c??ng vi???c nh??? th??nh c??ng!" });
          getDataProject();
          setIsModalAddSubTaskVisible(false);
        }

      } else if (project.admin_id !== dataLogin.data._id) {
        notification.error({
          message: "B???n kh??ng c?? quy???n th??m c??ng vi???c nh??? d??? ??n n??y",
        });
        setIsModalAddSubTaskVisible(true);
      }
    } catch (error) {
      console.log(error);
      notification.error({ message: error.response.data.message });
      setIsModalAddSubTaskVisible(true);
    }
    finally{
      setLoading(false);
      form.resetFields()
    }
  };

  const handleCancel = () => {
    setIsModalAddSubTaskVisible(false);
  };
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

  return (
    <>
      <Modal
        title={<p className="title-modal">B???ng th??m c??ng vi???c (SubTasks)</p>}
        onCancel={handleCancel}
        visible={isModalAddSubTaskVisible}
        footer={null}
        maskStyle={{
          backgroundImage: `url("https://www.pngitem.com/pimgs/m/55-554703_transparent-charades-clipart-technology-in-business-png-png.png")`,
        }}
      >
        <Form
        ref={form}
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          hideRequiredMark
          initialValues={{
            watchers: [""],
            task: "",
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="T??n c??ng vi???c nh???"
                rules={[
                  {
                    required: true,
                    message: "Vui l??ng nh???p t??n c??ng vi???c nh???",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="code" label="M?? c??ng vi???c nh???">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="assignee" label="Ng?????i ???????c ph??n c??ng">
                <Select options={options}></Select>
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
               <p style={{fontSize:"12px"}}> <i><span style={{color:"red"}}>(*) </span>PDF ho???c CSV</i></p>
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
              <Form.Item
                name="task"
                label="C??ng vi???c l???n"
                rules={[
                  { required: true, message: "Vui l??ng ch???n c??ng vi???c l???n" },
                ]}
              >
                <Select
                  onChange={(e) => {
                    defaultSelect(e);
                  }}
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
                  disabled={disable === true ? false : true}
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
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              H???y
            </Button>
            <Button loading={loading} htmlType="submit" type="primary">
              T???o c??ng vi???c
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
