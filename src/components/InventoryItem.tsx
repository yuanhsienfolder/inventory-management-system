type InventoryItemProps = {
  name: string;
  quantity: number;
  onDelete: () => void;
};

export default function InventoryItem({ name, quantity, onDelete }: InventoryItemProps) {
  return (
    <div>
      <p>{name} - Qty: {quantity}</p>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
}