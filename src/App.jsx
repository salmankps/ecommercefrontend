// src/App.jsx
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure CSS is imported

// Auth & Public Pages
import LoginPage from "./pages/signup/login";
import RegisterPage from "./pages/signup/register";
import Home from "./pages/home";
import AboutPage from "./pages/about";
import Allfigure from "./pages/allfigure";
import ProduDetailsPage from "./pages/details"; // Note: Filename is details.jsx

// Protected User Pages
import WishlistPage from "./pages/wishlist";
import CartPage from "./pages/cart";
import CheckOutPage from "./pages/chekout"; // Note: Filename has typo 'chekout'
import PaymentPage from "./pages/payment"; // NEW PAGE
import PlaceOrder from "./pages/placeorder";
import ProfilePage from "./pages/profile";
import Address from "./pages/address";

// Admin Pages
import AdminHome from "./admin/adminhome";
import UsersAdmin from "./admin/users";
import ProductsAdmin from "./admin/products";
import AddProduct from "./admin/addproduct";
import EditProduct from "./admin/editproduct";
import UserEdit from "./admin/useredit";
import OrdersAdmin from "./admin/orders";
import CouponsAdmin from "./admin/coupons";
import CategoriesAdmin from "./admin/categories";

// Route Guards
import { ProtectedRoute, PublicRoute } from "./components/loginroute";
import { AdminRoute } from "./components/adminroute"; // Make sure this file exists

function App() {
  return (
    <>
      <div className="bg-con">
        <h1>
          Play<span style={{ color: "#e71352" }}>Box</span>
        </h1>
      </div>

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* OPEN ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/details/:itemId" element={<ProduDetailsPage />} />
        <Route path="/allfigure" element={<Allfigure />} />

        {/* USER PROTECTED ROUTES */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckOutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/placeorder"
          element={
            <ProtectedRoute>
              <PlaceOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/address"
          element={
            <ProtectedRoute>
              <Address />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/adminhome"
          element={
            <AdminRoute>
              <AdminHome />
            </AdminRoute>
          }
        />
        <Route
          path="/users"
          element={
            <AdminRoute>
              <UsersAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="/products"
          element={
            <AdminRoute>
              <ProductsAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="/addproduct"
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/editproduct/:id"
          element={
            <AdminRoute>
              <EditProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/useredit/:id"
          element={
            <AdminRoute>
              <UserEdit />
            </AdminRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <AdminRoute>
              <OrdersAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="/coupons"
          element={
            <AdminRoute>
              <CouponsAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <AdminRoute>
              <CategoriesAdmin />
            </AdminRoute>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={1500} theme="dark" />
    </>
  );
}

export default App;
