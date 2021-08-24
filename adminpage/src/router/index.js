import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useSelector } from "react-redux";
import Template from "../components/layout/Template";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import User from "./../pages/User";
import Price from "./../pages/Price";
import Code from "./../pages/Code";
import Banner from "../pages/Banner";
import Settings from "../pages/Settings";
import NotFound from "./../pages/404Error";
import Advertisement from "./../pages/Advertisement";
const MainRouter = () => {
  const { signedIn } = useSelector((state) => state.user);
  function PrivateRoute({ component: Component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          signedIn ? (
            <Template>
              <Component {...props} />
            </Template>
          ) : (
            <Redirect
              to={{
                pathname: "/login",
              }}
            />
          )
        }
      />
    );
  }
  const PublicRoute = ({ component: Component, restricted, ...rest }) => {
    return (
      <Route
        {...rest}
        render={(props) =>
          signedIn && restricted ? (
            <Redirect to="/Dashboard" />
          ) : (
            <Component {...props} />
          )
        }
      />
    );
  };
  return (
    <Switch>
      <PublicRoute
        path={["/", "/login"]}
        component={Login}
        restricted={true}
        exact
      />
      <PrivateRoute path={"/Dashboard"} component={Dashboard} />
      <PrivateRoute path={"/User"} component={User} />
      <PrivateRoute path={"/Price"} component={Price} />
      <PrivateRoute path={"/Code"} component={Code} />
{/*       <PrivateRoute path={"/Advertisement"} component={Advertisement} />
 */}      <PrivateRoute path={"/Promotion"} component={Code} />
      <PrivateRoute path={"/Banner"} component={Banner} />
      <PrivateRoute path={"/Settings"} component={Settings} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
};
export default MainRouter;
