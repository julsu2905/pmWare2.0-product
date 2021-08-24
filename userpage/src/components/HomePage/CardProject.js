import React, { useState } from "react";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Row,
  Dropdown,
  Button,
  Menu,
  Input,
  notification,
} from "antd";
import ModalAchive from "./ModalAchive";
import ModalUpdateProject from "./ModalUpdateProject";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "../../pages/page-css/Home.css";
import { selectProject } from "../../redux/actions/projectActions";
export default function CardAllProject({ project, getProject }) {
  const { dataLogin } = useSelector((state) => state.user);
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false);
  const [isModalArchiveVisible, setIsModalArchiveVisible] = useState(false);
  const showModalModalArchive = () => {
    setIsModalArchiveVisible(true);
  };
  const history = useHistory();
  const dispatch = useDispatch();
  const linkToProject = () => {
    dispatch(
      selectProject({
        projectId: project._id,
        projectAdmin: project.admin,
      })
    );
    localStorage.setItem(
      "project",
      JSON.stringify({
        projectId: project._id,
        projectAdmin: project.admin,
      })
    );
    history.push(`/projectpage/${project.name}`);
  };

  const menu = (
    <Menu>
      {(project && project.archived === true) ||
      (project && project.active === false) ? (
        <Menu.Item>
          <Button disabled>Sửa</Button>
        </Menu.Item>
      ) : (
        <Menu.Item>
          <Button onClick={() => setModalUpdateVisible(true)}>Sửa</Button>
        </Menu.Item>
      )}
    </Menu>
  );
  return (
    <>
      {modalUpdateVisible && (
        <ModalUpdateProject
          setModalUpdateVisible={setModalUpdateVisible}
          visible={modalUpdateVisible}
          projectId={project._id}
          projectAd={project.admin}
          loadData={getProject}
        />
      )}

      <div className="card">
        <a className="card-title" onClick={linkToProject}>
          {project && project.name}
        </a>
        <img
          src="https://images.unsplash.com/photo-1591485423007-765bde4139ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80"
          alt=""
        />
        <Card
          className="card-desc"
          title={
            <>
              <Row>
                <Col span={2}>
                  {" "}
                  {project && project.visibility === "private" ? (
                    <p>
                      {" "}
                      <EyeInvisibleOutlined /> Private{" "}
                    </p>
                  ) : (
                    <p>
                      {" "}
                      <EyeOutlined /> Open
                    </p>
                  )}
                </Col>
                <Col offset={17} span={5}>
                  {" "}
                  <Dropdown overlay={menu} placement="topRight" arrow>
                    <Button>...</Button>
                  </Dropdown>
                </Col>
              </Row>
              <Row>
                <Col>
                  {project && dataLogin.data._id === project.admin ? (
                    <p style={{ textAlign: "center" }}>
                      <SolutionOutlined /> Admin
                    </p>
                  ) : (
                    <p>Member</p>
                  )}
                </Col>
              </Row>
              <Row
                style={{
                  textTransform: "uppercase",
                  textShadow: "-1px 0 black, 0 1px black",
                  color: "black",
                }}
              >
                <Col span={24}>
                  <a onClick={linkToProject}>{project && project.name}</a>
                </Col>
              </Row>
            </>
          }
          style={{ width: "100%" }}
        >
          <a onClick={linkToProject}>
            <Button className="custom-btn btn-3">
              <span>Xem chi tiết</span>
            </Button>
          </a>
          <div style={{ marginTop: "10px" }}>
            {dataLogin.data.premium === 0 || project.archived === true && project.active === false? (
                     <div>
                     <Button
                       disabled
                       onClick={showModalModalArchive}
                       className="btn-store"
                     >
                       Lưu trữ
                     </Button>
                
                   </div>
            ) : (
              <div>
              <Button onClick={showModalModalArchive} className="btn-store">
                Lưu trữ
              </Button>
              <ModalAchive
                project={project}
                getProject={getProject}
                isModalArchiveVisible={isModalArchiveVisible}
                setIsModalArchiveVisible={setIsModalArchiveVisible}
              />
            </div>
            )}
          </div>

          <span className="startDay">
            <i>Ngày tạo:</i>
          </span>
          <Input
            className="input-startDay"
            prefix={project && project.createdDate}
          />
        </Card>
      </div>
    </>
  );
}
