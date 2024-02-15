import { useNavigate } from "react-router";
import kicon from "../../assets/kaizn_icon.webp";
import { useCallback, useState } from "react";
import PasswordStrength from "./PasswordStrength";
import axios from "axios";
import BASE_URL from "../../../config";
import LoadingScreen from "../LoadingScreen";
import { useRecoilState } from "recoil";
import loadingState from "../../store/atoms/loading";

export function Header() {
  return (
    <div className="flex justify-center w-1/2">
      <div>
        <img src={kicon} alt="" />
      </div>

      <div className="flex w-3/5 items-center">
        <h1 className="text-3xl font-bold">Kaizntree</h1>
      </div>
    </div>
  );
}

const Login = () => {
  const url = (path) => `${BASE_URL}${path}`;

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useRecoilState(loadingState);

  const handleInputChange = useCallback(
    (e) => {
      const { id, value } = e.target;

      setLoginDetails((prev) => ({
        ...prev,
        [id]: value,
      }));
    },
    [loginDetails]
  );
  // if (loading) {
  //   return <LoadingScreen isLoading={loading}/>; // Customize as needed
  // }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      username: loginDetails.username,
      password: loginDetails.password,
    };

    try {
      const response = await axios.post(url("/api/login/"), payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      localStorage.setItem("token", data.token);
      navigate("/home");
    } catch (error) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  function handleRegistration() {
    navigate("/registration");
  }

  return (
    <div>
      <LoadingScreen />
      <div className="flex flex-col items-center justify-center mt-16">
        {/* header */}
        <Header />
        {/* form */}
        <div className="flex mt-8 w-1/2">
          <form onSubmit={handleLogin} className="shared-form-style">
            <div>
              <input
                id="username"
                type="text"
                placeholder="username"
                className="login-input"
                value={loginDetails.username}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <input
                id="password"
                type="password"
                placeholder="password"
                className="login-input"
                value={loginDetails.password}
                onChange={handleInputChange}
                required
              />
              {loginDetails.password && (
                <PasswordStrength password={loginDetails.password} />
              )}
            </div>
            {error && (
              <div className="flex justify-center text-red-600">{error}</div>
            )}
            <div className="flex justify-between">
              <button className="login-buttons" onClick={handleRegistration}>
                CREATE ACCOUNT
              </button>
              <input
                type="submit"
                className="login-buttons"
                name="login"
                value="LOG IN"
              />
            </div>

            {/* <div>
              <a className="underlined" href="/">
                Forgot Password
              </a>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
