import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Auth from "./Auth";
import InventoryList from "./InventoryList";
import Header from "./Header";
import Sidebar from "./Sidebar";
import type { Session } from "@supabase/supabase-js";
import "./App.scss";

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

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell__main">
        <Header onLogout={handleLogout} showLogout={true} />
        <InventoryList />
      </div>
    </div>
  );
}