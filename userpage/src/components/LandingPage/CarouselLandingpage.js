import React from "react";
import { Carousel, Radio } from "antd";
import "../../pages/page-css/Landingpage.css";
import { Tabs } from "antd";
import tongquan from "../../pages/page-img/tongquan.PNG";
import kanban from "../../pages/page-img/kanban.PNG";
import backlog from "../../pages/page-img/backlog.PNG";
import { Col, Layout, Row, Input, Space } from "antd";

const { TabPane } = Tabs;
const contentStyle = {
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

const CarouselLandingpage = () => {
  const [dotPosition, setDotPosition] = React.useState("top");

  const handlePositionChange = ({ target: { value } }) => {
    setDotPosition(value);
  };

  function callback(key) {
    console.log(key);
  }

  return (
    <>
      <Row>
        <Col>
          <Row>
            <Col span={3}></Col>
            <Col span={19}>
              <div className="card-container">
              <div className="Carousel-landing">
          <h1>Trực quan hóa công việc</h1>
          <p>Có nhiều góc cạnh khác nhau với nhiều vai trò khác nhau</p></div>
                <Tabs type="card">
                  <TabPane tab="Tổng quan" key="1">
                    <img src={tongquan} />
                  </TabPane>
                  <TabPane tab="Kanban" key="2">
                    <img src={kanban} />
                  </TabPane>
                  <TabPane tab="Backlog" key="3">
                    <img src={backlog} />
                  </TabPane>
                </Tabs>
              </div>
            </Col>
            <Col span={2}>
            </Col>
          </Row>
          <Row>
            <Col></Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};
export default CarouselLandingpage;
