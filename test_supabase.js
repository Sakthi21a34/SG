import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkowndltrknbkrbyfvnx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrb3duZGx0cmtuYmtyYnlmdm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5Nzk3MjIsImV4cCI6MjA5NjU1NTcyMn0.eDfbZqKQgEKkU4pJZirhlWRMeykGoIEZFzxuMW1cO0Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Listing files in guard-photos bucket...");
  const { data, error } = await supabase.storage.from("guard-photos").list();
  if (error) {
    console.error("Error listing files:", error);
  } else {
    console.log("Files:", data);
  }
}

run();
