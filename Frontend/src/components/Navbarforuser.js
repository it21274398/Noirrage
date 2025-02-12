import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Box, Typography, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import { IoIosLogOut } from "react-icons/io";


const NavBar = () => {
  const [showNavBar, setShowNavBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      setShowNavBar(false);
    } else {
      setShowNavBar(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const handleLogout = (userType) => {
    if (userType === "admin") {
      localStorage.removeItem("adminToken");
    } else {
      localStorage.removeItem("userToken");
      navigate("/");
    }
  };

  return (
    <Box
      sx={{
        position: "sticky",
        top: showNavBar ? 0 : "-100px",
        zIndex: 1100,
        background: "linear-gradient(90deg,rgb(46, 46, 46),rgb(37, 37, 37))",
        transition: "top 0.3s ease-in-out, background 0.5s ease-in-out",
        padding: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 3,
      }}
    >
      {/* Logo */}
      <a href="/home">
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src={logo}
            alt="Logo"
            style={{ height: "70px", marginLeft: "60px" }}
          />
        </Box>
      </a>
      {/* Nav Links */}
      <Box sx={{ display: "flex", gap: 5 }}>
        <NavLink to="/Home" style={{ textDecoration: "none" }}>
          {({ isActive }) => (
            <Typography
              sx={{
                fontSize: "1.2rem",
                fontfamily: " 'Quicksand', sans-serif;",

                fontFamily: "'Raleway', sans-serif",
                color: isActive ? "#FFEB3B" : "#FFF",
                "&:hover": {
                  color: "#FFEB3B",
                  transform: "scale(1.1)",
                  transition: "transform 0.3s ease-in-out",
                },
                transition:
                  "color 0.3s ease-in-out, transform 0.3s ease-in-out",
              }}
            >
              Home
            </Typography>
          )}
        </NavLink>

        <NavLink to="/CustProductList" style={{ textDecoration: "none" }}>
          {({ isActive }) => (
            <Typography
              sx={{
                fontSize: "1.2rem",
                fontWeight: isActive ? "bold" : "normal",
                fontFamily: "'Raleway', sans-serif",
                color: isActive ? "#FFEB3B" : "#FFF",
                "&:hover": {
                  color: "#FFEB3B",
                  transform: "scale(1.1)",
                  transition: "transform 0.3s ease-in-out",
                },
                transition:
                  "color 0.3s ease-in-out, transform 0.3s ease-in-out",
              }}
            >
              See Items List
            </Typography>
          )}
        </NavLink>

        <NavLink to="/Profile" style={{ textDecoration: "none" }}>
          {({ isActive }) => (
            <Typography
              sx={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: "1.2rem",
                fontWeight: isActive ? "bold" : "normal",
                color: isActive ? "#FFEB3B" : "#FFF",
                "&:hover": {
                  color: "#FFEB3B",
                  transform: "scale(1.1)",
                  transition: "transform 0.3s ease-in-out",
                },
                transition:
                  "color 0.3s ease-in-out, transform 0.3s ease-in-out",
              }}
            >
              View Profile
            </Typography>
          )}
        </NavLink>

        <NavLink to="/ViewAllcart" style={{ textDecoration: "none" }}>
          {({ isActive }) => (
            <Typography
              sx={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: "1.2rem",
                fontWeight: isActive ? "bold" : "normal",
                color: isActive ? "#FFEB3B" : "#FFF",
                "&:hover": {
                  color: "#FFEB3B",
                  transform: "scale(1.1)",
                  transition: "transform 0.3s ease-in-out",
                },
                transition:
                  "color 0.3s ease-in-out, transform 0.3s ease-in-out",
              }}
            >
              View Mycart
            </Typography>
          )}
        </NavLink>

        <NavLink to="/" style={{ textDecoration: "none" }}>
  {({ isActive }) => (
    <Typography
      onClick={() => handleLogout("user")}
      sx={{
        marginLeft: 45,
        fontSize: "1.2rem", // Larger font size for prominence
       
        fontWeight: "500", // Slightly lighter for a sophisticated look
        color: isActive ? "#FFEB3B" : "red", // Elegant gold color for active
        display: "flex",
        alignItems: "center",
        gap: 1, // Space between text and icon
        "&:hover": {
          color: "#FFEB3B", // Gold on hover
          transform: "scale(1.1)",
         
          transition: "transform 0.3s ease-in-out, color 0.3s ease-in-out, box-shadow 0.3s ease-in-out", // Smoother transitions
        },
        transition:
          "color 0.3s ease-in-out, transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
      }}
    >

      Logout
    </Typography>
  )}
</NavLink>

      </Box>
    </Box>
  );
};

export default NavBar;


//.raleway { font-family: 'Raleway', sans-serif; }