import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import "./History.scss";

type Movement = {
  id: number;
  item_name: string;
  action: string;
  previous_quantity: number | null;
  new_quantity: number | null;
  created_at: string;
};

export default function History() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovements();
  }, []);

  async function fetchMovements() {
    setLoading(true);
    const { data, error } = await supabase
      .from("stock_movements")
      .select()
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching history:", error);
      setLoading(false);
      return;
    }

    setMovements(data ?? []);
    setLoading(false);
  }

  function formatDateTime(isoString: string) {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function getActionClass(action: string) {
    if (action === "Created") return "success";
    if (action === "Deleted") return "danger";
    return "warning";
  }

  return (
    <div className="history">
      <h2 className="history__title">Stock Movement History</h2>

      {loading ? (
        <div className="loading-state">Loading history...</div>
      ) : movements.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__icon">📋</span>
          <p>No activity yet</p>
          <span className="empty-state__hint">Changes to your inventory will appear here</span>
        </div>
      ) : (
        <div className="history-list">
          {movements.map((movement) => (
            <div key={movement.id} className="history-item">
              <span className={`badge badge--${getActionClass(movement.action)}`}>
                {movement.action}
              </span>
              <span className="history-item__name">{movement.item_name}</span>
              <span className="history-item__change mono">
                {movement.previous_quantity !== null ? movement.previous_quantity : "—"}
                {" → "}
                {movement.new_quantity !== null ? movement.new_quantity : "—"}
              </span>
              <span className="history-item__time">{formatDateTime(movement.created_at)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}