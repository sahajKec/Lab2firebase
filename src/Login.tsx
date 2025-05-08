//Doing this on lab
import React, { useState, ChangeEvent, useEffect } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate,Link  } from "react-router-dom";
import { Alert, AlertTitle, Box } from "@mui/material";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const userToken = localStorage.getItem("token");
      if (userToken) {
        navigate("/dashboard");
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
    try {
      const data: any = await signInWithEmailAndPassword(auth, email, password);
      const userToken: string = await data?.user?.accessToken;
      localStorage.setItem("token", userToken);
      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (error: any) {
      console.log("Error msg: ", error.message);
      alert(error.message);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        {success && (
          <Alert
            severity="success"
            sx={{
              width: "80%",
              maxWidth: "400px",
              backgroundColor: "#e6f4ea",
              borderLeft: "6px solid #2e7d32",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              fontSize: "16px",
              transition: "opacity 0.5s ease-in-out",
            }}
          >
            <AlertTitle sx={{ fontWeight: "bold" }}>Success</AlertTitle>
            Login Successfull.
          </Alert>
        )}
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
              <p className="d-flex justify-content-center align-items-center">
              <Link to="/register">Register</Link>
              </p>
            </form>
          </div>
        </div>
      </Box>
    </>
  );
};

export default Login;
