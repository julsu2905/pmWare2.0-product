import React from "react";
import "../components-css/PackageInfomation.css";
import { Row, Col, Input, Badge } from "antd";

export default function PackageInfomation({ selected }) {
  return (
    <section class="page-contain">
      <Badge.Ribbon
        style={{ fontSize: "20px" }}
        color="red"
        text={`Discount ${Math.abs(
          ((25 / 30) * selected.name - selected.price) / 100
        ).toFixed(2)}%`}
      >
        <div href="#" class="data-card">
          <h3>Gói - {selected.name} Individual</h3>
          <div className="data-card-info">
            <Row>
              <Col offset={2} span={10}>
                <h4>Số ngày Premium</h4>
              </Col>
              <Col span={10}>
                <Input
                  style={{ pointerEvents: "none" }}
                  readOnly
                  value={`${selected.name} ngày`}
                />
              </Col>
            </Row>
            <Row>
              <Col offset={2} span={10}>
                <h4>Giá sau khi giảm</h4>
              </Col>
              <Col span={10}>
                <Input
                  style={{ pointerEvents: "none" }}
                  readOnly
                  value={`${selected.price} USD`}
                />
              </Col>
            </Row>

            <Row>
              <Col offset={2} span={22}>
                <p>MÔ TẢ</p>
                <p>Đăng kí các gói linh hoạt theo nhu cầu của bạn!</p>
              </Col>
            </Row>
          </div>
        </div>
      </Badge.Ribbon>
    </section>
  );
}
