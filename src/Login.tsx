//Doing this on lab
import React, { useState, ChangeEvent, useEffect } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const userToken = localStorage.getItem("token");
      if (userToken) {
        navigate("/dashboard");
      } else {
        console.log("User is not valid");
        navigate("/");
      }
    };
    checkToken();
  }, []);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    // console.log('Logging in with:', { email, password });
    try {
      const data: any = await signInWithEmailAndPassword(auth, email, password);
      console.log(data, "This is console log inside login!!!");
      const userToken: string = await data?.user?.accessToken;
      localStorage.setItem("token", userToken);
      alert("Login Sucessful");
      navigate("/dashboard");
    } catch (error: any) {
      console.log("Error msg: ", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4">
        <h3 className="card-title text-center mb-4">Login</h3>
        <form>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="text-center">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
          <h3 className="d-flex justify-content-center align-items-center">
            <a href="/register">Register</a>
          </h3>
        </form>
      </div>
    </div>
  );
};

export default Login;
