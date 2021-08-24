import { Col, Layout, Row, Input, Space } from "antd";
import React, { useState } from "react";
import 'antd/dist/antd.css';
import "./page-css/Landingpage.css";
import { Link } from "react-router-dom";
import CarouselLanding from "../components/LandingPage/CarouselLandingpage";
import feature_1 from "./page-img/feature_1.png";
import feature_2 from "./page-img/feature_2.png";
import feature_3 from "./page-img/feature_3.png";
import feature_4 from "./page-img/feature_4.jpg";
import imgslogan1 from "./page-img/imgslogan1.jpg";
import userAPI from '../services/userServices'
const { Content } = Layout;
const style = { background: '#0092ff', padding: '8px 0' };

const Landing = () => {

  return (
     <Row>
      <Col>
        <Row className="slogan" style={{ textAlign: "center" }}>
          <Col span={12}>
            <div className="slogan-content">
              <div>
                <h1>Ý Tưởng Thành Hiện Thực </h1>
                <p>
                  Trực quan hoá chiến lược, kế hoạch và tiến độ qua các báo cáo
                  cùng nhiều tương tác đúng thời điểm giúp cho sự cộng tác gắn
                  kết, tăng hiệu quả và năng lực đội ngũ
                </p>
              </div>
              <div className="quick-sign-up">
                <form>
                  <Space>
                    <div class="page">
                      <label class="field field_v3">
                        <input
                          class="field__input"
                          placeholder="abc@gmail.com"
                        />
                        <span class="field__label-wrap">
                          <span class="field__label">E-mail</span>
                        </span>
                      </label>
                    </div>
                    <Link to ="register">
                    <button data-hover="click me!">
                      <div>Miễn phí</div>
                    </button>
                    </Link>
                  </Space>
                </form>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="imgslogan">
              <img src={imgslogan1} alt="login-logo" />
            </div>
          </Col>
    
        </Row>
        <CarouselLanding />
        <Row>
          <Col></Col>
        </Row>
        <div className="slogan-content2">
          <div>
            <h1>Đơn Giản Hóa Công Việc</h1>
            <p>
              Hỗ trợ nhiều loại mẫu dự án cho nhiều lĩnh vực giúp bắt đầu nhanh
              và dễ dàng
            </p>
          </div>
          <div className="benefit">
            <Row>
              <Col span={6}>
                <Link to="/quanly">
                  <div className="case-study">
                    <img src={feature_1} />
                    <div>
                      <h1>Quản lý</h1>
                      <p>
                        Người chịu trách nhiệm của mỗi task, thời hạn của công
                        việc, mối quan hệ của task đó so với toàn bộ tiến độ
                        công việc
                      </p>
                    </div>
                  </div>
                </Link>
              </Col>
              <Col span={6}>
                <Link to="/tienloi">
                  <div className="case-study">
                    <img src={feature_2} />
                    <div>
                      <h1>Dễ dàng</h1>
                      <p>
                        Lựa chọn nhiều loại dự án với các mục đích khác nhau.{" "}
                      </p>
                      <p>
                        Lên kế hoạch, phân chia nhiệm vụ cho các thành viên.{" "}
                      </p>
                    </div>
                  </div>
                </Link>
              </Col>
              <Col span={6}>
                <Link to="/phamvi">
                  <div className="case-study">
                    <img src={feature_3} />
                    <div>
                      <h1>Phạm vi</h1>
                      <p>Có thể sử dụng trên toàn thế giới.</p>
                      <p> Viết trên nền tảng Website và ứng dụng di động.</p>
                    </div>
                  </div>
                </Link>
              </Col>
              <Col span={6}>
                <Link to="/hotro">
                  <div className="case-study">
                    <img src={feature_4} />
                    <div>
                      <h1>Nhận sự hỗ trợ</h1>
                      <p>
                        Sự hỗ trợ từ cộng đồng dùng chung ứng dụng và đội ngũ có
                        kinh nghiệm để có thể trao đổi kinh nghiệm làm việc, tổ
                        chức dự án.
                      </p>
                    </div>
                  </div>
                </Link>
              </Col>
            </Row>
          </div>
        </div>
   
      </Col>
    </Row> 
  );
};
export default Landing;
