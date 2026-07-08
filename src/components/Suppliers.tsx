import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import "./Suppliers.scss";

type Supplier = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
};

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  async function fetchSuppliers() {
    setLoading(true);
    const { data, error } = await supabase.from("suppliers").select();

    if (error) {
      console.error("Error fetching suppliers:", error);
      setLoading(false);
      return;
    }

    setSuppliers(data ?? []);
    setLoading(false);
  }

  function resetForm() {
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setNotes("");
    setEditingId(null);
    setShowModal(false);
  }

  function openAddModal() {
    resetForm();
    setShowModal(true);
  }

  function openEditModal(supplier: Supplier) {
    setName(supplier.name);
    setEmail(supplier.email);
    setPhone(supplier.phone);
    setAddress(supplier.address);
    setNotes(supplier.notes || "");
    setEditingId(supplier.id);
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId !== null) {
      const { data, error } = await supabase
        .from("suppliers")
        .update({ name, email, phone, address, notes })
        .eq("id", editingId)
        .select();

      if (error) {
        console.error("Error updating supplier:", error);
        return;
      }

      if (data) {
        setSuppliers(suppliers.map((s) => (s.id === editingId ? data[0] : s)));
      }
    } else {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      const { data, error } = await supabase
        .from("suppliers")
        .insert([{ name, email, phone, address, notes, user_id: userId }])
        .select();

      if (error) {
        console.error("Error adding supplier:", error);
        return;
      }

      if (data) {
        setSuppliers([...suppliers, data[0]]);
      }
    }

    resetForm();
  }

  async function handleDelete(id: number) {
    const { error } = await supabase.from("suppliers").delete().eq("id", id);

    if (error) {
      console.error("Error deleting supplier:", error);
      return;
    }

    setSuppliers(suppliers.filter((s) => s.id !== id));
  }

  return (
    <div className="suppliers">
      <div className="suppliers__header">
        <div>
          <h2>Suppliers</h2>
          <p>{suppliers.length} suppliers</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          + New Supplier
        </button>
      </div>

      <div className="supplier-list">
        {loading ? (
          <div className="loading-state">Loading suppliers...</div>
        ) : suppliers.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__icon">🚚</span>
            <p>No suppliers yet</p>
            <span className="empty-state__hint">Add your first supplier to get started</span>
          </div>
        ) : (
          suppliers.map((supplier) => (
            <div key={supplier.id} className="supplier-row">
              <div className="supplier-row__name">{supplier.name}</div>
              <div className="supplier-row__contact">
                <span>{supplier.email}</span>
                <span>{supplier.phone}</span>
              </div>
              <div className="supplier-row__address">{supplier.address}</div>
              <div className="supplier-row__actions">
                <button onClick={() => openEditModal(supplier)}>✎</button>
                <button onClick={() => handleDelete(supplier.id)}>🗑</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-box supplier-modal" onClick={(e) => e.stopPropagation()}>
            <div className="supplier-modal__header">
              <h3>{editingId !== null ? "Edit supplier" : "New supplier"}</h3>
              <button className="supplier-modal__close" onClick={resetForm}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                Name
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </label>

              <div className="supplier-modal__row">
                <label>
                  Email
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>
                  Phone
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </label>
              </div>

              <label>
                Address
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
              </label>

              <label>
                Notes
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
              </label>

              <div className="supplier-modal__actions">
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingId !== null ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}