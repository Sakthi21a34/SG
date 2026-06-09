import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { useToast } from "./Toast";

function Analytics() {

  const [totalGuards, setTotalGuards] = useState(0);
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [totalShifts, setTotalShifts] = useState(0);
  const [totalIncidents, setTotalIncidents] = useState(0);
  const { showToast, ToastContainer } = useToast();

  async function fetchAnalytics() {
    try {
      const { count: guardsCount } = await supabase
        .from("guards")
        .select("*", { count: "exact", head: true });
      setTotalGuards(guardsCount || 0);

      const { count: attendanceCount } = await supabase
        .from("attendance")
        .select("*", { count: "exact", head: true });
      setTotalAttendance(attendanceCount || 0);

      const { count: shiftsCount } = await supabase
        .from("shifts")
        .select("*", { count: "exact", head: true });
      setTotalShifts(shiftsCount || 0);

      const { count: incidentsCount } = await supabase
        .from("incidents")
        .select("*", { count: "exact", head: true });
      setTotalIncidents(incidentsCount || 0);
    } catch {
      showToast("Could not load analytics data.", "error");
    }
  }

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="grid grid-cols-1 md:grid-cols-6 gap-5 mb-10">
        <div className="glass-card rounded-2xl p-6 md:col-span-3 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl mb-3">👮</div>
              <p className="text-gray-500 text-sm font-medium">Total Guards</p>
              <p className="text-4xl font-bold text-gray-800 mt-1">{totalGuards}</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 md:col-span-2 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-xl mb-3">📋</div>
              <p className="text-gray-500 text-sm font-medium">Attendance Records</p>
              <p className="text-4xl font-bold text-gray-800 mt-1">{totalAttendance}</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 md:col-span-1 hover:shadow-lg transition">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-xl mb-3">🗓️</div>
            <p className="text-gray-500 text-sm font-medium">Shifts</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{totalShifts}</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 md:col-span-2 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-xl mb-3">🚨</div>
              <p className="text-gray-500 text-sm font-medium">Total Incidents</p>
              <p className="text-4xl font-bold text-gray-800 mt-1">{totalIncidents}</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 md:col-span-4 hover:shadow-lg transition flex items-center justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl mb-3">✅</div>
            <p className="text-gray-500 text-sm font-medium">System Status</p>
            <p className="text-lg font-medium text-emerald-600 mt-1">All systems operational</p>
          </div>
          <div className="text-5xl text-emerald-500">✓</div>
        </div>
      </div>
    </>
  );
}

export default Analytics;
