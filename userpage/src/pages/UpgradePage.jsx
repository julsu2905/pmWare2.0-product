import React from "react";
import { Col, Row, Divider, Button, Badge, notification } from "antd";
import DrawerLeft from "../components/components-layout/DrawerLeft";
import "./page-css/UpgradePage.css";
import { CheckOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpgragePage() {
  const history = useHistory();
  const { signedIn } = useSelector((state) => state.user);
  return (
    <>
      <Row className="row-upgrage-content">
        <Col span={3}>
          <DrawerLeft />
        </Col>
        <Col className="price-upgrage" offset={1} span={18}>
          <Row>
            <Col offset={2} span={12}>
              <div className="pricing-wrapper clearfix">
                <div className="pricing-table">
                  <h3 className="pricing-title">Tính năng</h3>

                  <ul className="table-list">
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      Nhiều loại kiểu dữ liệu như: chữ, số, ngày tháng, tập tin
                      đính kèm
                    </li>
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      Bảng Kanban
                    </li>
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      ListView
                    </li>
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      Thông báo email
                    </li>
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      Tính năng nâng cao
                    </li>
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      Theo dòi thời gian, tiến độ công việc
                    </li>
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      Lưu thông tin và chia sẻ tài liệu
                    </li>
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      Hỗ trợ từ cộng đồng và doanh nghiệp
                    </li>
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      Mở rộng và riêng tư
                    </li>
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      Tham khảo những dự án khác
                    </li>
                  </ul>
                </div>
                <div className="pricing-table">
                  <h3 className="pricing-title">Người mới bắt đầu</h3>
                  <div className="price">Miễn phí</div>
                  <ul className="table-list">
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      10 người dùng <span>cho 1 project</span>
                    </li>
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      Kanban & Backlog <span>cho người dùng</span>
                    </li>
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      5 dự án <span>người dùng có thể tạo</span>
                    </li>
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      Dự án đã lưu trữ sẽ bị xóa sau 1 năm
                    </li>
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      Không hỗ trợ ủy quyền
                      <br /> <span>không thể chia sẻ quyền quản lý</span>
                    </li>
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      Phục hồi sau thảm họa
                      <br />
                      <span>nếu bạn đánh mất dữ liệu</span>
                    </li>
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      Nhật kí <span>theo dõi tiến độ công việc</span>
                    </li>
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      2GB lưu trữ <span>on cloud</span>
                    </li>
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      Cộng đồng hỗ trợ
                    </li>
                  </ul>
                </div>

                <div className="pricing-table recommended">
                  <h3 className="pricing-title">Premium</h3>

                  <div className="price">
                    $25<sup>/ tháng</sup>
                  </div>
                  <ul className="table-list">
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      Không giới hạn user <span>cho 1 dự án</span>
                    </li>
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      Kanban & Backlog <span>cho tất cả người dùng</span>
                    </li>
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      Không giới hạn dự án{" "}
                      <span>cho người dùng có thể tạo</span>
                    </li>
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      Dự án được lưu trữ không giới hạn
                    </li>
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      Hỗ trợ ủy quyền <br />{" "}
                      <span>có thể chia sẻ quyền quản lý</span>
                    </li>
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      Phục hồi sau thảm họ
                      <br />
                      <span>nếu bạn đánh mất dữ liệu</span>
                    </li>
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      Nhật kí <span>theo dõi tiến độ công viêch</span>
                    </li>
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      50GB lưu trữ <span>on cloud</span>
                    </li>
                    <li>
                      <CheckOutlined
                        style={{ fontSize: "16px", color: "green" }}
                      />
                      Doanh nghiệp hỗ trợ <span>24/7</span>
                    </li>
                  </ul>
                  <Badge count={"HOT"}>
                    <div className="table-buy">
                      <p>
                        $25<sup>/ tháng</sup>
                      </p>
                      <br />
                      <a
                        onClick={() => {
                          if (signedIn) {
                            history.push("/checkin");
                            window.scrollTo({
                              top: 0,
                              left: 0,
                              behavior: "smooth",
                            });
                          } else
                            notification.warning({
                              message:
                                "Vui lòng đăng nhập để thực hiện mua gói nâng cấp!",
                            });
                        }}
                        className="pricing-action"
                      >
                        Nâng cấp
                      </a>
                    </div>
                  </Badge>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
