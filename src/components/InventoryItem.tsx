import { useState } from "react";
import "./InventoryItem.scss";

type InventoryItemProps = {
  name: string;
  quantity: number;
  onDelete: () => void;
};

export default function InventoryItem({ name, quantity, onDelete }: InventoryItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  function getStatus() {
    if (quantity === 0) return { label: "Out of Stock", className: "danger" };
    if (quantity < 10) return { label: "Low Stock", className: "warning" };
    return { label: "In Stock", className: "success" };
  }

  const status = getStatus();

  return (
    <div className="item-row">
      <input type="checkbox" className="item-row__checkbox" />
      <span className="item-row__name">{name}</span>
      <span className="item-row__qty mono">{quantity}</span>
      <span className={`badge badge--${status.className}`}>{status.label}</span>
      <div className="item-row__menu-wrapper">
        <button
          className="item-row__menu-trigger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={`Actions for ${name}`}
        >
          ⋯
        </button>
        {menuOpen && (
          <div className="dropdown-menu">
            <button
              className="dropdown-menu__item dropdown-menu__item--danger"
              onClick={() => {
                onDelete();
                setMenuOpen(false);
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}