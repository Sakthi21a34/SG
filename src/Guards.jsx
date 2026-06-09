import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { useToast } from "./Toast";
import ConfirmModal from "./ConfirmModal";

const STATUS_OPTIONS = ["Active", "On Patrol", "Inactive", "On Leave"];

function Guards({ onGuardAdded }) {

  const [guards, setGuards] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [site, setSite] = useState("");
  const [status, setStatus] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { showToast, ToastContainer } = useToast();

  function validate() {
    const errs = {};
    if (!name.trim()) {
      errs.name = "Guard name is required";
    } else if (name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      errs.name = "Name should only contain letters";
    }
    if (!phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone.trim())) {
      errs.phone = "Enter a valid 10-digit phone number";
    }
    if (!site.trim()) {
      errs.site = "Site is required";
    } else if (site.trim().length < 2) {
      errs.site = "Site must be at least 2 characters";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function fetchGuards() {
    try {
      const { data, error } = await supabase
        .from("guards")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        showToast("Could not load guards. Please try again.", "error");
      } else {
        setGuards(data);
      }
    } catch {
      showToast("Network error. Please check your connection.", "error");
    }
  }

  async function addGuard() {
    if (!validate()) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("guards").insert([
        { name: name.trim(), phone: phone.trim(), site: site.trim(), status: status || "Active" },
      ]);

      if (error) {
        if (error.message.includes("duplicate")) {
          showToast("A guard with this phone number already exists.", "error");
        } else {
          showToast("Could not add guard. Please try again.", "error");
        }
        return;
      }

      showToast("Guard added successfully!", "success");
      setName(""); setPhone(""); setSite(""); setStatus("");
      fetchGuards();
      if (onGuardAdded) onGuardAdded();
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(guard) {
    setEditingId(guard.id);
    setName(guard.name);
    setPhone(guard.phone);
    setSite(guard.site);
    setStatus(guard.status);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setName(""); setPhone(""); setSite(""); setStatus("");
    setErrors({});
  }

  async function updateGuard() {
    if (!validate()) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("guards")
        .update({ name: name.trim(), phone: phone.trim(), site: site.trim(), status })
        .eq("id", editingId);

      if (error) {
        showToast("Could not update guard. Please try again.", "error");
        return;
      }

      showToast("Guard updated successfully!", "success");
      cancelEdit();
      fetchGuards();
      if (onGuardAdded) onGuardAdded();
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function deleteGuard(id) {
    try {
      const { error } = await supabase.from("guards").delete().eq("id", id);

      if (error) {
        showToast("Could not delete guard. Please try again.", "error");
        return;
      }

      showToast("Guard deleted successfully.", "success");
      fetchGuards();
      if (onGuardAdded) onGuardAdded();
    } catch {
      showToast("Network error. Please try again.", "error");
    }
  }

  useEffect(() => {
    fetchGuards();
  }, []);

  function clearError(field) {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  return (
    <>
      <ToastContainer />
      {confirmDelete && (
        <ConfirmModal
          message={`Are you sure you want to delete "${confirmDelete.name}"?`}
          onConfirm={() => { deleteGuard(confirmDelete.id); setConfirmDelete(null); }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <div className="mt-10">
        <h1 className="text-2xl font-bold mb-5 text-gray-800">Guards Management</h1>

        {/* ADD / EDIT FORM */}
        <div className={`glass-card rounded-2xl p-6 mb-8 transition ${editingId ? "ring-2 ring-blue-300" : "ring-1 ring-green-200"}`}>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {editingId ? "✏️ Edit Guard" : "➕ Add New Guard"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Guard Name</label>
              <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => { setName(e.target.value); clearError("name"); }}
                className={`w-full h-12 border p-3 rounded-lg focus:outline-none focus:ring-2 transition ${errors.name ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"}`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="10-digit number"
                maxLength={10}
                value={phone}
                onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); clearError("phone"); }}
                className={`w-full h-12 border p-3 rounded-lg focus:outline-none focus:ring-2 transition ${errors.phone ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"}`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Site</label>
              <input
                type="text"
                placeholder="Enter site"
                value={site}
                onChange={(e) => { setSite(e.target.value); clearError("site"); }}
                className={`w-full h-12 border p-3 rounded-lg focus:outline-none focus:ring-2 transition ${errors.site ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"}`}
              />
              {errors.site && <p className="text-red-500 text-sm mt-1">{errors.site}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-12 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              >
                <option value="">Select Status</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={editingId ? updateGuard : addGuard}
              disabled={loading}
              className={`px-6 py-3 rounded-lg text-white font-semibold transition ${
                loading ? "bg-gray-400 cursor-not-allowed" : editingId ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Saving..." : editingId ? "Update Guard" : "Add Guard"}
            </button>
            {editingId && (
              <button
                onClick={cancelEdit}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* GUARDS TABLE */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-4 text-gray-600 font-semibold">ID</th>
                  <th className="text-left p-4 text-gray-600 font-semibold">Name</th>
                  <th className="text-left p-4 text-gray-600 font-semibold">Phone</th>
                  <th className="text-left p-4 text-gray-600 font-semibold">Site</th>
                  <th className="text-left p-4 text-gray-600 font-semibold">Status</th>
                  <th className="text-left p-4 text-gray-600 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {guards.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">
                      No guards found. Add your first guard above.
                    </td>
                  </tr>
                ) : (
                  guards.map((guard) => (
                    <tr key={guard.id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-4 text-gray-500">{guard.id}</td>
                      <td className="p-4 font-medium">{guard.name}</td>
                      <td className="p-4">{guard.phone}</td>
                      <td className="p-4">{guard.site}</td>
                      <td className="p-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          guard.status === "Active" ? "bg-green-100 text-green-700" :
                          guard.status === "On Patrol" ? "bg-blue-100 text-blue-700" :
                          guard.status === "Inactive" ? "bg-gray-100 text-gray-500" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {guard.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(guard)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setConfirmDelete({ id: guard.id, name: guard.name })}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
                          >
                            Delete
                          </button>
                        </div>
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

export default Guards;
