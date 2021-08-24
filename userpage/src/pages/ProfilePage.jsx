import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Divider,
  Form,
  Input,
  Button,
  Upload,
  notification,
  message,
  Image,
} from "antd";
import DrawerLeft from "../components/components-layout/DrawerLeft";
import ModalChangePassword from "../components/Profile/ModalChangePassword";
import "./page-css/Profile.css";
import { useDispatch, useSelector } from "react-redux";
import {
  UserOutlined,
  SketchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { AVATAR_URL, UPLOAD_URL } from "./../constants/apiConfig";
import { removeFileAvatar, updateUser } from "../services/userServices";
import { useHistory } from "react-router-dom";
import { userLoggin } from "./../redux/actions/userActions";
const { TextArea } = Input;
export default function ProfilePage() {
  const [loading,setLoading] = useState()
  const { dataLogin } = useSelector((state) => state.user);
  const [form] = Form.useForm();
  const history = useHistory();
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState();
  const submit = async (values) => {
    try {
      setLoading(true)
      const { name, bio, avatar } = values;
      if (avatar === undefined || avatar.fileList.length === 0) {
        const updateUserRes = await updateUser(
          dataLogin.data._id,
          {
            name,
            bio,
          },
          dataLogin.token
        );
        if (updateUserRes.data.status === "success") {
          notification.success({ message: "Cập nhật tài khoản thành công!" });
          dispatch(
            userLoggin({
              data: {
                ...updateUserRes.data.user,
              },
              token: dataLogin.token,
            })
          );
          localStorage.setItem(
            "user",
            JSON.stringify({
              data: {
                ...updateUserRes.data.user,
              },
              token: dataLogin.token,
            })
          );
          form.resetFields();
        }
      } else {
        const updateUserRes = await updateUser(
          dataLogin.data._id,
          {
            name,
            bio,
            avatar: imageUrl,
          },
          dataLogin.token
        );
        if (updateUserRes.data.status === "success") {
          notification.success({ message: "Cập nhật tài khoản thành công!" });
          dispatch(
            userLoggin({
              data: {
                ...updateUserRes.data.user,
              },
              token: dataLogin.token,
            })
          );
          localStorage.setItem(
            "user",
            JSON.stringify({
              data: {
                ...updateUserRes.data.user,
              },
              token: dataLogin.token,
            })
          );
          form.resetFields();
        }
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
    }
    finally{
      setLoading(false)
    }
  };
  useEffect(() => {
    form.setFieldsValue({
      username: dataLogin.data.name,
      bio: dataLogin.data.bio,
      premium: dataLogin.data.premium,
    });
  }, [dataLogin]);
  function beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      notification.error({ message: "Bạn chỉ có thể tải lên JPG/PNG file!" });
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      notification.error({ message: "Hình cần phải nhỏ hơn 2MB!" });
    }
    return isJpgOrPng && isLt2M;
  }
  const tailLayout = { labelCol: { span: 8 } };
  return (
    <Row className="row-profile-content">
      <Col span={3}>
        <DrawerLeft />
      </Col>
      <Col className="col-profile" span={20}>
        <div className="profile">
          <Row>
            <Col style={{ marginTop: "20px" }} offset={2} span={16}>
              <div>
                <h1>Hồ sơ</h1>
              </div>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col span={24}>
              <Form
                onFinish={submit}
                form={form}
                style={{ textAlign: "center" }}
              >
                <Row
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <Col xl={8} span={24}>
                    <Form.Item
                      name="avatar"
                      valuePropName="fileList[0]"
                      className="register-input"
                    >
                      <Upload
                        name="avatar"
                        action={UPLOAD_URL}
                        multiple={false}
                        listType="picture"
                        beforeUpload={beforeUpload}
                        onChange={(info) => {
                          const { status } = info.file;
                          if (status === "uploading") {
                            return;
                          }
                          if (status === "done") {
                            message.success(`File uploaded successfully.`);
                            setImageUrl(info.file.response.avatar[0].filename);
                          } else if (status === "error") {
                            message.error(`File upload failed.`);
                          }
                        }}
                        onRemove={async (info) => {
                          try {
                            await removeFileAvatar(imageUrl);
                          } catch (error) {
                            console.log(error);
                          }
                        }}
                      >
                        Your Avatar
                        <Button
                          style={{ marginLeft: "5px" }}
                          icon={<UploadOutlined />}
                        >
                          Upload
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                  <Col xl={8} span={24}>
                    <Form.Item>
                      <Button
                        onClick={() => history.push("/premium")}
                        type="primary"
                      >
                        Nâng cấp tài khoản
                      </Button>
                    </Form.Item>
                  </Col>
                  <Col xl={8} span={24}>
                    <Form.Item>
                      <ModalChangePassword />
                    </Form.Item>
                  </Col>
                  <Col xl={4} span={24}>
                    <Image
                      width={200}
                      height={200}
                      src={AVATAR_URL + dataLogin.data.avatar}
                      fallback="data:image/png;base64,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"
                    />
                  </Col>
                  <Col xl={10} span={24}>
                    <Form.Item {...tailLayout} name="premium" label="Gói">
                      <Input
                        readOnly
                        prefix={<SketchOutlined style={{ color: "#99FFFF" }} />}
                      />
                    </Form.Item>
                    <Form.Item
                      {...tailLayout}
                      name="username"
                      label="User name"
                    >
                      <Input prefix={<UserOutlined />} />
                    </Form.Item>
                    <Form.Item {...tailLayout} label="Tiểu sử" name="bio">
                      <TextArea prefix={<UserOutlined />} rows={4} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row className="row-input">
                  <Col offset={8} span={24}>
                    <Button loading={loading} htmlType="submit" type="primary">
                      Lưu
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
}
