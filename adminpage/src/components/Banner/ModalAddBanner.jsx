import {
  Form,
  Modal,
  Button,
  notification,
  Row,
  Col,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import day from "dayjs";
import { useSelector } from "react-redux";
import { createBanner, removeFileBanner } from "../../services/bannerServices";
import { UPLOAD_URL } from "../../constants/apiConfig";

const ModalAddBanner = ({
  visible,
  setVisible,
  getBannersData,
  setLoading,
}) => {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const { dataLogin } = useSelector((state) => state.user);
  const handleOk = async () => {
    try {
      setLoading(true);
      setConfirmLoading(true);
      const createBannerRes = await createBanner({
        image: imageUrl,
        createdDate: day(),
        createdBy: dataLogin.data._id,
      });
      if (createBannerRes.data.status === "success") {
        notification.success({ message: "Add banner Successfully!" });
        getBannersData();
        form.resetFields();
      }
      setVisible(false);
      setLoading(false);
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
      setConfirmLoading(false);
      setConfirmVisible(false);
    }
  };
  const [form] = useForm();
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
  return (
    <>
      <Modal
        title="Add Banner"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button
            onClick={() => {
              if (
                form.getFieldValue("banner") === "" ||
                form.getFieldValue("banner") === undefined
              )
                notification.warning({
                  message: "Please upload an image",
                });
              else setConfirmVisible(true);
            }}
            type="primary"
          >
            OK
          </Button>,
          <Button onClick={() => setVisible(false)}>Cancel</Button>,
        ]}
      >
        <Form layout="vertical" form={form}>
          <Row gutter={[5, 0]}>
            <Col span={24} className="flex justify-center">
              <Form.Item name="banner" valuePropName="fileList[0]">
                <Upload
                  name="banner"
                  action={UPLOAD_URL}
                  withCredentials
                  listType="picture"
                  multiple={false}
                  beforeUpload={beforeUpload}
                  onChange={(info) => {
                    const { status } = info.file;
                    if (status === "uploading") {
                      return;
                    }
                    if (status === "done") {
                      message.success(`File uploaded successfully.`);
                      setImageUrl(info.file.response.banner[0].filename);
                    } else if (status === "error") {
                      message.error(`File upload failed.`);
                    }
                  }}
                  onRemove={async (info) => {
                    try {
                      await removeFileBanner(imageUrl);
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal
        title="Alert"
        visible={confirmVisible}
        confirmLoading={confirmLoading}
        onCancel={() => setVisible(false)}
        footer={[
          <Button onClick={handleOk} type="primary">
            OK
          </Button>,
          <Button onClick={() => setConfirmVisible(false)}>Cancel</Button>,
        ]}
      >
        Do you want to add this banner?
      </Modal>
    </>
  );
};
export default ModalAddBanner;
