import React from "react";
import "../components-css/Footer.css";
import {
  AimOutlined,
  PhoneOutlined,
  GlobalOutlined,
  MailOutlined,
  FacebookOutlined,
  RightOutlined,
  InstagramOutlined,
  TwitterOutlined,
  GithubOutlined,
  GitlabOutlined,
  GooglePlusOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer-area">
      <div className="footer-wave-box">
        <div className="footer-wave footer-animation"></div>
      </div>
      <div className="main">
        <div className="footer" style={{paddingTop:"50px"}}>
          <div className="single-footer">
            <h4>about us</h4>
            <p>Reach out to us</p>
            <div className="footer-social">
              <a href="#">
                <FacebookOutlined />
              </a>
              <a href="#">
                <InstagramOutlined />
              </a>
              <a href="#">
                <TwitterOutlined />
              </a>
              <a href="#">
                <GithubOutlined />
              </a>
              <a href="#">
                <GitlabOutlined />
              </a>
              <a href="#">
                <GooglePlusOutlined />
              </a>
            </div>
          </div>
          <div className="single-footer">
            <h4>Main menu</h4>
            <ul>
              <li>
                <Link to="/home">
                  <RightOutlined />
                  Home
                </Link>
              </li>
              <li>
                <a href="">
                  <RightOutlined />
                  About
                </a>
              </li>
              <li>
                <a href="">
                  <RightOutlined />
                  Services
                </a>
              </li>
              <li>
                <a href="">
                  <RightOutlined />
                  Contact us
                </a>
              </li>
            </ul>
          </div>
          <div className="single-footer">
            <h4>Quick links</h4>
            <ul>
              <li>
                <a href="">
                  <RightOutlined />
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="">
                  <RightOutlined />
                  Terms and conditons
                </a>
              </li>
            </ul>
          </div>
          <div className="single-footer">
            <h4>Contact Us</h4>
            <ul>
              <li>
                <a href="">
                  <AimOutlined /> Chợ Vạn Nguyên
                </a>
              </li>
              <li>
                <a href="">
                  <PhoneOutlined /> 0123456789
                </a>
              </li>
              <li>
                <a href="">
                  <MailOutlined /> nguyen1k9julsu@gmail.com
                </a>
              </li>
              <li>
                <a href="">
                  <GlobalOutlined /> www.heroku.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="copy">
          <p>&copy; QUẢN LÝ DỰ ÁN TRELLO 2021</p>
        </div>
      </div>
    </footer>
  );
}
