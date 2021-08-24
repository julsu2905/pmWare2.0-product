import React, { useState } from "react";
import { Drawer, Button, Divider } from "antd";
import { Link } from "react-router-dom";
import "../../pages/page-css/Home.css";

const DrawerLeft = () => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <div className="btn-showmore">
        <Button style={{ width: "180px" }} onClick={showDrawer}>
          Thanh Bên
        </Button>
      </div>
      <Drawer
        title="Dashboard"
        placement="left"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <div className="left-slibar">
          <div>
            <Link to="/">
              <p>Dự án</p>
            </Link>
          </div>
          <Divider />
          <Divider />
          <Link to="/upgrade">
            <p>Upgrade Account</p>
          </Link>
          <Divider />
          <Link to="/profile">
            <p>Profile</p>
          </Link>
        </div>
      </Drawer>
    </>
  );
};
export default DrawerLeft;
