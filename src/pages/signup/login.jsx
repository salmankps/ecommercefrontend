import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiMail, FiLock, FiArrowRight, FiLogIn } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  //login
  const { login } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
    
      const res = await login(email, password);

      const token = res.data.token || res.data.Token;
      const decoded = JSON.parse(atob(token.split('.')[1]));

  
      const CLAIM_ROLE = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
      const userRole = decoded[CLAIM_ROLE] || decoded.role || decoded.Role;

    
      localStorage.setItem("role", userRole); 
      
      toast.success(`Welcome back!`);

 
      if (userRole === "Admin") {
        navigate("/adminhome");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-600/20 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-md bg-[#121212] border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-pink-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-pink-500/20">
            <FiLogIn className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-3.5 text-gray-400" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-black/30 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:border-pink-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
              <a href="#" className="text-xs font-bold text-pink-500 hover:text-pink-400">Forgot Password?</a>
            </div>
            <div className="relative">
              <FiLock className="absolute left-4 top-3.5 text-gray-400" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/30 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:border-pink-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Signing in..." : "Sign In"} <FiArrowRight />
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-white font-bold hover:text-pink-500 transition-colors">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;