import { useState, useEffect } from "react";
import InventoryItem from "./InventoryItem";
import AddItemForm from "./AddItemForm";
import { supabase } from "../lib/supabase";
import StatsBar from "./StatsBar";
import "./InventoryList.scss";

type Item = {
  id: number;
  name: string;
  quantity: number;
  storage_location: string;
  updated_at: string;
};

export default function InventoryList() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data, error } = await supabase.from("items").select();

    if (error) {
      console.error("Error fetching items:", error);
      return;
    }

    setItems(data ?? []);
  }

  async function handleDelete(id: number) {
    const { error } = await supabase.from("items").delete().eq("id", id);

    if (error) {
      console.error("Error deleting item:", error);
      return;
    }

    setItems(items.filter((item) => item.id !== id));
  }

  async function handleAdd(name: string, quantity: number, storageLocation: string) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  const { data, error } = await supabase
    .from("items")
    .insert([{ name, quantity, storage_location: storageLocation, user_id: userId }])
    .select();

  if (error) {
    console.error("Error adding item:", error);
    return;
  }

  if (data) {
    setItems([...items, data[0]]);
  }
}

  const totalItems = items.length;
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockCount = items.filter((item) => item.quantity < 10).length;

  return (
    <div>
      <StatsBar totalItems={totalItems} totalUnits={totalUnits} lowStockCount={lowStockCount} />
      <AddItemForm onAdd={handleAdd} />
      <div className="item-list">
        <div className="item-list__header">
          <span></span>
          <span>Item Name</span>
          <span>Quantity</span>
          <span>Location</span>
          <span>Last Updated</span>
          <span>Status</span>
          <span></span>
        </div>
        {items.map((item) => (
          <InventoryItem
            key={item.id}
            name={item.name}
            quantity={item.quantity}
            storageLocation={item.storage_location}
            updatedAt={item.updated_at}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </div>
    </div>
  );
}