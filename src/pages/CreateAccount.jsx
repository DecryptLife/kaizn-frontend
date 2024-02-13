import { useNavigate } from "react-router";
import { Header } from "./LoginPage/Login";
import { useCallback, useState } from "react";
import axios from "axios";
import BASE_URL from "../../config";

const CreateAccount = () => {
  const url = (path) => `${BASE_URL}${path}`;

  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [registrationDetails, setRegistrationDetails] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    password2: "",
  });
  function handleLoginButton() {
    navigate("/");
  }

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      setRegistrationDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [registrationDetails]
  );

  const handleRegistration = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        url("/api/register/"),
        registrationDetails
      );

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-16">
      <Header />
      <div className="h-8 shadow-md w-1/2 p-8"></div>
      <div className="shadow-lg w-1/2 p-8">
        <form onSubmit={handleRegistration} className="shared-form-style">
          <div className="flex w-full">
            <div className="w-1/2">
              <input
                type="text"
                name="first_name"
                placeholder="firstname"
                className="border p-3 rounded-lg w-full "
                value={registrationDetails.first_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-1/2">
              <input
                type="text"
                name="last_name"
                placeholder="lastname"
                className="border p-3 w-full rounded-lg "
                value={registrationDetails.last_name}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div>
            <input
              type="text"
              name="email"
              placeholder="email@example.com"
              className="login-input"
              value={registrationDetails.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="login-input"
              value={registrationDetails.username}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="login-input"
              value={registrationDetails.password}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <input
              type="password"
              name="password2"
              placeholder="Confirm password"
              className="login-input"
              value={registrationDetails.password2}
              onChange={handleInputChange}
            />
          </div>
          {error && <div>{error}</div>}

          <div className="flex justify-between">
            <div>
              <button
                className="bg-slate-200 p-3 px-8 rounded-lg font-bold"
                onClick={handleLoginButton}
              >
                LOG IN
              </button>
            </div>
            <div>
              <input
                type="submit"
                value="REGISTER"
                className="bg-blue-500 p-3 px-8 rounded-lg text-white font-bold"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
