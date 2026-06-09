import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { useToast } from "./Toast";

function Users() {

  const [users, setUsers] = useState([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("guard");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { showToast, ToastContainer } = useToast();

  async function fetchUsers() {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      setUsers(data || []);
    } catch {
      showToast("Could not load users.", "error");
    }
  }

  function validate() {
    const errs = {};
    if (!fullName.trim()) errs.fullName = "Name is required";
    else if (fullName.trim().length < 2) errs.fullName = "Name must be at least 2 characters";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function addUser() {
    if (!validate()) return;
    setLoading(true);
    try {
      const fakeId = crypto.randomUUID();
      const { error } = await supabase.from("profiles").insert([
        { id: fakeId, full_name: fullName.trim(), email: email.trim(), role },
      ]);

      if (error) {
        if (error.message.includes("duplicate") || error.message.includes("already exists")) {
          showToast("A user with this email already exists.", "error");
        } else {
          showToast("Error adding user. Please try again.", "error");
        }
        return;
      }

      showToast("User added successfully!", "success");
      setFullName(""); setEmail(""); setRole("guard");
      fetchUsers();
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchUsers(); }, []);

  function clearError(field) {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  return (
    <>
      <ToastContainer />
      <div className="mt-10">
        <h1 className="text-2xl font-bold mb-5 text-gray-800">User Management</h1>

        <div className="glass-card rounded-2xl p-6 mb-8 ring-1 ring-cyan-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">👤 Add New User</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter name"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); clearError("fullName"); }}
                className={`w-full h-12 border p-3 rounded-lg focus:outline-none focus:ring-2 transition ${errors.fullName ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-cyan-300"}`}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                className={`w-full h-12 border p-3 rounded-lg focus:outline-none focus:ring-2 transition ${errors.email ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-cyan-300"}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-12 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-white"
              >
                <option value="admin">Admin</option>
                <option value="supervisor">Supervisor</option>

              </select>
            </div>
          </div>

          <button
            onClick={addUser}
            disabled={loading}
            className={`mt-5 px-6 py-3 rounded-lg text-white font-semibold transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-cyan-600 hover:bg-cyan-700"
            }`}
          >
            {loading ? "Adding..." : "Add User"}
          </button>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-4 text-gray-600 font-semibold">Name</th>
                  <th className="text-left p-4 text-gray-600 font-semibold">Email</th>
                  <th className="text-left p-4 text-gray-600 font-semibold">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-400">No users found.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-4 font-medium">{user.full_name}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${
                          user.role === "admin" ? "bg-purple-100 text-purple-700" :
                          user.role === "supervisor" ? "bg-blue-100 text-blue-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Users;
