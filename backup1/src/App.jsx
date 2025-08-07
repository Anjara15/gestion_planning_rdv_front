import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Medecin from './pages/Medecin';
import Patient from "./pages/Patient";
import Admin from "./pages/Admin";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Medecin" element={<Medecin />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Patient" element={<Patient />} />
      </Routes>
    </Router>
  );
}

export default App;
