import React from 'react'
import Register from './Register.tsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Login.tsx';
import Dashboard from './Dashboard.tsx';

interface AppProps {
    auth: boolean;
    setAuth: React.Dispatch<React.SetStateAction<boolean>>;
  }

  
  const App: React.FC<AppProps> = ({ auth, setAuth }) => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App