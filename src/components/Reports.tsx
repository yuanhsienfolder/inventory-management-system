import type { Item } from "./App";
import "./Reports.scss";

type ReportsProps = {
  items: Item[];
};

export default function Reports({ items }: ReportsProps) {

  const categoryMap: Record<string, { count: number; units: number }> = {};

items.forEach((item) => {
  const cat = item.category || "Uncategorized";
  if (!categoryMap[cat]) {
    categoryMap[cat] = { count: 0, units: 0 };
  }
  categoryMap[cat].count += 1;
  categoryMap[cat].units += item.quantity;
});

const categoryRows = Object.entries(categoryMap).map(([category, stats]) => ({
  category,
  ...stats,
}));
  const locationMap: Record<string, { count: number; units: number }> = {};

  items.forEach((item) => {
    if (!locationMap[item.storage_location]) {
      locationMap[item.storage_location] = { count: 0, units: 0 };
    }
    locationMap[item.storage_location].count += 1;
    locationMap[item.storage_location].units += item.quantity;
  });

  const locationRows = Object.entries(locationMap).map(([location, stats]) => ({
    location,
    ...stats,
  }));

  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = items.filter((item) => item.quantity > 0 && item.quantity < 10);
  const outOfStockItems = items.filter((item) => item.quantity === 0);

  return (
    <div className="reports">
      <h2 className="reports__title">Reports</h2>

      <div className="report-section">
        <h3>Breakdown by Location</h3>
        <div className="report-section">
  <h3>Breakdown by Category</h3>
  {categoryRows.length === 0 ? (
    <p className="reports-empty">No data yet</p>
  ) : (
    <table className="report-table">
      <thead>
        <tr>
          <th>Category</th>
          <th>Item Types</th>
          <th>Total Units</th>
        </tr>
      </thead>
      <tbody>
        {categoryRows.map((row) => (
          <tr key={row.category}>
            <td>{row.category}</td>
            <td className="mono">{row.count}</td>
            <td className="mono">{row.units}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
        {locationRows.length === 0 ? (
          <p className="reports-empty">No data yet</p>
        ) : (
          <table className="report-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Item Types</th>
                <th>Total Units</th>
              </tr>
            </thead>
            <tbody>
              {locationRows.map((row) => (
                <tr key={row.location}>
                  <td>{row.location}</td>
                  <td className="mono">{row.count}</td>
                  <td className="mono">{row.units}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                <td className="mono">{items.length}</td>
                <td className="mono">{totalUnits}</td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      <div className="report-section">
        <h3>Low Stock Items ({lowStockItems.length})</h3>
        {lowStockItems.length === 0 ? (
          <p className="reports-empty">No low stock items</p>
        ) : (
          <ul className="report-list">
            {lowStockItems.map((item) => (
              <li key={item.id}>
                <span>{item.name}</span>
                <span className="mono">{item.quantity} left</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="report-section">
        <h3>Out of Stock Items ({outOfStockItems.length})</h3>
        {outOfStockItems.length === 0 ? (
          <p className="reports-empty">No out of stock items</p>
        ) : (
          <ul className="report-list">
            {outOfStockItems.map((item) => (
              <li key={item.id}>
                <span>{item.name}</span>
                <span className="mono">{item.storage_location}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}