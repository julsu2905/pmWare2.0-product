import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import rootReducer from "./redux/reducers";
import { composeWithDevTools } from "redux-devtools-extension";
import { BrowserRouter as Router } from "react-router-dom";
import { createStore } from "redux";
import App from "./App";
import "./helper/translations/i18next-config";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";

const applied = composeWithDevTools();
const store = createStore(rootReducer, applied);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
