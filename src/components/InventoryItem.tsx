import { useState } from "react";
import "./InventoryItem.scss";

type InventoryItemProps = {
  id: number;
  name: string;
  quantity: number;
  storageLocation: string;
  updatedAt: string;
  sku: string;
  category: string;
  assignedTo: string;
  onDelete: () => void;
  onUpdate: (
    id: number,
    name: string,
    quantity: number,
    storageLocation: string,
    sku: string,
    category: string,
    assignedTo: string
  ) => void;
  isSelected: boolean;
  onToggleSelect: () => void;
};

export default function InventoryItem({
  id,
  name,
  quantity,
  storageLocation,
  updatedAt,
  sku,
  category,
  assignedTo,
  onDelete,
  onUpdate,
  isSelected,
  onToggleSelect,
}: InventoryItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editName, setEditName] = useState(name);
  const [editQuantity, setEditQuantity] = useState(quantity);
  const [editLocation, setEditLocation] = useState(storageLocation);
  const [editSku, setEditSku] = useState(sku);
  const [editCategory, setEditCategory] = useState(category);
  const [editAssignedTo, setEditAssignedTo] = useState(assignedTo);

  function getStatus() {
    if (quantity === 0) return { label: "Out of Stock", className: "danger" };
    if (quantity < 10) return { label: "Low Stock", className: "warning" };
    return { label: "In Stock", className: "success" };
  }

  function formatDate(isoString: string) {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function handleEditClick() {
    setIsEditing(true);
    setMenuOpen(false);
  }

  function handleCancel() {
    setEditName(name);
    setEditQuantity(quantity);
    setEditLocation(storageLocation);
    setEditSku(sku);
    setEditCategory(category);
    setEditAssignedTo(assignedTo);
    setIsEditing(false);
  }

  function handleSave() {
    onUpdate(id, editName, editQuantity, editLocation, editSku, editCategory, editAssignedTo);
    setIsEditing(false);
  }

  const status = getStatus();

  if (isEditing) {
    return (
      <div className="item-row item-row--editing">
        <input type="checkbox" className="item-row__checkbox" disabled />
        <input
          type="text"
          className="item-row__edit-input"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />
        <input
          type="text"
          className="item-row__edit-input"
          value={editSku}
          onChange={(e) => setEditSku(e.target.value)}
        />
        <input
          type="number"
          className="item-row__edit-input"
          value={editQuantity}
          onChange={(e) => setEditQuantity(Number(e.target.value))}
        />
        <select
  className="item-row__edit-input"
  value={editCategory}
  onChange={(e) => setEditCategory(e.target.value)}
>
  <option value="">Select category</option>
  <option value="Peripherals">Peripherals</option>
  <option value="Cables">Cables</option>
  <option value="Monitors">Monitors</option>
  <option value="Laptops">Laptops</option>
  <option value="Storage">Storage</option>
  <option value="Networking">Networking</option>
  <option value="Accessories">Accessories</option>
  <option value="Other">Other</option>
</select>
        <input
          type="text"
          className="item-row__edit-input"
          value={editLocation}
          onChange={(e) => setEditLocation(e.target.value)}
        />
        <input
          type="text"
          className="item-row__edit-input"
          value={editAssignedTo}
          onChange={(e) => setEditAssignedTo(e.target.value)}
        />
        <span></span>
        <div className="item-row__edit-actions">
          <button className="btn-save" onClick={handleSave}>Save</button>
          <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="item-row">
      <input
        type="checkbox"
        className="item-row__checkbox"
        checked={isSelected}
        onChange={onToggleSelect}
      />
      <span className="item-row__name">{name}</span>
      <span className="item-row__sku mono">{sku}</span>
      <span className="item-row__qty mono">{quantity}</span>
      <span className="item-row__category">{category}</span>
      <span className="item-row__location">{storageLocation}</span>
      <span className="item-row__assigned">{assignedTo || "—"}</span>
      <span className="item-row__date">{formatDate(updatedAt)}</span>
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
            <button className="dropdown-menu__item" onClick={handleEditClick}>
              Edit
            </button>
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