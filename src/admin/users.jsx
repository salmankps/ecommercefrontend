import React, { useEffect, useState } from "react";
import SideBar from "./components/sidebar";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiSearch, FiEye, FiSlash, FiCheckCircle } from "react-icons/fi";

function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin");
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const handleToggleBlock = async (user) => {
  
    if (user.role === "Admin") {
      toast.error("Admins cannot be blocked.");
      return;
    }

    const action = user.isActive ? "block" : "unblock";
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      await api.put(`/admin/${user.id}/toggle-block`);
      
  
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, isActive: !u.isActive } : u
      ));
      toast.success(`User ${action}ed successfully`);
    } catch (err) {
      toast.error("Failed to update user status");
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(search.toLowerCase()) || 
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-gray-100 font-sans">
      <SideBar />

      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">User Management</h1>

        {/* Search */}
        <div className="mb-6 max-w-md relative">
          <FiSearch className="absolute left-4 top-3.5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#121212] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>

        {/* Table */}
        <div className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                   <tr><td colSpan="4" className="p-8 text-center text-gray-500">Loading Users...</td></tr>
                ) : filteredUsers.length === 0 ? (
                   <tr><td colSpan="4" className="p-8 text-center text-gray-500">No users found.</td></tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-white font-bold">
                            {user.username?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-white">{user.username}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          user.role === "Admin" ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        {user.isActive ? (
                          <span className="flex items-center gap-2 text-green-400 text-sm font-bold">
                            <FiCheckCircle /> Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 text-red-400 text-sm font-bold">
                            <FiSlash /> Blocked
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => navigate(`/useredit/${user.id}`)}
                            className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                            title="View Details"
                          >
                            <FiEye />
                          </button>
                          
                          {/* ONLY Show Block Button if User is NOT Admin */}
                          {user.role !== "Admin" && (
                            <button 
                              onClick={() => handleToggleBlock(user)}
                              className={`p-2 rounded-lg transition-colors ${
                                user.isActive 
                                  ? "bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
                                  : "bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white"
                              }`}
                              title={user.isActive ? "Block User" : "Activate User"}
                            >
                              {user.isActive ? <FiSlash /> : <FiCheckCircle />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UsersAdmin;