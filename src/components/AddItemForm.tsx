import { useState } from "react";
import "./AddItemForm.scss";

type AddItemFormProps = {
  onAdd: (
    name: string,
    quantity: number,
    storageLocation: string,
    sku: string,
    category: string,
    assignedTo: string
  ) => void;
};

export default function AddItemForm({ onAdd }: AddItemFormProps) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [storageLocation, setStorageLocation] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Item name is required");
      return;
    }

    if (quantity < 0) {
      setError("Quantity cannot be negative");
      return;
    }

    onAdd(
      name,
      quantity,
      storageLocation || "Warehouse A",
      sku,
      category || "General",
      assignedTo
    );
    setName("");
    setQuantity(0);
    setStorageLocation("");
    setSku("");
    setCategory("");
    setAssignedTo("");
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
        type="text"
        placeholder="SKU"
        value={sku}
        onChange={(e) => setSku(e.target.value)}
      />
      <input
        type="number"
        placeholder="Qty"
        value={quantity}
        min={0}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
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
        placeholder="Storage location"
        value={storageLocation}
        onChange={(e) => setStorageLocation(e.target.value)}
      />
      <input
        type="text"
        placeholder="Assigned to"
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
      />
      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="btn-primary">
        + Add Item
      </button>
    </form>
  );
}