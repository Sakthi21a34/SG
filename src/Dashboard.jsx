import { useState } from "react";
import { supabase } from "./lib/supabase";
import Sidebar from "./Sidebar";
import StaffRegistry from "./StaffRegistry";
import GuardProfiles from "./GuardProfiles";
import LiveOps from "./LiveOps";
import Incidents from "./Incidents";
import Circulars from "./Circulars";
import CorrectionRequests from "./CorrectionRequests";
import SystemAccess from "./SystemAccess";
import Analytics from "./Analytics";
import Charts from "./Charts";
import { useToast } from "./Toast";
import Notifications from "./Notifications";

function Dashboard({ role }) {

  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      <div className="flex min-h-screen">
        <Sidebar role={role} page={page} onNavigate={setPage} onLogout={handleLogout} isOpen={sidebarOpen} onOpen={() => setSidebarOpen(true)} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="glass-card rounded-2xl p-4 md:p-6 mb-8 relative z-50">
            <div className="flex justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                {/* Mobile hamburger - inside the card, aligned with title */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-xl md:text-3xl font-bold text-gray-800 capitalize leading-tight">{page.replace("-", " ")}</h1>
                  <p className="text-xs md:text-base text-gray-500 mt-0.5">
                    Logged in as: <span className="font-medium capitalize text-blue-600">{role || "user"}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center shrink-0 gap-2 md:gap-3">
                <Notifications role={role} onNavigate={setPage} />
                <button
                  onClick={handleLogout}
                  className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition shadow-sm"
                  title="Logout"
                >
                  <span className="text-base md:text-lg">🚪</span>
                </button>
              </div>
            </div>
          </div>

          {page === "dashboard" && (
            <>
              <Analytics />
              <Charts />
            </>
          )}
          {page === "live-ops" && <LiveOps role={role} />}
          {page === "staff-registry" && role === "admin" && <StaffRegistry />}
          {page === "guard-profiles" && (role === "admin" || role === "supervisor") && <GuardProfiles />}
          {page === "system-users" && role === "admin" && <SystemAccess />}
          {page === "incidents" && <Incidents role={role} />}
          {page === "circulars" && <Circulars role={role} />}
          {page === "correction-requests" && <CorrectionRequests role={role} />}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
