import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//Admin imports
import AdminSignup from "./pages/AdminSignup";
import AdminLogin from "./pages/AdminLogin";
import AddProduct from "./pages/AddProduct";
import ProductList from "./pages/ProductList"
import AdminDashboard from "./pages/AdminDashboard"

//Customer imports
import CustProduct from "./pages/CustProductList"
import CustomerOrder from "./pages/CustomerOrder"
//Other imports
import NavBar from "./components/Navbar";
import Home from "./components/Home";
const App = () => {
  return (
    
    <Router>
       <NavBar />
      <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/" element={<AdminLogin />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/admin/ProductAdd" element={<AddProduct />} />
        <Route path="/admin/ProductList" element={<ProductList />} />
        <Route path="/CustProductList" element={<CustProduct />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/CustomerOrder" element={<CustomerOrder />} />
      </Routes>
    </Router>
  );
};

export default App;
