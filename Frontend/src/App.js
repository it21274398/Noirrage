import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//Admin imports
import AdminSignup from "./pages/AdminSignup";
import AdminLogin from "./pages/AdminLogin";
import AddProduct from "./pages/AddProduct";
import ProductList from "./pages/ProductList"
import Order from "./pages/Orders"

//Customer imports
import CustProduct from "./pages/CustProductList"

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
        <Route path="/admin/ProductAdd" element={<AddProduct />} />
        <Route path="/admin/ProductList" element={<ProductList />} />
        <Route path="/CustProductList" element={<CustProduct />} />
        <Route path="/Order" element={<Order />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
