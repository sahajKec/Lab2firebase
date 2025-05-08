import React, { useState, useEffect, ChangeEvent } from "react";
import { Box, TextField, Button, Typography, Alert, Container, Paper } from "@mui/material";
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const Register: React.FC = () => {
  const db = getFirestore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };

  const handleRegister = async () => {
    setError("");
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(user);
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: "user",
        email,
        lastlogin: serverTimestamp(),
        isVerified: user.emailVerified,
        isActive: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setSuccess(true);
      setTimeout(() => {
        signOut(auth);
        navigate("/");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 5, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>Register</Typography>
        {success && <Alert severity="success">Registration successful! Check your email for confirmation.</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="Email" variant="outlined" fullWidth value={email} onChange={handleChange(setEmail)} />
          <TextField label="Password" type="password" variant="outlined" fullWidth value={password} onChange={handleChange(setPassword)} />
          <Button variant="contained" color="primary" onClick={handleRegister} sx={{ mt: 2 }}>Register</Button>
        </Box>
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          Already have an account? <a href="/">Login</a>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;