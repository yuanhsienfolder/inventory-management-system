import "./Sidebar.scss";
import Suppliers from "./Suppliers";

type SidebarProps = {
  activeView: string;
  onNavigate: (view: "dashboard" | "inventory" | "reports" | "history" | "suppliers" | "purchase-orders") => void;
};
    

const NAV_ITEMS = [
  { label: "Dashboard", icon: "▦", value: "dashboard" as const },
  { label: "Inventory", icon: "◫", value: "inventory" as const },
  { label: "Suppliers", icon: "▭", value: "suppliers" as const },
  { label: "Purchase Orders", icon: "▤", value: "purchase-orders" as const },
  { label: "Reports", icon: "▤", value: "reports" as const },
  { label: "History", icon: "◷", value: "history" as const },
];

export default function Sidebar({ activeView, onNavigate }: SidebarProps) {
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
            className={`sidebar__link ${item.value === activeView ? "sidebar__link--active" : ""}`}
            onClick={()=>onNavigate(item.value)}
          >
            <span className="sidebar__icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}