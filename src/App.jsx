import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import HomePage from "./components/Homepage";
import BallSimulation from "./components/ballsimulation";
import WASDGuidelines from "./components/Guidelines";
import RegisterPage from "./components/RegisterForm";
import PageLoader from "./components/Loader";

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const navigate = useNavigate();  // This hook must be used inside the Router context

  useEffect(() => {
    // Simulate loading time, e.g., fetching data
    const timer = setTimeout(() => {
      setIsLoading(false); // Set loading to false after 10 seconds
    }, 10000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  // To make sure we only navigate on the first load
  useEffect(() => {
    if (isFirstLoad) {
      navigate("/"); // Redirect to homepage on initial load
      setIsFirstLoad(false); // After the first load, stop redirecting
    }
  }, [navigate, isFirstLoad]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        color: "white",
      }}
    >
      {/* Show loader until isLoading is true */}
      {isLoading && <PageLoader />}

      {/* Navigation Links */}
      <nav style={{ position: "absolute", top: 10, left: 10 }}>
        <Link to="/" style={{ margin: "0 10px" }}>
          Home
        </Link>
        <Link to="/ball-simulation" style={{ margin: "0 10px" }}>
          Ball Simulation & WASD
        </Link>
        <Link to="/register" style={{ margin: "0 10px" }}>
          Register
        </Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/ball-simulation"
          element={
            <div>
              <BallSimulation />
              <WASDGuidelines />
            </div>
          }
        />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
};

export default App;
