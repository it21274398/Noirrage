import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

// Customer Imports
import UserSignup from "./pages/Customer/UserSignup";
import UserLogin from "./pages/Customer/UserLogin";
import CustProduct from "./pages/Customer/CustProductList";
import CustomerOrder from "./pages/Customer/CustomerOrder";
import ViewAllcart from "./pages/Customer/ViewAllcart";
import Profile from "./pages/Customer/Profile";
import Orderstatus from "./pages/Customer/OrderStatus";

// Other Imports
import NavBarforuser from "./components/Navbarforuser";
import Home from "./components/Home";
import AboutUs from "./components/AboutUs";



const Layout = () => {
  const location = useLocation();

  // Hide navbar on login and signup pages
  const hideNavbar = location.pathname === "/" || location.pathname === "/user/signup";

  return (
    <>
      {!hideNavbar && <NavBarforuser />}
      <ToastContainer position="bottom-right" autoClose={1100} />
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<UserLogin />} />
        <Route path="/user/signup" element={<UserSignup />} />
        <Route path="/CustProductList" element={<CustProduct />} />
        <Route path="/CustomerOrder" element={<CustomerOrder />} />
        <Route path="/ViewAllcart" element={<ViewAllcart />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/userorders" element={<Orderstatus />} />

        {/* Other Routes */}
        <Route path="/Home" element={<Home />} />
        <Route path="/AboutUs" element={<AboutUs />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
