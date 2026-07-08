import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { Item } from "./App";
import "./Dashboard.scss";

type DashboardProps = {
  items: Item[];
  loading: boolean;
};

export default function Dashboard({ items, loading }: DashboardProps) {
  const totalItems = items.length;
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockCount = items.filter((item) => item.quantity > 0 && item.quantity < 10).length;
  const outOfStockCount = items.filter((item) => item.quantity === 0).length;
  const inStockCount = totalItems - lowStockCount - outOfStockCount;

  const statusData = [
    { name: "In Stock", value: inStockCount, color: "#22c55e" },
    { name: "Low Stock", value: lowStockCount, color: "#eab308" },
    { name: "Out of Stock", value: outOfStockCount, color: "#ef4444" },
  ];

  const locationMap: Record<string, number> = {};
  items.forEach((item) => {
    locationMap[item.storage_location] = (locationMap[item.storage_location] || 0) + item.quantity;
  });
  const locationData = Object.entries(locationMap).map(([location, quantity]) => ({
    location,
    quantity,
  }));

  const recentItems = [...items]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h2 className="dashboard__title">Dashboard Overview</h2>

      <div className="dashboard__stats">
        <div className="stat-card">
          <span className="stat-card__label">Total Items</span>
          <span className="stat-card__value mono">{totalItems}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Total Units</span>
          <span className="stat-card__value mono">{totalUnits}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Low Stock</span>
          <span className="stat-card__value mono">{lowStockCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Out of Stock</span>
          <span className="stat-card__value mono">{outOfStockCount}</span>
        </div>
      </div>

      <div className="dashboard__charts">
        <div className="chart-card">
          <h3>Stock Status</h3>
          {totalItems === 0 ? (
            <p className="chart-empty">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="chart-legend">
            {statusData.map((entry) => (
              <div className="chart-legend__item" key={entry.name}>
                <span className="chart-legend__dot" style={{ background: entry.color }}></span>
                {entry.name} ({entry.value})
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>Units by Location</h3>
          {locationData.length === 0 ? (
            <p className="chart-empty">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={locationData}>
                <XAxis dataKey="location" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} />
                <Tooltip />
                <Bar dataKey="quantity" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="dashboard__recent">
        <h3>Recently Updated</h3>
        {recentItems.length === 0 ? (
          <p className="chart-empty">No items yet</p>
        ) : (
          <ul className="recent-list">
            {recentItems.map((item) => (
              <li key={item.id} className="recent-list__item">
                <span>{item.name}</span>
                <span className="mono">{item.quantity} units</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}