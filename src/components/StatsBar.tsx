import "./StatsBar.scss";

type StatsBarProps = {
  totalItems: number;
  totalUnits: number;
  lowStockCount: number;
};

export default function StatsBar({ totalItems, totalUnits, lowStockCount }: StatsBarProps) {
  return (
    <div className="stats-bar">
      <div className="stat-card">
        <span className="stat-card__label">Total Items</span>
        <span className="stat-card__value mono">{totalItems}</span>
      </div>
      <div className="stat-card">
        <span className="stat-card__label">Total Units</span>
        <span className="stat-card__value mono">{totalUnits}</span>
      </div>
      <div className={`stat-card ${lowStockCount > 0 ? "stat-card--warning" : ""}`}>
        <span className="stat-card__label">Low Stock</span>
        <span className="stat-card__value mono">{lowStockCount}</span>
      </div>
    </div>
  );
}