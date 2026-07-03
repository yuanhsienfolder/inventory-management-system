import { useState } from "react";
import "./AddItemForm.scss";

type AddItemFormProps = {
  onAdd: (name: string, quantity: number, storageLocation: string) => void;
};

export default function AddItemForm({ onAdd }: AddItemFormProps) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [storageLocation, setStorageLocation] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name, quantity, storageLocation || "Warehouse A");
    setName("");
    setQuantity(0);
    setStorageLocation("");
  }

  return (
    <form className="add-item-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Qty"
        value={quantity}
        min={0}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />
      <input
        type="text"
        placeholder="Storage location"
        value={storageLocation}
        onChange={(e) => setStorageLocation(e.target.value)}
      />
      <button type="submit" className="btn-primary">
        + Add Item
      </button>
    </form>
  );
}