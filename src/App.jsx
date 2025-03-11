import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AntdLayout from "./component/Layout/Layout"; // ✅ Consumer Layout
import Home from "./pages/consumer/Home/Home";
import CartPage from "./pages/consumer/Carts";
import ContactForm from "./component/Contact_Form/Contact_Form";
import ProductList from "./component/ProductList/ProductList";
import Category from "./component/Category/Category";
import Product from "./component/Product/Product";
import AdminLogin from "./pages/admin/auth/AdminLogin";
import AdminSignup from "./pages/admin/auth/AdminSignup";
import MainLayout from "./component/MainLayout/MainLayout"; // ✅ Admin Layout.
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Orders from "./pages/admin/Orders";
import InterestedUsers from "./pages/admin/InterestedUsers";
// import Login from "./pages/consumer/Login/login";
// import Signup from "./pages/consumer/Signup/signup";
import AddCategory from "./pages/admin/AddCategory";
import AddSubcategory from "./pages/admin/AddSubcategory";
import AddProduct from "./pages/admin/AddProduct";
import Inquiry from "./pages/admin/Inquiry";
import SubcategoryPage from "./component/SubcategoryPage/SubcategoryPage";
import Login from "./pages/consumer/Login/login";
import Signup from "./pages/consumer/Signup/signup";
import Subproduct from "./pages/admin/Subproduct";
import AccountSettings from "./component/account/AccountSettings";
import ForgotPassword from "./component/ForgotPassword/ForgotPassword";
import ResetPassword from "./component/ResetPassword/ResetPassword";


 // ✅ Import the Subproduct Page

// Authentication Protection
const ProtectedRoute = ({ children, role }) => {
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("userToken");

  if (role === "admin" && !adminToken) return <Navigate to="/admin/login" replace />;
  if (role === "consumer" && !userToken) return <Navigate to="/login" replace />;

  return children;
};

const PublicRoute = ({ children, role }) => {
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("userToken");

  if (role === "admin" && adminToken) return <Navigate to="/admin/dashboard" replace />;
  if (role === "consumer" && userToken) return <Navigate to="/" replace />;

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* ✅ Consumer Login & Signup (Without AntdLayout) */}
        {/* <Route path="/login" element={<PublicRoute role="consumer"><Login /></PublicRoute>} /> */}
        {/* <Route path="/login" element={<Login/>} /> */}

        {/* ✅ Admin Login & Signup (Without MainLayout) */}
        <Route path="/admin/login" element={<PublicRoute role="admin"><AdminLogin /></PublicRoute>} />
        <Route path="/admin/signup" element={<PublicRoute role="admin"><AdminSignup /></PublicRoute>} />


        {/* ✅ Consumer Protected Routes (Inside AntdLayout) */}
        {/* <Route element={<ProtectedRoute role="consumer"><AntdLayout /></ProtectedRoute>}> */}
        <Route element={<AntdLayout />}>
          <Route path="/" element={<Home />} /> 
          <Route path="/category/:id" element={<Category />} />
          <Route path="/subcategory/:id" element={<SubcategoryPage />} /> 
          <Route path="/product/:id" element={<Product />} />
          <Route path="/contact_form" element={<ContactForm />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/account/*" element={<AccountSettings />} />
          <Route path="/signup" element={<Signup />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />}/>
          {/* <Route path="/signup" element={<Signup/>}/> */}
          {/* ✅ Catch-All Route for Consumer Inside AntdLayout */}
          {/* <Route path="*" element={<Navigate to="/login" />} /> */}
        </Route>
        <Route element={<ProtectedRoute role="consumer"><AntdLayout /></ProtectedRoute>}>
          <Route path="/cart" element={<CartPage />} />
        </Route>
          
          {/* <Route path="/category/:categoryName/:subcategory" element={<ProductList />} /> */}
          
          
          

        {/* ✅ Admin Protected Routes (Inside MainLayout) */}
        <Route element={<ProtectedRoute role="admin"><MainLayout /></ProtectedRoute>}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/category" element={<AddCategory />} />
          <Route path="/admin/subcategory" element={<AddSubcategory />} />
          <Route path="/admin/product" element={<AddProduct />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/interested" element={<InterestedUsers />} />
          <Route path="/admin/inquiries" element={<Inquiry />} />
          <Route path="/admin/subproduct" element={<Subproduct />} /> {/* ✅ Added Subproduct */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
