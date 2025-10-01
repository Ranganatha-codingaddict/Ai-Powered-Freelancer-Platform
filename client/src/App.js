import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaComments, FaSignInAlt, FaSignOutAlt, FaUserPlus ,FaFileAlt} from "react-icons/fa";
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import FreelancerDashboard from './pages/FreelancerDashboard';
import ClientDashboard from './pages/ClientDashboard';
import AdminPanel from './pages/AdminPanel';
import QuizPage from './pages/QuizPage';
import Chatbot from './pages/Chatbot';
import AdminDashboard from './pages/AdminDashboard';


import ResumeScore from "./pages/ResumeScore"; // Adjust path if needed


import './App.css';
import './global.css';

// Navbar Component
function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Check if any user is logged in by looking for tokens in localStorage
  const isClientLoggedIn = !!localStorage.getItem('clientToken');
  const isFreelancerLoggedIn = !!localStorage.getItem('freelancerToken');
  const isAdminLoggedIn = !!localStorage.getItem('adminToken');
  const isLoggedIn = isClientLoggedIn || isFreelancerLoggedIn || isAdminLoggedIn;

  // Handle sign out
  const handleSignOut = () => {
    localStorage.removeItem('clientToken');
    localStorage.removeItem('freelancerToken');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('freelancerId');
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isMobile = window.innerWidth <= 768;

  const navbarStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: "#ffffff",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    padding: "0.75rem 0",
    height: "64px",
    display: "flex",
    alignItems: "center",
    width: "100vw",
    margin: 0
  };

  const navbarContainerStyle = {
    maxWidth: "1200px",
    width: "100%",
    margin: "0 auto",
    padding: isMobile ? "0 0.5rem" : "0 1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  };

  const logoContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  };

  const logoStyle = {
    width: "24px",
    height: "24px",
    transition: "transform 0.3s ease"
  };

  const brandNameStyle = {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "#0D141C",
    textDecoration: "none"
  };

  const navLinksStyle = {
    display: isMobile ? "none" : "flex",
    gap: "2rem",
    alignItems: "center",
    marginLeft: "2rem"
  };

  const navLinkStyle = {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: "#4B5563",
    fontWeight: 500,
    fontSize: "0.875rem",
    transition: "color 0.2s ease"
  };

  const authButtonsStyle = {
    display: isMobile ? "none" : "flex",
    gap: "0.75rem",
    alignItems: "center",
    marginLeft: "auto"
  };

  const buttonBaseStyle = {
    padding: "0.5rem 1rem",
    borderRadius: "0.75rem",
    fontWeight: 600,
    fontSize: "0.875rem",
    transition: "all 0.2s ease",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  };

  const signupBtnStyle = {
    ...buttonBaseStyle,
    background: "#2563EB",
    color: "white"
  };

  const loginBtnStyle = {
    ...buttonBaseStyle,
    background: "#F3F4F6",
    color: "#1F2937"
  };

  const signoutBtnStyle = {
    ...buttonBaseStyle,
    background: "#dc3545",
    color: "white"
  };

  const mobileMenuBtnStyle = {
    display: isMobile ? "block" : "none",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0.5rem"
  };

  const mobileMenuIconStyle = {
    width: "20px",
    height: "20px",
    color: "#1F2937"
  };

  const mobileMenuStyle = {
    position: "fixed",
    top: "64px",
    left: 0,
    right: 0,
    background: "white",
    padding: "1rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    display: isMobileMenuOpen ? "flex" : "none",
    flexDirection: "column",
    gap: "0.75rem",
    width: "100vw",
    margin: 0
  };

  const mobileNavLinkStyle = {
    color: "#4B5563",
    textDecoration: "none",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  };

  const mobileAuthButtonsStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    paddingTop: "0.5rem",
    borderTop: "1px solid #E5E7EB",
    marginTop: "0.5rem"
  };

  const navIconStyle = {
    marginRight: "0.5rem",
    fontSize: "1.125rem"
  };

  return (
    <nav style={navbarStyle}>
      <div style={navbarContainerStyle}>
        <div style={logoContainerStyle}>
          <Link  style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={logoStyle}
            >
              <g clipPath="url(#clip0_3311_150)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2 2H14L12 8L14 14H2L4 8L2 2V2Z"
                  fill="#2563EB"
                />
              </g>
              <defs>
                <clipPath id="clip0_3311_150">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span style={brandNameStyle}>Freelance Co</span>
          </Link>
        </div>

        <div style={navLinksStyle}>
          <Link to="/chat" style={navLinkStyle}>
            <FaComments style={navIconStyle} />
            Chat
          </Link>
          {/* Show Freelancer Lessons only for freelancers */}
          
          
          <Link to="/resume-score" style={navLinkStyle}>
          <FaFileAlt style={navIconStyle}></FaFileAlt>
          Resume Score Checker
          </Link>
          

        </div>

        <div style={authButtonsStyle}>
          {isLoggedIn ? (
            <button onClick={handleSignOut} style={signoutBtnStyle}>
              <FaSignOutAlt /> Sign Out
            </button>
          ) : (
            <>
              <Link to="/signup" style={signupBtnStyle}>
                <FaUserPlus /> Sign Up
              </Link>
              <Link to="/login" style={loginBtnStyle}>
                <FaSignInAlt /> Log In
              </Link>
            </>
          )}
        </div>

        <button style={mobileMenuBtnStyle} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? (
            <FaTimes style={mobileMenuIconStyle} />
          ) : (
            <FaBars style={mobileMenuIconStyle} />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div style={mobileMenuStyle}>
          <Link to="/chat" style={mobileNavLinkStyle}>
            <FaComments style={navIconStyle} />
            Chat
          </Link>
          
          
          <Link to="/resume-score" style={mobileNavLinkStyle}>
          <FaFileAlt style={navLinkStyle}> /</FaFileAlt>📄 Resume Score Checker</Link>

          <div style={mobileAuthButtonsStyle}>
            {isLoggedIn ? (
              <button onClick={handleSignOut} style={signoutBtnStyle}>
                <FaSignOutAlt /> Sign Out
              </button>
            ) : (
              <>
                <Link to="/signup" style={signupBtnStyle}>
                  <FaUserPlus /> Sign Up
                </Link>
                <Link to="/login" style={loginBtnStyle}>
                  <FaSignInAlt /> Log In
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// NotFound Component
const NotFound = () => (
  <div className="container mt-5 text-center">
    <h2>404 - Page Not Found</h2>
    <p>The page you are looking for doesn't exist.</p>
  </div>
);

// App Component
function App() {
  return (
    <Router>
      <div className="page">
        <Navbar />
        <div className="container" style={{ paddingTop: '64px' }}>
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
              <Route path="/client-dashboard" element={<ClientDashboard />} />
              <Route path="/quiz/:userId" element={<QuizPage />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/chat" element={<Chatbot />} />
              
              <Route path="/resume-score" element={<ResumeScore />} />

              <Route path="*" element={<NotFound />} />
              
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;