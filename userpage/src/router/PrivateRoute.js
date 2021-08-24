import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useSelector } from "react-redux";

function CPrivateRoute({ component: Component, ...rest }) {
  const { signedIn } = useSelector((state) => state.user);
  return (
    <Route
      {...rest}
      render={(props) =>
        signedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}

export default CPrivateRoute;
