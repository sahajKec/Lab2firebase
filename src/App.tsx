import React from "react";
import Register from "./Register.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login.tsx";
import Dashboard from "./Dashboard.tsx";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
