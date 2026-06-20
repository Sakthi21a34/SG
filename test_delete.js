import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkowndltrknbkrbyfvnx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrb3duZGx0cmtuYmtyYnlmdm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5Nzk3MjIsImV4cCI6MjA5NjU1NTcyMn0.eDfbZqKQgEKkU4pJZirhlWRMeykGoIEZFzxuMW1cO0Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const fileName = 'guard_10_1781777175300.jpg';
  console.log(`Attempting to delete file: ${fileName}...`);
  const { data, error } = await supabase.storage.from("guard-photos").remove([fileName]);
  if (error) {
    console.error("Error deleting file:", error);
  } else {
    console.log("Delete result:", data);
  }
}

run();
