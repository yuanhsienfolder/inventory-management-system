import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import "./PurchaseOrders.scss";

type POItem = {
  name: string;
  quantity: number;
};

type PurchaseOrder = {
  id: number;
  order_number: string;
  supplier_name: string;
  status: "draft" | "pending" | "approved" | "completed";
  items: POItem[];
  expected_delivery: string | null;
  notes: string;
  created_at: string;
};

type Supplier = {
  id: number;
  name: string;
};

export default function PurchaseOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchSuppliers();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from("purchase_orders")
      .select()
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
      return;
    }

    setOrders(data ?? []);
    setLoading(false);
  }

  async function fetchSuppliers() {
    const { data } = await supabase.from("suppliers").select("id, name");
    setSuppliers(data ?? []);
  }

  function generateOrderNumber() {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `PO-${random}`;
  }

  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [expectedDelivery, setExpectedDelivery] = useState("");
  const [notes, setNotes] = useState("");
  const [poItems, setPoItems] = useState<POItem[]>([{ name: "", quantity: 1 }]);

  function resetForm() {
    setSelectedSupplierId("");
    setExpectedDelivery("");
    setNotes("");
    setPoItems([{ name: "", quantity: 1 }]);
    setShowModal(false);
  }

  function addLineItem() {
    setPoItems([...poItems, { name: "", quantity: 1 }]);
  }

  function updateLineItem(index: number, field: "name" | "quantity", value: string) {
    const updated = [...poItems];
    if (field === "quantity") {
      updated[index].quantity = Number(value);
    } else {
      updated[index].name = value;
    }
    setPoItems(updated);
  }

  function removeLineItem(index: number) {
    setPoItems(poItems.filter((_, i) => i !== index));
  }

  async function handleCreateOrder(e: React.FormEvent) {
    e.preventDefault();

    const supplier = suppliers.find((s) => s.id === Number(selectedSupplierId));
    if (!supplier) return;

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    const { data, error } = await supabase
      .from("purchase_orders")
      .insert([
        {
          order_number: generateOrderNumber(),
          supplier_id: supplier.id,
          supplier_name: supplier.name,
          status: "draft",
          items: poItems.filter((item) => item.name.trim()),
          expected_delivery: expectedDelivery || null,
          notes,
          user_id: userId,
        },
      ])
      .select();

    if (error) {
      console.error("Error creating order:", error);
      return;
    }

    if (data) {
      setOrders([data[0], ...orders]);
    }

    resetForm();
  }

  async function updateStatus(id: number, newStatus: string) {
    const { data, error } = await supabase
      .from("purchase_orders")
      .update({ status: newStatus })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating status:", error);
      return;
    }

    if (data) {
      setOrders(orders.map((o) => (o.id === id ? data[0] : o)));
    }
  }

  async function handleDeleteOrder(id: number) {
    const { error } = await supabase.from("purchase_orders").delete().eq("id", id);

    if (error) {
      console.error("Error deleting order:", error);
      return;
    }

    setOrders(orders.filter((o) => o.id !== id));
  }

  const statusOptions = ["draft", "pending", "approved", "completed"];

  return (
    <div className="purchase-orders">
      <div className="purchase-orders__header">
        <div>
          <h2>Purchase Orders</h2>
          <p>{orders.length} orders</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + New PO
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__icon">📄</span>
          <p>No purchase orders yet</p>
        </div>
      ) : (
        <div className="po-list">
          {orders.map((order) => (
            <div key={order.id} className="po-card">
              <div className="po-card__top">
                <span className="po-card__number">{order.order_number}</span>
                <select
                  className={`po-status po-status--${order.status}`}
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="po-card__supplier">{order.supplier_name}</div>
              <ul className="po-card__items">
                {order.items.map((item, i) => (
                  <li key={i}>{item.name} × {item.quantity}</li>
                ))}
              </ul>
              {order.expected_delivery && (
                <div className="po-card__delivery">
                  Expected: {new Date(order.expected_delivery).toLocaleDateString()}
                </div>
              )}
              <button className="po-card__delete" onClick={() => handleDeleteOrder(order.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-box po-modal" onClick={(e) => e.stopPropagation()}>
            <div className="po-modal__header">
              <h3>New Purchase Order</h3>
              <button onClick={resetForm}>✕</button>
            </div>

            <form onSubmit={handleCreateOrder}>
              <label>
                Supplier
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  required
                >
                  <option value="">Select supplier</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </label>

              <label>
                Expected Delivery
                <input
                  type="date"
                  value={expectedDelivery}
                  onChange={(e) => setExpectedDelivery(e.target.value)}
                />
              </label>

              <div className="po-modal__items">
                <span className="po-modal__items-label">Items</span>
                {poItems.map((item, index) => (
                  <div className="po-modal__line" key={index}>
                    <input
                      type="text"
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) => updateLineItem(index, "name", e.target.value)}
                    />
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateLineItem(index, "quantity", e.target.value)}
                    />
                    <button type="button" onClick={() => removeLineItem(index)}>✕</button>
                  </div>
                ))}
                <button type="button" className="btn-add-line" onClick={addLineItem}>
                  + Add item
                </button>
              </div>

              <label>
                Notes
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
              </label>

              <div className="po-modal__actions">
                <button type="button" className="btn-cancel" onClick={resetForm}>Cancel</button>
                <button type="submit" className="btn-primary">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}