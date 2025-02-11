import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

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
    }
  };


  return (
    <Box
      sx={{
        position: "sticky",
        top: showNavBar ? 0 : "-64px",
        zIndex: 1100,
        backgroundColor: "#FAFAFA",
        transition: "top 0.3s ease-in-out",
        padding: 2,
        display: "flex",
        justifyContent: "center",
        gap: 3,
      }}
    >

<NavLink to="/admin/AdminDashboard" style={{ textDecoration: "none" }}>
        {({ isActive }) => (
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: isActive ? "bold" : "normal",
              color: isActive ? "#007BFF" : "#333",
              "&:hover": { color: "#007BFF" },
            }}
          >
            Admin Dashboard
          </Typography>
        )}
      </NavLink>
      <NavLink to="/admin/ProductAdd" style={{ textDecoration: "none" }}>
        {({ isActive }) => (
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: isActive ? "bold" : "normal",
              color: isActive ? "#007BFF" : "#333",
              "&:hover": { color: "#007BFF" },
            }}
          >
            Add Product
          </Typography>
        )}
      </NavLink>

      <NavLink to="/admin/ProductList" style={{ textDecoration: "none" }}>
        {({ isActive }) => (
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: isActive ? "bold" : "normal",
              color: isActive ? "#007BFF" : "#333",
              "&:hover": { color: "#007BFF" },
            }}
          >
            remove Product
          </Typography>
        )}
      </NavLink>



      <NavLink to="/admin/login" style={{marginLeft:"100px", textDecoration: "none" }}>
        {({ isActive }) => (
          <Typography
          onClick={() => handleLogout("admin")}
          sx={{
              
            fontSize: "1rem",
            fontWeight: isActive ? "bold" : "normal",
            color: isActive ? "#007BFF" : "#333",
            "&:hover": { color: "#007BFF" },
          }}
          >
            Admin Logout
          </Typography>
        )}
      </NavLink>
    </Box>
  );
};

export default NavBar;
