import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Auth from "./Auth";
import InventoryList from "./InventoryList";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import Reports from "./Reports";
import type { Session } from "@supabase/supabase-js";
import "./App.scss";

export type Item = {
  id: number;
  name: string;
  quantity: number;
  storage_location: string;
  updated_at: string;
};

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [activeView, setActiveView] = useState<"dashboard" | "inventory" | "reports">("dashboard");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) fetchItems();
  }, [session]);

  async function fetchItems() {
    setLoading(true);
    const { data, error } = await supabase.from("items").select();

    if (error) {
      console.error("Error fetching items:", error);
      setLoading(false);
      return;
    }

    setItems(data ?? []);
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <div className="app-shell__main">
        <Header onLogout={handleLogout} showLogout={true} />
        {activeView === "dashboard" && <Dashboard items={items} loading={loading} />}
        {activeView === "inventory" && <InventoryList items={items} setItems={setItems} loading={loading} refetch={fetchItems} />}
        {activeView === "reports" && <Reports items={items} />}
      </div>
    </div>
  );
}