import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//Admin imports
import AdminSignup from "./pages/Admin/AdminSignup";
import AdminLogin from "./pages/Admin/AdminLogin";
import AddProduct from "./pages/Admin/AddProduct";
import ProductList from "./pages/Admin/ProductList";
import AdminDashboard from "./pages/Admin/AdminDashboard";

//Other imports
import NavBarforadmin from "./components/Navbarforadmin";
import AboutUs from "./components/AboutUs";

const App = () => {
  return (
    <Router>
      <NavBarforadmin />
      <ToastContainer position="top-right" autoClose={1500} />
      <Routes>
        {/* Admin Routes */}
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/ProductAdd" element={<AddProduct />} />
        <Route path="/admin/ProductList" element={<ProductList />} />
        <Route path="/admin/AdminDashboard" element={<AdminDashboard />} />


        {/* Other Routes */}
        <Route path="/AboutUs" element={<AboutUs />} />
      </Routes>
    </Router>
  );
};

export default App;
