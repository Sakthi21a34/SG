import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function Charts() {

  const [barData, setBarData] = useState({ labels: [], datasets: [] });
  const [pieData, setPieData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    async function fetchData() {
      const { count: guards } = await supabase.from("guards").select("*", { count: "exact", head: true });
      const { count: attendance } = await supabase.from("attendance").select("*", { count: "exact", head: true });
      const { count: shifts } = await supabase.from("shifts").select("*", { count: "exact", head: true });
      const { count: incidents } = await supabase.from("incidents").select("*", { count: "exact", head: true });

      setBarData({
        labels: ["Guards", "Attendance", "Shifts", "Incidents"],
        datasets: [{
          label: "Count",
          data: [guards || 0, attendance || 0, shifts || 0, incidents || 0],
          backgroundColor: ["#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"],
        }],
      });

      const { data: statuses } = await supabase.from("incidents").select("incident_status");
      if (statuses) {
        const counts = {};
        statuses.forEach((i) => { counts[i.incident_status] = (counts[i.incident_status] || 0) + 1; });
        const labels = Object.keys(counts);
        const values = Object.values(counts);
        setPieData({
          labels,
          datasets: [{
            data: values,
            backgroundColor: ["#f59e0b", "#3b82f6", "#10b981"],
          }],
        });
      }
    }
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-5 text-gray-700">System Overview</h2>
        <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-5 text-gray-700">Incident Status</h2>
        {pieData.labels.length > 0
          ? <Pie data={pieData} options={{ responsive: true }} />
          : <div className="flex items-center justify-center h-[300px] text-gray-400">No incident data</div>
        }
      </div>
    </div>
  );
}

export default Charts;
