import { useState } from "react";
import InventoryItem from "./InventoryItem";
import AddItemForm from "./AddItemForm";
import { supabase } from "../lib/supabase";
import StatsBar from "./StatsBar";
import "./InventoryList.scss";
import SearchBar from "./SearchBar";
import Toast from "./Toast";
import ConfirmModal from "./ConfirmModal";
import type { Item } from "./App";

type InventoryListProps = {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  loading: boolean;
  refetch: () => void;
};

export default function InventoryList({ items, setItems, loading, refetch }: InventoryListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function confirmDelete() {
    if (confirmDeleteId === null) return;

    const { error } = await supabase.from("items").delete().eq("id", confirmDeleteId);

    if (error) {
      console.error("Error deleting item:", error);
      showToast("Failed to delete item", "error");
      setConfirmDeleteId(null);
      return;
    }

    setItems(items.filter((item) => item.id !== confirmDeleteId));
    showToast("Item deleted", "success");
    setConfirmDeleteId(null);
  }

  async function handleAdd(
  name: string,
  quantity: number,
  storageLocation: string,
  sku: string,
  category: string,
  assignedTo: string
) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  const { data, error } = await supabase
    .from("items")
    .insert([
      {
        name,
        quantity,
        storage_location: storageLocation,
        sku,
        category,
        assigned_to: assignedTo,
        user_id: userId,
      },
    ])
    .select();

  if (error) {
    console.error("Error adding item:", error);
    showToast("Failed to add item", "error");
    return;
  }

  if (data) {
    setItems([...items, data[0]]);
    showToast("Item added successfully", "success");
  }
}

  async function handleUpdate(
  id: number,
  name: string,
  quantity: number,
  storageLocation: string,
  sku: string,
  category: string,
  assignedTo: string
) {
  const { data, error } = await supabase
    .from("items")
    .update({
      name,
      quantity,
      storage_location: storageLocation,
      sku,
      category,
      assigned_to: assignedTo,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating item:", error);
    showToast("Failed to update item", "error");
    return;
  }

  if (data) {
    setItems(items.map((item) => (item.id === id ? data[0] : item)));
    showToast("Item updated successfully", "success");
  }
}

  async function handleBulkDelete() {
    const { error } = await supabase.from("items").delete().in("id", selectedIds);

    if (error) {
      console.error("Error deleting items:", error);
      showToast("Failed to delete items", "error");
      return;
    }

    setItems(items.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    showToast("Items deleted", "success");
  }

  function toggleSelect(id: number) {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  }

  function toggleSelectAll() {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((item) => item.id));
    }
  }

  const totalItems = items.length;
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockCount = items.filter((item) => item.quantity < 10).length;

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <StatsBar totalItems={totalItems} totalUnits={totalUnits} lowStockCount={lowStockCount} />
      <AddItemForm onAdd={handleAdd} />

      {selectedIds.length > 0 && (
        <button className="btn-bulk-delete" onClick={handleBulkDelete}>
          Delete Selected ({selectedIds.length})
        </button>
      )}

      <div className="item-list">
        <div className="item-list__header">
  <input
    type="checkbox"
    checked={selectedIds.length === filteredItems.length && filteredItems.length > 0}
    onChange={toggleSelectAll}
  />
  <span>Item Name</span>
  <span>SKU</span>
  <span>Quantity</span>
  <span>Category</span>
  <span>Location</span>
  <span>Assigned To</span>
  <span>Last Updated</span>
  <span>Status</span>
  <span></span>
</div>

        {loading ? (
  <div className="loading-state">Loading inventory...</div>
) : filteredItems.length === 0 ? (
  <div className="empty-state">
    <span className="empty-state__icon">📦</span>
    <p>No items found</p>
    <span className="empty-state__hint">
      {searchQuery ? "Try a different search term" : "Add your first item to get started"}
    </span>
  </div>
) : (
  filteredItems.map((item) => (
    <InventoryItem
      key={item.id}
      name={item.name}
      quantity={item.quantity}
      storageLocation={item.storage_location}
      updatedAt={item.updated_at}
      sku={item.sku}
      category={item.category}
      assignedTo={item.assigned_to}
      onDelete={() => setConfirmDeleteId(item.id)}
      id={item.id}
      onUpdate={handleUpdate}
      isSelected={selectedIds.includes(item.id)}
      onToggleSelect={() => toggleSelect(item.id)}
    />
  ))
)}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {confirmDeleteId !== null && (
        <ConfirmModal
          message="Are you sure you want to delete this item?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}