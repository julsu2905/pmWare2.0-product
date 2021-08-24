import SearchBar from "../common/SearchBar";
import { Row, Col, Button, notification } from "antd";
import { PoweroffOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../services/authServices";
import { userLogout } from "../../redux/actions/userActions";
import { useHistory } from "react-router-dom";
import "../component-css/Switch.css";
import { selectView } from "./../../redux/actions/viewActions";
import { setLanguage } from "../../helper/translations/i18next-config";
import { useTranslation } from "react-i18next";

const CHeader = ({
  title,
  description,
  showSearch,
  showSwitch,
  searchType,
}) => {
  const { dataLogin, signedIn } = useSelector((state) => state.user);
  const { i18n } = useTranslation("translation");
  const { type } = useSelector((state) => state.view);
  const history = useHistory();
  const dispatch = useDispatch();
  const logOut = async () => {
    try {
      const logOutRes = await logout();
      if (logOutRes.data.status === "success") {
        localStorage.removeItem("user");
        dispatch(userLogout());
        notification.success({ message: "Đăng xuất thành công!" });
        history.push("/");
      }
    } catch (error) {
      notification.error({ message: "Lỗi" });
    }
  };
  return (
    <Row className="text-gray-200 border-b border-blue-200 py-2 h-full">
      <Col span={24} md={6}>
        <Row>
          <Col className="text-xl font-semibold" span={24}>
            {title}
          </Col>
          <Col className="text-xs " span={24}>
            {description}
          </Col>
        </Row>
      </Col>
      {showSearch && (
        <Col className="flex content-around" md={8} span={0}>
          <Row className="w-full">
            <Col className="flex items-center" span={24}>
              <SearchBar type={searchType} />
            </Col>
          </Row>
        </Col>
      )}
      {showSwitch && (
        <Col className="flex justify-center" md={4} span={0}>
          <Row>
            <Col className="flex justify-center items-center" span={24}>
              <Button
                onClick={() => {
                  dispatch(selectView("list"));
                }}
                style={{
                  background: "#066fd0",
                  color: "rgb(229, 231, 235)",
                }}
                className={
                  type === "list"
                    ? "selected border-0 h-10 py-2 leading-3"
                    : " border-0 h-10 py-2 leading-3"
                }
              >
                List View
              </Button>
              <Button
                onClick={() => {
                  dispatch(selectView("grid"));
                }}
                style={{
                  background: "#066fd0",
                  color: "rgb(229, 231, 235)",
                }}
                className={
                  type === "grid"
                    ? "selected border-0 h-10 py-2 leading-3"
                    : " border-0 h-10 py-2 leading-3"
                }
              >
                Grid View
              </Button>
            </Col>
          </Row>
        </Col>
      )}
      {signedIn && (
        <Col
          className="flex items-center justify-end"
          md={
            !showSearch && !showSwitch
              ? 18
              : !showSearch && showSwitch
              ? 14
              : showSearch && !showSwitch
              ? 10
              : 6
          }
          span={0}
        >
          <div className="lang-switch">
            <Button
              onClick={() => {
                setLanguage("vi");
              }}
              style={{
                background: "#066fd0",
                color: "rgb(229, 231, 235)",
              }}
              className={
                i18n.language === "vi"
                  ? "selected rounded-xl border-0 h-10 py-2 leading-3"
                  : " border-0 rounded-xl h-10 py-2 leading-3"
              }
            >
              <img
                className="w-full object-cover"
                src={`./img/640px-Flag_of_Vietnam.svg.png`}
                alt="vn-flg"
              />
            </Button>
            <Button
              onClick={() => {
                setLanguage("en");
              }}
              style={{
                background: "#066fd0",
                color: "rgb(229, 231, 235)",
              }}
              className={
                i18n.language === "en"
                  ? "selected rounded-xl border-0 mr-2 h-10 py-2 leading-3"
                  : " border-0 rounded-xl h-10 mr-2 py-2 leading-3"
              }
            >
              <img
                className="w-full object-cover"
                src={`./img/1200px-Flag_of_the_United_Kingdom.svg.png`}
                alt="en-flg"
              />
            </Button>
          </div>
          {dataLogin.data.name} &nbsp;
          <Button
            onClick={logOut}
            className="leading-none"
            type="danger"
            icon={<PoweroffOutlined />}
          />
        </Col>
      )}
    </Row>
  );
};
export default CHeader;
