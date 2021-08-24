import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Col,
  Menu,
  Row,
  Button,
  Badge,
  notification,
  Select,
  Carousel,
} from "antd";
import {
  UserOutlined,
  UserAddOutlined,
  SketchOutlined,
  ArrowUpOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import Notification from "./Notification";
import "../components-css/Header.css";
import { useDispatch, useSelector } from "react-redux";
import logo from "../components-img/logo.png";
import { logout } from "../../services/authServices";
import { getBanners } from "../../services/userServices";
import { userLogout } from "../../redux/actions/userActions";
import { BANNER_URL } from "../../constants/apiConfig";
import { getNotifications } from "../../services/userServices";
import DayJS from "dayjs";
import { setLanguage } from "../../helper/translations/i18next-config";
import { useTranslation } from "react-i18next";
const { Option } = Select;

const Header = () => {
  const [dataSource, setDataSource] = useState([]);
  const { t } = useTranslation("translation");
  const { signedIn, dataLogin } = useSelector((state) => state.user);
  const history = useHistory();
  const dispatch = useDispatch();
  const [counts, setCounts] = useState();
  const [notifications, setNotifications] = useState();
  const getNotification = async () => {
    try {
      const getNotificationsRes = await getNotifications(dataLogin.token);
      if (getNotificationsRes.data.status === "success") {
        setNotifications(getNotificationsRes.data.data);
        setCounts(getNotificationsRes.data.count);
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
  };
  const signOut = async () => {
    try {
      const logOutRes = await logout();
      if (logOutRes.data.status === "success") {
        notification.success({ message: "Đăng xuất thành công" });
        dispatch(userLogout());
        localStorage.removeItem("user");
        history.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const styleBanner = {
    marginLeft: "20%",
    width: "70%",
    height: "150px",
  };
  const getBannersData = async () => {
    try {
      const getBannersRes = await getBanners();
      let data = [];
      getBannersRes.data.data.reverse().map((dt) => {
        if (dt.active)
          data.push({
            image: dt.image,
            createdDate: DayJS(dt.createdDate).format("DD/MM/YYYY"),
            createdBy: dt.createdBy.name,
          });
      });
      setDataSource(data);
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
    }
  };
  useEffect(() => {
    getBannersData();
    signedIn && getNotification();
  }, []);
  return (
    <>
      <Row
        style={{
          backgroundColor: "white",
          height: "50px",
        }}
        className="nav-wrapper"
      >
        <Col offset={10} span={15} className="right-nav">
          <Menu
            style={{ height: "50px" }}
            className="navigator"
            mode="horizontal"
          >
            <Link
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: "smooth",
                })
              }
              to="/home"
            >
              <Menu.Item>
                <HomeOutlined /> {t("NAVBAR.Home")}
              </Menu.Item>
            </Link>
            <Link
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: "smooth",
                })
              }
              to="/history"
            >
              <Menu.Item key="history">Lịch sử giao dich</Menu.Item>
            </Link>
            <Link
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: "smooth",
                })
              }
              to="/contact"
            >
              <Menu.Item key="contact">Liên hệ</Menu.Item>
            </Link>
            <Link
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: "smooth",
                })
              }
              to="/pricing"
            >
              <Menu.Item key="pricing">Bảng giá</Menu.Item>
            </Link>
            {signedIn === true ? (
              <>
                <Menu.Item key="">
                  <Badge
                    offset={[10, 10]}
                    count={
                      dataLogin.data.premium !== 0 ? (
                        <SketchOutlined style={{ color: "#99FFFF" }} />
                      ) : (
                        <Link to="/premium">
                          <ArrowUpOutlined />
                        </Link>
                      )
                    }
                  >
                    <Link style={{ textTransform: "uppercase" }} to="/profile">
                      {dataLogin.data.name}
                    </Link>
                  </Badge>
                </Menu.Item>
                <Menu.Item onClick={signOut} key="logout">
                  Đăng xuất
                </Menu.Item>
                <Menu.Item style={{ paddingRight: "10px" }}>
                  <Notification
                    getNotification={getNotification}
                    counts={counts}
                    notifications={notifications}
                  />
                  ;
                </Menu.Item>
              </>
            ) : (
              <>
                <Link
                  onClick={() =>
                    window.scrollTo({
                      top: 0,
                      left: 0,
                      behavior: "smooth",
                    })
                  }
                  to="/login"
                >
                  <Menu.Item key="login" icon={<UserOutlined />}>
                    Đăng nhập
                  </Menu.Item>
                </Link>

                <Link
                  onClick={() =>
                    window.scrollTo({
                      top: 0,
                      left: 0,
                      behavior: "smooth",
                    })
                  }
                  to="/register"
                >
                  <Menu.Item key="register" icon={<UserAddOutlined />}>
                    <Button type="primary">Đăng kí</Button>
                  </Menu.Item>
                </Link>
              </>
            )}
            <Menu.Item>
              <Select
                defaultValue="vi"
                onChange={(e) => {
                  setLanguage(e);
                  localStorage.setItem("LANGUAGE", e);
                }}
                style={{ width: "60px" }}
              >
                <Option value="vi">VI</Option>
                <Option value="en">EN</Option>
              </Select>
            </Menu.Item>
          </Menu>
        </Col>
      </Row>
      <Row
        style={{ marginTop: "53px", height: "150px", backgroundColor: "white" }}
      >
        <Col style={{ padding: "0 0 0 50px" }} span={4} className="left-nav">
          <Link to="/home">
            <img style={{ width: "100%" }} src={logo} />
          </Link>
        </Col>
        <Col span={18}>
          <Carousel className="w-full" autoplay>
            {dataSource.map((dt, index) => {
              return (
                <div key={index}>
                  <div style={styleBanner}>
                    <img
                      style={styleBanner}
                      src={BANNER_URL + dt.image}
                      alt="banner"
                    />
                  </div>
                </div>
              );
            })}
          </Carousel>
        </Col>
      </Row>
    </>
  );
};
export default Header;
