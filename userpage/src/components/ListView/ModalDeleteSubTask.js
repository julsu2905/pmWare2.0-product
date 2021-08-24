import React, { useState } from "react";
import { Modal, Button, Form, notification } from "antd";
import { deleteSubTask } from "../../services/userServices";
import { useSelector } from "react-redux";
export default function ModalDeleteSubTask({
    isModalDeleteSubTaskVisible,
    setIsModalDeleteSubTaskVisible,
    project,
    getDataProject,
    subTaskId,
    status
}) {
    const [loading, setLoading] = useState(false);
    const { dataLogin } = useSelector((state) => state.user);
    const handleCancel = () => {
        setIsModalDeleteSubTaskVisible(false);
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
    const handleDeleteSubTask = async () => {
        try {
            setLoading(true)
            if ((project.admin._id === dataLogin.data._id || isModerator()) && status === "assigned") {
                const deleteSubTaskRes = await deleteSubTask(
                    subTaskId,
                    project._id,
                    dataLogin.token
                );

                if (deleteSubTaskRes.data.status === "success") {
                    notification.success({ message: "Xóa công việc nhỏ thành công!" });
                    getDataProject();
                }
            } else if (project.admin_id !== dataLogin.data._id || status !== "assigned") {
                notification.error({ message: "Bạn không có quyền xóa công việc này" });
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
        finally {
            setLoading(false)
            setIsModalDeleteSubTaskVisible(false)
        }
    };
    return (
        <>
            <Modal
                title={<p className="title-modal">Xóa công việc chi tiết</p>}
                visible={isModalDeleteSubTaskVisible}
                footer={null}
                onCancel={handleCancel}
            >
                <Form onFinish={handleDeleteSubTask}>
                    <Form.Item>
                        <p>
                            Bạn có thật sự muốn{" "}
                            <span style={{ color: "red", fontWeight: "bold" }}>XÓA</span> công
                            việc này không, công việc đã xóa
                            <span style={{ color: "red", fontWeight: "bold" }}>
                                {" "}
                                không thể khôi phục
                            </span>
                        </p>
                    </Form.Item>
                    <div style={{ display: 'flex', justifyContent: "flex-end" }} >
                        <Button onClick={handleCancel}>Hủy</Button>
                        <Button style={{ marginLeft: '10px' }} loading={loading} htmlType="submit" type="primary">
                            Xác nhận
                        </Button>
                    </div>
                </Form>
            </Modal>
        </>
    );
}
