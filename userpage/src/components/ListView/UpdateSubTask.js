import React, { useEffect, useState } from "react";
import {
  Input,
  Form,
  notification,
  Button,
  Row,
  Col,
  Upload,
  message,
  Space,
} from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { updateSubTask } from "../../services/userServices.js";
import { useSelector } from "react-redux";
import { UploadOutlined } from "@ant-design/icons";
import Dayjs from "dayjs";
import { useHistory } from "react-router-dom";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { UPLOAD_FILE_URL } from "../../constants/apiConfig.js";
import { removeFile } from "./../../services/userServices";
Dayjs.extend(customParseFormat);

export default function ModalUpdateSubTask() {
  const [loading, setLoading] = useState(false);
  const subTask = useSelector((state) => state.subTask);
  const { projectAdmin, projectId } = useSelector((state) => state.project);
  const { dataLogin } = useSelector((state) => state.user);
  const history = useHistory();
  const [form] = Form.useForm();
  const getSubTask = async () => {
    if (subTask !== undefined)
      form.setFieldsValue({
        name: subTask.name,
        attachment: subTask.attachment,
        description: subTask.description,
      });
  };
  const isModerator = () => {
    var found = false;
    for (var i = 0; i < subTask.projectModerators.length; i++) {
      if (subTask.projectModerators[i]._id == dataLogin.data._id) {
        found = true;
        break;
      }
    }
    return found;
  };
  const handleUpdateSubTask = async (values) => {
    try {
      setLoading(true);
      if (projectAdmin === dataLogin.data._id || isModerator()) {
        const updateSubTaskRes = await updateSubTask(
          subTask.id,
          {
            name: values.name,
            attachment: fileName,
            description: values.description,
            code: subTask.code,
            assignee: subTask.assigneeId,
            startDate: Dayjs(subTask.startDate, "DD/MM/YYYY").format(
              "YYYY/MM/DD"
            ),
            dueDate: Dayjs(subTask.dueDate, "DD/MM/YYYY").format("YYYY/MM/DD"),
            status: subTask.status,
            task: subTask.taskId,
          },
          projectId,
          dataLogin.token
        );
        if (updateSubTaskRes.data.status === "success") {
          {
            notification.success({
              message: "C???p nh???t c??ng vi???c nh??? th??nh c??ng!",
            });
          }
        }
        history.goBack();
      } else if (projectAdmin !== dataLogin.data._id) {
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
  useEffect(() => {
    getSubTask();
  }, []);
  const tailLayout = { labelCol: { span: 8 } };
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
        <Col offset={8} span={5}>
          <Button onClick={() => history.goBack()}>
            <RollbackOutlined /> Tr??? v???
          </Button>
        </Col>
      </Row>
      <Form
        style={{
          marginTop: "50px",
        }}
        onFinish={handleUpdateSubTask}
        form={form}
        label={<p className="title-modal">Ch???nh s???a th??ng tin SubTask</p>}
      >
        <Row
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Col span={8}>
            <Form.Item {...tailLayout} name="name" label="T??n c??ng vi???c">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Col span={8}>
            <Form.Item {...tailLayout} name="attachment" label="File ????nh k??m">
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
        <Row
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Col span={8}>
            <Form.Item {...tailLayout} name="description" label="M?? t???">
              <Input.TextArea rows={4} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
            span={16}
          >
            <Space>
              <Button onClick={() => history.goBack()}>H???y</Button>
              <Button loading={loading} htmlType="submit" type="primary">
                C???p nh???t
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
