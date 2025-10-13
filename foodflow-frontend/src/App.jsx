import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase"; // Ensure firebase is properly imported
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./components/signup"; // Signup Page
import Dashboard from "./pages/dashboard";
import FoodList from "./components/FoodList"; 
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  // Function must be declared here (outside JSX)
  const handleLogout = async () => {
    await signOut(auth);
    alert("Logged out!");
  };

  return (
    <AuthProvider>
    <Router>
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route element={<ProtectedRoute />}>
          <Route path="/foodlist" element={<FoodList />} />
          </Route>
        </Routes>

        {/* Place Logout button inside a div */}
        {/* <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button onClick={handleLogout}>Logout</button>
        </div> */}
      </>
    </Router>
   
    </AuthProvider>

  );
}

export default App;
