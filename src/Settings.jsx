import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { useToast } from "./Toast";
import LoadingOverlay from "./LoadingOverlay";
import ConfirmModal from "./ConfirmModal";

const SHIFT_OPTIONS = ["Morning Shift", "Evening Shift", "Night Shift", "Full Day"];
const DEFAULT_TIMINGS = {
  "Morning Shift": { start: "06:00", end: "14:00" },
  "Evening Shift": { start: "14:00", end: "22:00" },
  "Night Shift": { start: "22:00", end: "06:00" },
  "Full Day": { start: "08:00", end: "20:00" },
};

function Settings({ onStartTour }) {
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [confirmConfig, setConfirmConfig] = useState(null);
  const { showToast, ToastContainer } = useToast();
  const [shiftTimings, setShiftTimings] = useState(DEFAULT_TIMINGS);

  async function fetchTimings() {
    try {
      const { data } = await supabase.from("shift_timings").select("*");
      if (data && data.length > 0) {
        const timings = {};
        data.forEach((row) => {
          timings[row.shift_name] = { start: row.start_time?.substring(0, 5), end: row.end_time?.substring(0, 5) };
        });
        setShiftTimings((prev) => ({ ...prev, ...timings }));
      }
    } catch {
      showToast("Could not load shift timings.", "error");
    }
  }

  async function saveTimings() {
    setLoading(true);
    setLoadingMsg("Saving shift timings...");
    try {
      for (const [shiftName, times] of Object.entries(shiftTimings)) {
        const { error } = await supabase.from("shift_timings").upsert(
          { shift_name: shiftName, start_time: times.start, end_time: times.end },
          { onConflict: "shift_name" }
        );
        if (error) {
          showToast("Error saving timings. Please try again.", "error");
          setLoading(false);
          return;
        }
      }
      showToast("Shift timings saved successfully!", "success");
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
      setLoadingMsg("");
    }
  }

  async function resetTimings() {
    setLoading(true);
    setLoadingMsg("Resetting timings...");
    try {
      for (const [shiftName, times] of Object.entries(DEFAULT_TIMINGS)) {
        await supabase.from("shift_timings").upsert(
          { shift_name: shiftName, start_time: times.start, end_time: times.end },
          { onConflict: "shift_name" }
        );
      }
      setShiftTimings(DEFAULT_TIMINGS);
      showToast("Timings reset to defaults!", "success");
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
      setLoadingMsg("");
    }
  }

  useEffect(() => {
    fetchTimings();
  }, []);

  async function executeClearAllGuardsPhotos() {
    setLoading(true);
    setLoadingMsg("Deleting all guard photos...");
    try {
      // 1. List all files in the guard-photos bucket
      const { data: files, error: listErr } = await supabase.storage.from("guard-photos").list("", { limit: 1000 });
      if (listErr) throw listErr;

      const fileNames = (files || []).map(f => f.name).filter(name => name !== ".emptyFolderPlaceholder");
      if (fileNames.length > 0) {
        const { error: delErr } = await supabase.storage.from("guard-photos").remove(fileNames);
        if (delErr) throw delErr;
      }

      // 2. Set photo fields to null in the database
      const { error: dbErr } = await supabase
        .from("attendance")
        .update({ check_in_photo: null, check_out_photo: null })
        .or("check_in_photo.not.is.null,check_out_photo.not.is.null");

      if (dbErr) throw dbErr;

      showToast(`Successfully deleted ${fileNames.length} selfie photos from storage and database.`, "success");
    } catch (err) {
      showToast("Clear photos failed: " + err.message, "error");
    } finally {
      setLoading(false);
      setLoadingMsg("");
    }
  }

  function clearAllGuardsPhotos() {
    setConfirmConfig({
      message: "Are you sure you want to permanently delete ALL guard check-in/out selfie photos from Supabase Storage and database? This action is irreversible.",
      onConfirm: executeClearAllGuardsPhotos
    });
  }

  async function executeClearAllVoiceNotes() {
    setLoading(true);
    setLoadingMsg("Deleting all voice notes...");
    try {
      // 1. List all files in the voice-requests bucket
      const { data: files, error: listErr } = await supabase.storage.from("voice-requests").list("", { limit: 1000 });
      if (listErr) throw listErr;

      const fileNames = (files || []).map(f => f.name).filter(name => name !== ".emptyFolderPlaceholder");
      if (fileNames.length > 0) {
        const { error: delErr } = await supabase.storage.from("voice-requests").remove(fileNames);
        if (delErr) throw delErr;
      }

      // 2. Set audio_url fields to null in the database
      const { error: dbErr } = await supabase
        .from("attendance_requests")
        .update({ audio_url: null })
        .not("audio_url", "is", null);

      if (dbErr) throw dbErr;

      showToast(`Successfully deleted ${fileNames.length} voice notes from storage and database.`, "success");
    } catch (err) {
      showToast("Clear voice notes failed: " + err.message, "error");
    } finally {
      setLoading(false);
      setLoadingMsg("");
    }
  }

  function clearAllVoiceNotes() {
    setConfirmConfig({
      message: "Are you sure you want to permanently delete ALL guard voice notes from Supabase Storage and database? This action is irreversible.",
      onConfirm: executeClearAllVoiceNotes
    });
  }

  async function executeFullSystemReset() {
    setLoading(true);
    setLoadingMsg("Resetting system database...");
    try {
      // 1. First, call RPC to remove non-admin user credentials from Supabase Auth
      const { error: rpcErr } = await supabase.rpc("clear_non_admin_auth_users");
      if (rpcErr) {
        console.warn("Auth cleanup RPC failed (make sure SQL function is created in Supabase):", rpcErr);
      }

      // Order of deletion to respect potential foreign key constraints (child tables first)
      const tables = [
        "live_tracking",
        "attendance",
        "attendance_requests",
        "incidents",
        "shifts",
        "shift_timings",
        "circulars",
        "notifications",
        "guards",
        "duty_locations"
      ];

      for (const table of tables) {
        const { error } = await supabase.from(table).delete().not("id", "is", null);
        if (error) {
          console.warn(`Non-critical or handled error deleting from ${table}:`, error);
        }
      }

      // Delete non-admin profiles
      const { error: profileErr } = await supabase
        .from("profiles")
        .delete()
        .neq("role", "admin");
      
      if (profileErr) throw profileErr;

      showToast("System database reset successfully. All data cleared except admin profiles.", "success");
    } catch (err) {
      showToast("Database reset failed: " + err.message, "error");
    } finally {
      setLoading(false);
      setLoadingMsg("");
    }
  }

  function fullSystemReset() {
    setConfirmConfig({
      message: "WARNING: This will permanently delete ALL guards, attendance records, shifts, circulars, incidents, duty locations, and non-admin profiles. Admin profiles will be kept. Do you want to proceed?",
      onConfirm: executeFullSystemReset
    });
  }

  return (
    <>
      <ToastContainer />
      {loading && <LoadingOverlay message={loadingMsg || "Processing request..."} />}
      {confirmConfig && (
        <ConfirmModal
          message={confirmConfig.message}
          onConfirm={() => {
            confirmConfig.onConfirm();
            setConfirmConfig(null);
          }}
          onCancel={() => setConfirmConfig(null)}
        />
      )}

      <div className="space-y-6 max-w-4xl">
        <div className="glass-card rounded-3xl p-6 ring-1 ring-blue-150">
          <h2 className="text-xl font-bold text-gray-800 mb-2">⚙️ System Cleanup Settings</h2>
          <p className="text-sm text-gray-500 mb-6">Manage system storage limits and clean up old data from Supabase Storage and the database.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Guard Photos Cleanup Card */}
            <div className="bg-white/80 rounded-2xl p-5 border border-gray-100 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mb-4">📸</div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">Clear All Guards Photos</h3>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Permanently deletes all check-in and check-out selfie files in Supabase Storage (`guard-photos` bucket) and clears their links in the database. Attendance records remain intact.
                </p>
              </div>
              <button
                onClick={clearAllGuardsPhotos}
                className="w-full h-11 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition mt-2 shadow-sm"
              >
                Delete All Selfie Photos
              </button>
            </div>

            {/* Voice Notes Cleanup Card */}
            <div className="bg-white/80 rounded-2xl p-5 border border-gray-100 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl mb-4">🎤</div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">Clear All Voice Notes</h3>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Permanently deletes all voice note `.webm` files recorded for admin requests in Supabase Storage (`voice-requests` bucket) and sets their links to null. Requests remain intact.
                </p>
              </div>
              <button
                onClick={clearAllVoiceNotes}
                className="w-full h-11 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition mt-2 shadow-sm"
              >
                Delete All Voice Notes
              </button>
            </div>

            {/* Full System Reset Card */}
            <div className="bg-white/80 rounded-2xl p-5 border border-red-200 flex flex-col justify-between shadow-sm md:col-span-2">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-650 flex items-center justify-center text-2xl mb-4">⚠️</div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">Full System Database Reset</h3>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Permanently deletes all data across all tables (guards, attendance, circulars, incidents, shifts, tracking, etc.) from the database. <strong>Administrative login profiles (admins) will not be deleted</strong>, ensuring you don't lose system access.
                </p>
              </div>
              <button
                onClick={fullSystemReset}
                className="w-full h-11 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition mt-2 shadow-sm"
              >
                Reset System Database
              </button>
            </div>

            {/* Guided Tour Card */}
            <div className="bg-white/80 rounded-2xl p-5 border border-indigo-200 flex flex-col justify-between shadow-sm md:col-span-2">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-605 flex items-center justify-center text-2xl mb-4">📖</div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">Help & Audio Guided Tour</h3>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Start an automated guided tour that switches between each module and uses text-to-speech voiceover (in English) to explain all functions, buttons, and settings.
                </p>
              </div>
              <button
                onClick={onStartTour}
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition mt-2 shadow-sm"
              >
                Start Help Tour
              </button>
            </div>
          </div>
        </div>

        {/* Shift Timings Card */}
        <div className="glass-card rounded-3xl p-6 ring-1 ring-purple-150">
          <h2 className="text-xl font-bold text-gray-800 mb-2">⏰ Constant Shift Timings Settings</h2>
          <p className="text-sm text-gray-500 mb-6">Configure the default start and end times for scheduled shift presets. These are used as autofill values when registering or editing guards.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SHIFT_OPTIONS.map((shift) => (
              <div key={shift} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-2.5">{shift}</h3>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={shiftTimings[shift]?.start || ""}
                      onChange={(e) => setShiftTimings((prev) => ({
                        ...prev,
                        [shift]: { ...prev[shift], start: e.target.value },
                      }))}
                      className="w-full h-10 border border-gray-200 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">End Time</label>
                    <input
                      type="time"
                      value={shiftTimings[shift]?.end || ""}
                      onChange={(e) => setShiftTimings((prev) => ({
                        ...prev,
                        [shift]: { ...prev[shift], end: e.target.value },
                      }))}
                      className="w-full h-10 border border-gray-200 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={resetTimings}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-550 hover:bg-gray-50 transition text-xs font-bold"
            >
              Reset to Defaults
            </button>
            <button
              onClick={saveTimings}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition text-xs font-bold shadow-md shadow-indigo-150"
            >
              Save Shift Timings
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
