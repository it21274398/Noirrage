import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Button,
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
} from "@mui/material";

const navItems = [
  { label: "Home", path: "/Home" },
  { label: "Add Product", path: "/admin/ProductAdd" },
  { label: "See product", path: "/admin/ProductList" },
  { label: "Cos product list", path: "/CustProductList" },

];

const NavBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showNavBar, setShowNavBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      setShowNavBar(false); // Hide navbar on scroll down
    } else {
      setShowNavBar(true); // Show navbar on scroll up
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const renderNavItems = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 12,
        padding: 2,
        backgroundColor: "#FFFFFF",
      }}
    >
      {navItems.map((item, index) => (
        <NavLink key={index} to={item.path} style={{ textDecoration: "none" }}>
          {({ isActive }) => (
            <Typography
              variant="body1"
              sx={{
                fontSize: "1rem",
                fontWeight: isActive ? "bold" : "normal",
                color: isActive ? "#007BFF" : "#333",
                textTransform: "capitalize",
                "&:hover": {
                  color: "#007BFF",
                },
              }}
            >
              {item.label}
            </Typography>
          )}
        </NavLink>
      ))}
    </Box>
  );
  return (
    <>
      {/* Hide or show the NavBar based on scroll */}
      <Box
        sx={{
          display: { xs: "flex", md: "flex" },
          justifyContent: "center",
          position: "sticky",
          top: showNavBar ? 0 : "-64px",
          zIndex: 1100,
          backgroundColor: "#FAFAFA",
          transition: "top 0.3s ease-in-out",
        }}
      >
        {/* Toggle button for small screens */}
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            justifyContent: "right",
            alignItems: "center",
            padding: 2,
          }}
        ></Box>

        {/* Drawer for small screens */}
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box
            sx={{
              width: 250,
              padding: 2,
            }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <List>
              {navItems.map((item, index) => (
                <ListItem key={index}>
                  <NavLink
                    to={item.path}
                    style={{ textDecoration: "none", width: "100%" }}
                  >
                    {({ isActive }) => (
                      <Button
                        sx={{
                          width: "100%",
                          borderRadius: 10,
                          padding: "3px 20px",
                          fontSize: "12px",
                          color: "white",
                          background: isActive
                            ? "linear-gradient(151deg, #04D2BB 75%, #00F2F5 100%)"
                            : "linear-gradient(180deg, #7622FF 0%, #4F51EE 100%)",
                          "&:hover": {
                            background:
                              "linear-gradient(322deg, #00F2F5 0%, #4F51EE 100%)",
                          },
                          boxShadow: "3px 0px 0px 0px #CCCCCC",
                        }}
                      >
                        {item.label}
                      </Button>
                    )}
                  </NavLink>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Menu for larger screens */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            gap: 2,
            backgroundColor: "#FAFAFA",
          }}
        >
          {renderNavItems()}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        
      </Box>
      

    </>
  );
};

export default NavBar;
