import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage/Login";
import HomePage from "./pages/HomePage/HomePage";
import CreateAccount from "./pages/CreateAccount";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/registration" element={<CreateAccount />} />
      </Routes>
    </Router>
  );
}

export default App;
