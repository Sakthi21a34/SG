import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {

  const [session, setSession] = useState(null);
  const [role, setRole] = useState("");

  async function fetchRole(userId) {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();
    if (data) setRole(data.role);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchRole(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) fetchRole(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) return <Login setSession={setSession} />;

  return <Dashboard role={role} />;
}

export default App;
