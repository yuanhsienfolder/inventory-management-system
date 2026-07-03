import "./Sidebar.scss";

const NAV_ITEMS = [
  { label: "Dashboard", icon: "▦" },
  { label: "Inventory", icon: "◫" },
  { label: "Reports", icon: "▤" },
  { label: "Settings", icon: "⚙" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo">▣</span>
        <h1>StockKeep</h1>
      </div>
      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            className={`sidebar__link ${item.label === "Inventory" ? "sidebar__link--active" : ""}`}
          >
            <span className="sidebar__icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}