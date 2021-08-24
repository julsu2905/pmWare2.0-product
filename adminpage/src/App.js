import { useDispatch } from "react-redux";
import "./App.css";
import { userLoggin } from "./redux/actions/userActions";
import MainRouter from "./router";
function App() {
  const dispatch = useDispatch();
  if (localStorage.getItem("user")) {
    dispatch(userLoggin(JSON.parse(localStorage.getItem("user"))));
  }
  return <MainRouter />;
}

export default App;
