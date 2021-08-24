import { Row, Col, Layout, notification, Button, Spin } from "antd";
import QueueAnim from "rc-queue-anim";
import { useEffect, useState } from "react";
import CHeader from "./../components/layout/CHeader";
import ModalAddUserAdmin from "./../components/Settings/ModalAddUserAdmin";

const Settings = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setShow(true);
    return () => setShow(false);
  }, []);

  return (
    <QueueAnim leaveReverse type={"right"} className="queue-simple">
      {show ? (
        <Layout key="content">
          <Layout.Header className="top-0 sticky z-30">
            <CHeader
              className="h-full"
              title={"Welcome to PM Ware Settings"}
              description={""}
            />
          </Layout.Header>
          <Layout.Content className="mt-5 mx-4">
            <Row>
              <ModalAddUserAdmin
                setLoading={setLoading}
                visible={visible}
                setVisible={setVisible}
              />
              <Col className="flex justify-center mb-4">
                <Spin spinning={loading}>
                  <Button
                    onClick={() => setVisible(true)}
                    className="h-12 w-fit text-base"
                    type="primary"
                  >
                    Add Account
                  </Button>
                </Spin>
              </Col>
            </Row>
          </Layout.Content>
        </Layout>
      ) : null}
    </QueueAnim>
  );
};
export default Settings;
