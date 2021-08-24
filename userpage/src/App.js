import { Layout } from "antd";
import React from "react";
import "./App.css";
import { Route, Switch, useHistory } from "react-router-dom";
import Landingpage from "./pages/Landingpage";
import Footer from "./components/components-layout/Footer";
import Header from "../src/components/components-layout/Header";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import UpgragePage from "./pages/UpgradePage";
import Checkin from "./pages/Checkin";
import ProfilePage from "./pages/ProfilePage";
import ProjectPage from "./pages/ProjectPage";
import PrivateRoute from "./router/PrivateRoute";
import UpdateSubTask from "./components/ListView/UpdateSubTask";
import UpdateTaskPage from "./components/ListView/UpdateTaskPage";
import { useDispatch } from "react-redux";
import { userLoggin } from "./redux/actions/userActions";
import { selectProject } from "./redux/actions/projectActions";
import { selectSubTask } from "./redux/actions/subTaskAction";
import Premium from "./pages/GoPremium";
import TransactionHistory from "./pages/TransactionHistory";
import NotFound from "./pages/404Error";
import { selectTask } from "./redux/actions/taskAction";
const { Content } = Layout;

function App() {
  const dispatch = useDispatch();
  if (localStorage.getItem("user")) {
    dispatch(userLoggin(JSON.parse(localStorage.getItem("user"))));
  }
  localStorage.getItem("project") &&
    dispatch(selectProject(JSON.parse(localStorage.getItem("project"))));
  localStorage.getItem("subTask") &&
    dispatch(selectSubTask(JSON.parse(localStorage.getItem("subTask"))));
  localStorage.getItem("task") &&
    dispatch(selectTask(JSON.parse(localStorage.getItem("task"))));
  return (
    <>
      <Layout>
        <Header />
        <Content>
          <Switch>
            <Route exact path="/">
              <Landingpage />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route component={Login} path="/login" />
            <Route component={UpgragePage} path="/pricing" />
            <PrivateRoute path="/home" component={Home} />
            <PrivateRoute path="/upgrade" component={UpgragePage} />
            <PrivateRoute path="/checkin" component={Checkin} />
            <PrivateRoute path="/profile" component={ProfilePage} />
            <PrivateRoute path="/premium" component={Premium} />
            <PrivateRoute path="/history" component={TransactionHistory} />
            <PrivateRoute
              exact
              path={`/projectpage/:name`}
              component={ProjectPage}
            />
            <PrivateRoute
              exact
              path="/subTask/:name"
              component={UpdateSubTask}
            />
            <PrivateRoute exact path="/task/:name" component={UpdateTaskPage} />
            <Route path="*" component={NotFound} />
          </Switch>
        </Content>
        <Footer />
      </Layout>
    </>
  );
}

export default App;
