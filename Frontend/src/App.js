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

//Customer imports
import UserSignup from "./pages/Customer/UserSignup";
import UserLogin from "./pages/Customer/UserLogin";
import CustProduct from "./pages/Customer/CustProductList";
import CustomerOrder from "./pages/Customer/CustomerOrder";
import ViewAllcart from "./pages/Customer/ViewAllcart";
import Profile from "./pages/Customer/Profile";

//Other imports
import NavBarforuser from "./components/Navbarforuser";
import NavBarforadmin from "./components/Navbarforadmin";
import Home from "./components/Home";
import AboutUs from "./components/AboutUs";

const App = () => {
  return (
    <Router>
      <NavBarforuser />
      <NavBarforadmin />
      <ToastContainer position="top-right" autoClose={1500} />
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/ProductAdd" element={<AddProduct />} />
        <Route path="/admin/ProductList" element={<ProductList />} />
        <Route path="/admin/AdminDashboard" element={<AdminDashboard />} />

        {/* Customer Routes */}
        <Route path="/" element={<UserLogin />} />
        <Route path="/user/signup" element={<UserSignup />} />
        <Route path="/CustProductList" element={<CustProduct />} />
        <Route path="/CustomerOrder" element={<CustomerOrder />} />
        <Route path="/ViewAllcart" element={<ViewAllcart />} />
        <Route path="/Profile" element={<Profile />} />
        
        {/* Other Routes */}
        <Route path="/Home" element={<Home />} />
        <Route path="/AboutUs" element={<AboutUs />} />
      </Routes>
    </Router>
  );
};

export default App;
