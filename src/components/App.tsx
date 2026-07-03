import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Auth from "./Auth";
import InventoryList from "./InventoryList";
import type { Session } from "@supabase/supabase-js";
import ThemeToggle from "./ThemeToggle";
import Header from "./Header";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
  }
  return (
    <div>
    <Header onLogout={handleLogout} showLogout={!!session} />
      {session ? <InventoryList /> : <Auth />}
    </div>
  );
}