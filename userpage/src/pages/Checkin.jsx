import React, { useState, useEffect } from "react";
import { Col, Row, Divider, Tabs, Form, Select, Button } from "antd";
import "antd/dist/antd.css";
import DrawerLeft from "../components/components-layout/DrawerLeft";
import { getPackage } from "../services/userServices";
import Paypal from "./../components/Checkin/Paypal";
import { useForm } from "antd/lib/form/Form";
import TabInvoice from "../components/Checkin/TabInvoice";
import PackageInfomation from "../components/components-layout/PackageInfomation";
const { TabPane } = Tabs;

export default function Checkin() {
  const [packages, setPackages] = useState([]);
  const [selected, setSelected] = useState({ name: "", price: "" });
  const [checkinStage, setStage] = useState("package");
  const [activeKey, setActiveKey] = useState("package");
  const [invoice, setInvoice] = useState();
  const [form] = useForm();

  const getDataPackage = async () => {
    try {
      const getPackagesRes = await getPackage();
      let dataPackage = [];
      getPackagesRes.data.data.map((dt) => {
        if (dt.currency === "USD" && dt.active)
          dataPackage.push({
            name: dt.name,
            price: dt.price,
          });
      });
      setPackages(dataPackage);
      form.setFieldsValue({ item: dataPackage[0].name });
      setSelected({ ...dataPackage[0] });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDataPackage();
  }, []);
  return (
    <>
      <Row className="row-home-content">
        <Col span={3}>
          <DrawerLeft />
        </Col>
        <Col className="all-project" span={20}>
          <div>
            <Row>
              <Col style={{ marginTop: "20px" }} span={16}>
                <div>
                  <h1>Check in</h1>
                </div>
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col offset={2} span={20}>
                <div className="card-container">
                  <Tabs
                    onChange={(e) => setActiveKey(e)}
                    activeKey={activeKey}
                    type="card"
                  >
                    <TabPane tab="Premium Pack" key="package">
                      <Form
                        onFinish={() => {
                          setStage("billing");
                          setActiveKey("billing");
                        }}
                        form={form}
                      >
                        <Row gutter={[10, 0]}>
                          <Col
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                            span={24}
                          >
                            <Form.Item
                              style={{ width: "30%", marginRight: "5px" }}
                              label="Gói"
                              name="item"
                            >
                              <Select
                                disabled={checkinStage !== "package"}
                                onChange={(e) =>
                                  setSelected(
                                    packages.filter((dt) => dt.name === e)[0]
                                  )
                                }
                              >
                                {packages.map((dt, index) => (
                                  <Select.Option key={index} value={dt.name}>
                                    {dt.name} Ngày
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                            <Form.Item>
                              <Button type="primary" htmlType="submit">
                                Xác nhận
                              </Button>
                            </Form.Item>
                          </Col>
                        </Row>
                        {selected && (
                          <Row style={{ justifyContent: "center" }}>
                            <PackageInfomation selected={selected} />
                          </Row>
                        )}
                      </Form>
                    </TabPane>
                    <TabPane
                      disabled={checkinStage !== "billing"}
                      tab="Billing"
                      key="billing"
                    >
                      <Row>
                        <Col span={12}>
                          <Form.Item label="Phương thức thanh toán">
                            <Paypal
                              setActiveKey={setActiveKey}
                              setStage={setStage}
                              itemName={selected}
                              setInvoice={setInvoice}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane
                      disabled={
                        checkinStage === "package" || checkinStage === "billing"
                      }
                      tab="Invoice"
                      key="invoice"
                    >
                      <TabInvoice orderId={invoice} />
                    </TabPane>
                  </Tabs>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </>
  );
}
