import { useState, useEffect } from "react";
import InventoryItem from "./InventoryItem";
import AddItemForm from "./AddItemForm";
import { supabase } from "../lib/supabase";

type Item = {
  id: number;
  name: string;
  quantity: number;
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
  const { error } = await supabase
    .from("items")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting item:", error);
    return;
  }

  setItems(items.filter((item) => item.id !== id));
}

  async function handleAdd(name: string, quantity: number) {
  const { data, error } = await supabase
    .from("items")
    .insert([{ name, quantity }])
    .select();

  if (error) {
    console.error("Error adding item:", error);
    return;
  }

  if (data) {
    setItems([...items, data[0]]);
  }

}

  return (
    <div>
      <AddItemForm onAdd={handleAdd} />
      {items.map((item) => (
        <InventoryItem
          key={item.id}
          name={item.name}
          quantity={item.quantity}
          onDelete={() => handleDelete(item.id)}
        />
      ))}
    </div>
  );
}