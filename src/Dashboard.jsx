import { useState } from "react";
import { supabase } from "./lib/supabase";
import Sidebar from "./Sidebar";
import Guards from "./Guards";
import Attendance from "./Attendance";
import Shifts from "./Shifts";
import Incidents from "./Incidents";
import Analytics from "./Analytics";
import Charts from "./Charts";
import Users from "./Users";
import { useToast } from "./Toast";

function Dashboard({ role }) {

  const [page, setPage] = useState("dashboard");
  const { showToast, ToastContainer } = useToast();

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      window.location.reload();
    } catch {
      showToast("Error signing out. Please try again.", "error");
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen pb-16 md:pb-0">
        <Sidebar role={role} page={page} onNavigate={setPage} onLogout={handleLogout} />

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 capitalize">{page}</h1>
                <p className="text-gray-500 mt-1">
                  Logged in as: <span className="font-medium capitalize text-blue-600">{role || "user"}</span>
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl text-sm font-medium transition flex items-center gap-2 self-start md:self-auto shadow-md"
              >
                <span>🚪</span> Logout
              </button>
            </div>
          </div>

          {page === "dashboard" && (
            <>
              <Analytics />
              <Charts />
            </>
          )}
          {page === "guards" && <Guards />}
          {page === "attendance" && <Attendance />}
          {page === "shifts" && role === "admin" && <Shifts />}
          {page === "incidents" && <Incidents />}
          {page === "patrols" && (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className="text-6xl mb-4">🚶</div>
              <h2 className="text-2xl font-bold text-gray-700">Patrols Module</h2>
              <p className="text-gray-400 mt-2">Coming soon — real-time patrol tracking</p>
            </div>
          )}
          {page === "users" && role === "admin" && <Users />}
          {page === "reports" && role === "admin" && (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className="text-6xl mb-4">📄</div>
              <h2 className="text-2xl font-bold text-gray-700">Reports Module</h2>
              <p className="text-gray-400 mt-2">Coming soon — analytics and reporting</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
