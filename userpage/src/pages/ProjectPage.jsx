import React, { useState, useEffect } from "react";
import { Row, Col, Spin } from "antd";
import Slidebar from "../components/components-layout/Slidebar";
import KanbanView from "../components/ProjectPage/KanbanView";
import ListView from "../components/ProjectPage/ListView";
import { getProject, getProjectLog } from "../services/projectServices";
import { useSelector } from "react-redux";
import GanttChartView from "../components/ProjectPage/GanttChartView";

export default function ProjectPage() {
  const { dataLogin } = useSelector((state) => state.user);
  const { projectId } = useSelector((state) => state.project);
  const [members, setMembers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [project, setProject] = useState();
  const [loading, setLoading] = useState();
  const [tasks, setTasks] = useState([]);
  const [content, setContent] = useState("list");
 

  const getDataProject = async () => {
    try {
      setLoading(true);
      const getDataProjectRes = await getProject(projectId, dataLogin.token);
      const getDataLogRes = await getProjectLog(projectId, dataLogin.token);

      let dataMembers = [];
      let dataTasks = [];
      getDataProjectRes.data.data.members.map((dt) => {
        dataMembers.push({
          label: dt.name,
          value: dt._id,
        });
      });
      getDataProjectRes.data.data.projectTasks.map((dt) => {
        dataTasks.push({
          label: dt.name,
          value: dt._id,
        });
      });
      setTasks(dataTasks);
      setMembers(dataMembers);
      setProject(getDataProjectRes.data.data);
      setLogs(getDataLogRes.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getDataProject();
  }, []);

  return (
    <Row style={{marginTop:"10px"}}>
      <Col span={3}>
        <Spin spinning={loading}>
          <Slidebar
            getDataProject={getDataProject}
            tasks={tasks}
            options={members}
            setContent={setContent}
            project={project}
            logs={logs}
            loading={loading}
          />
          ;
        </Spin>
      </Col>
      <Col offset={1} style={{ textAlign: "center" }} span={20}>
        <Spin spinning={loading}>
      
          {content === "list" ? (
            <Row>
              <Col span={24}>
                <ListView
                  loading={loading}
                  project={project}
                  getDataProject={getDataProject}
                  tasks={tasks}
                  options={members}
                />
              </Col>
            </Row>
          ) : content === "kanban" ? (
            <Row>
              <Col span={24}>
                <KanbanView
                  getDataProject={getDataProject}
                  members={members}
                  project={project}
                />
              </Col>
            </Row>
          ) : (
            <Row>
              <Col span={24}>
                <GanttChartView
                  getDataProject={getDataProject}
                  members={members}
                  project={project}
                  tasks={tasks}
                />
              </Col>
            </Row>
          )}
        </Spin>
      </Col>
    </Row>
  );
}
