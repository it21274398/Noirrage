import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//Admin imports
import AdminSignup from "./components/AdminSignup";
import AdminLogin from "./components/AdminLogin";
import AddProduct from "./components/AddProduct";
import ProductList from "./components/ProductList"

//Customer imports
import CustProduct from "./components/CustProductList"

const App = () => {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin/ProductAdd" element={<AddProduct />} />
        <Route path="/admin/ProductList" element={<ProductList />} />
        <Route path="/CustProductList" element={<CustProduct />} />
      </Routes>
    </Router>
  );
};

export default App;
