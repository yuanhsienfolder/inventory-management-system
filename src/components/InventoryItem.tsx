
import "./InventoryItem.scss";

type InventoryItemProps = {
  name: string;
  quantity: number;
  onDelete: () => void;
};

export default function InventoryItem({ name, quantity, onDelete }: InventoryItemProps) {
  function getStatus (){
    if (quantity === 0) return { label: "Out of stock", className:"danger" };
    if (quantity < 10) return { label: "Low stock", className:"warning"};
    return { label: "In stock", className:"success" };
  }

    const status = getStatus();
  return (
    <div className="item-row">
      <span className="item-row__name">{name}</span>
      <span className="item-row__qty mono">{quantity}</span>
      <span className={`badge badge--${status.className}`}>{status.label}</span>
      <button className="item-row__delete" onClick={onDelete} aria-label={`Delete ${name}`}>
        ✕
      </button>
    </div>
  );
};