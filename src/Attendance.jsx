import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { useToast } from "./Toast";

function Attendance() {

  const [guards, setGuards] = useState([]);
  const [records, setRecords] = useState([]);
  const [guardId, setGuardId] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [status, setStatus] = useState("Present");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { showToast, ToastContainer } = useToast();

  async function fetchGuards() {
    try {
      const { data } = await supabase.from("guards").select("*");
      setGuards(data || []);
    } catch {
      showToast("Could not load guards list.", "error");
    }
  }

  async function fetchAttendance() {
    try {
      const { data } = await supabase
        .from("attendance")
        .select(`*, guards(name)`)
        .order("id", { ascending: false });
      setRecords(data || []);
    } catch {
      showToast("Could not load attendance records.", "error");
    }
  }

  function validate() {
    const errs = {};
    if (!guardId) errs.guardId = "Please select a guard";
    if (!checkIn) errs.checkIn = "Check-in time is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function markAttendance() {
    if (!validate()) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("attendance").insert([
        { guard_id: guardId, check_in: checkIn, check_out: checkOut || null, status },
      ]);

      if (error) {
        if (error.message.includes("duplicate")) {
          showToast("Attendance already marked for this guard today.", "error");
        } else {
          showToast("Error marking attendance. Please try again.", "error");
        }
        return;
      }

      showToast("Attendance marked successfully!", "success");
      setGuardId("");
      setCheckIn("");
      setCheckOut("");
      setStatus("Present");
      fetchAttendance();
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGuards();
    fetchAttendance();
  }, []);

  function clearError(field) {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  return (
    <>
      <ToastContainer />
      <div className="mt-10">
        <h1 className="text-2xl font-bold mb-5 text-gray-800">Attendance Management</h1>

        {/* MARK ATTENDANCE FORM */}
        <div className="glass-card rounded-2xl p-6 mb-8 ring-1 ring-indigo-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">📋 Mark Attendance</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Select Guard</label>
              <select
                value={guardId}
                onChange={(e) => { setGuardId(e.target.value); clearError("guardId"); }}
                className={`w-full h-12 border p-3 rounded-lg focus:outline-none focus:ring-2 transition bg-white ${errors.guardId ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-indigo-300"}`}
              >
                <option value="">Select Guard</option>
                {guards.map((guard) => (
                  <option key={guard.id} value={guard.id}>{guard.name}</option>
                ))}
              </select>
              {errors.guardId && <p className="text-red-500 text-sm mt-1">{errors.guardId}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Check In</label>
              <input
                type="time"
                value={checkIn}
                onChange={(e) => { setCheckIn(e.target.value); clearError("checkIn"); }}
                className={`w-full h-12 border p-3 rounded-lg focus:outline-none focus:ring-2 transition ${errors.checkIn ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-indigo-300"}`}
              />
              {errors.checkIn && <p className="text-red-500 text-sm mt-1">{errors.checkIn}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Check Out</label>
              <input
                type="time"
                value={checkOut}
                onChange={(e) => { setCheckOut(e.target.value); clearError("checkOut"); }}
                className="w-full h-12 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-12 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Leave">Leave</option>
              </select>
            </div>
          </div>

          <button
            onClick={markAttendance}
            disabled={loading}
            className={`mt-5 px-6 py-3 rounded-lg text-white font-semibold transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {loading ? "Saving..." : "Mark Attendance"}
          </button>
        </div>

        {/* ATTENDANCE RECORDS TABLE */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-4 text-gray-600 font-semibold">Guard</th>
                  <th className="text-left p-4 text-gray-600 font-semibold">Date</th>
                  <th className="text-left p-4 text-gray-600 font-semibold">Check In</th>
                  <th className="text-left p-4 text-gray-600 font-semibold">Check Out</th>
                  <th className="text-left p-4 text-gray-600 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">
                      No attendance records yet.
                    </td>
                  </tr>
                ) : (
                  records.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-4 font-medium">{item.guards?.name}</td>
                      <td className="p-4 text-gray-500">{item.date}</td>
                      <td className="p-4">{item.check_in}</td>
                      <td className="p-4">{item.check_out || "—"}</td>
                      <td className="p-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${item.status === "Present" ? "bg-green-100 text-green-700" :
                          item.status === "Absent" ? "bg-red-100 text-red-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                          {item.status}
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

export default Attendance;
