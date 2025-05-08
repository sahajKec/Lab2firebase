import React, { useState, ChangeEvent, useEffect } from "react";
import { Alert, AlertTitle, Box } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate, Link } from "react-router-dom";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import "./Register.css";

const Register: React.FC = () => {
  const db = getFirestore();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (userToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleRegister = async () => {
    try {
      const userData = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userData.user;

      await sendEmailVerification(user);

      // Set user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: "user", // Explicitly set username to 'user'
        email,
        lastlogin: serverTimestamp(),
        isVerified: user.emailVerified,
        isActive: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setSuccess(true);
      signOut(auth);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error: any) {
      console.error("Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <>
      {success && (
        <Alert severity="success" className="alert">
          <AlertTitle>Success</AlertTitle>
          Registration successful. Check your email for confirmation.
        </Alert>
      )}
      <Box className="register-container">
        <div className="card">
          <h3 className="card-title">Register</h3>
          <form>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
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
                className="btn-primary"
                onClick={handleRegister}
              >
                Register
              </button>
            </div>
          </form>
          <p className="text-center">
            Already have an account?<Link to="/">Login</Link>
          </p>
        </div>
      </Box>
    </>
  );
};

export default Register;
