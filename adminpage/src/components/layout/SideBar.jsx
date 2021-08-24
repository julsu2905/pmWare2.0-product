import { Menu, Row, Col } from "antd";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import {
  UserOutlined,
  MoneyCollectOutlined,
  PropertySafetyOutlined,
  HomeOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";

const SideBar = () => {
  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname);
  const { t } = useTranslation("translation");
  const history = useHistory();
  const handleClick = (e) => {
    setCurrent(e.key);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    history.push(`${e.key}`);
  };
  return (
    <Row className="flex justify-center">
      <Col className="image-wrapper">
        <img
          style={{ height: "120px" }}
          src={"/favicon.ico"}
          alt="login-logo"
        />
      </Col>
      <Col>
        <Menu
          theme={"dark"}
          onClick={handleClick}
          selectedKeys={[current]}
          mode="inline"
        >
          <Menu.Item
            className="rounded-2xl"
            icon={<HomeOutlined />}
            key="/Dashboard"
          >
            {t("SIDEBAR.Dashboard")}
          </Menu.Item>
          <Menu.Item
            className="rounded-2xl"
            icon={<UserOutlined />}
            key="/User"
          >
            {t("User")}
          </Menu.Item>
          <Menu.Item
            className="rounded-2xl"
            icon={<DollarCircleOutlined />}
            key="/Price"
          >
            {t("Price")}
          </Menu.Item>
          <Menu.Item
            className="rounded-2xl"
            icon={<MoneyCollectOutlined />}
            key="/Code"
          >
            {t("SIDEBAR.Code")}
          </Menu.Item>
          <Menu.Item
            className="rounded-2xl"
            icon={<MoneyCollectOutlined />}
            key="/Banner"
          >
            {t("SIDEBAR.Banner")}
          </Menu.Item>
          <Menu.Item
            className="rounded-2xl"
            icon={<MoneyCollectOutlined />}
            key="/Promotion"
          >
            {t("SIDEBAR.Promotion")}
          </Menu.Item>

          <Menu.Item
            className="rounded-2xl"
            icon={<PropertySafetyOutlined />}
            key="/Settings"
          >
            {t("SIDEBAR.Settings")}
          </Menu.Item>
        </Menu>
      </Col>
    </Row>
  );
};
export default SideBar;
