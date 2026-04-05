"use client";

import { useState, useEffect, useCallback } from "react";

const BASE = "/api/assignments";

type Status = "Create" | "On Process" | "Submitted";

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: Status;
  createdAt: string;
}

export default function Home() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "", status: "Create" as Status });

  const load = useCallback(async () => {
    try {
      const res = await fetch(BASE);
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setAssignments(json.data);
      setError("");
    } catch {
      setError("Could not load assignments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ title: "", description: "", dueDate: "", status: "Create" });
    setModal(true);
  };

  const openEdit = (a: Assignment) => {
    setEditingId(a.id);
    setForm({ title: a.title, description: a.description, dueDate: a.dueDate?.split("T")[0] ?? "", status: a.status as Status });
    setModal(true);
  };

  const save = async () => {
    if (!form.title || !form.description || !form.dueDate) {
      showToast("Title, description and due date are required");
      return;
    }
    try {
      const res = editingId
        ? await fetch(`${BASE}/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
        : await fetch(BASE, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setModal(false);
      showToast(editingId ? "Assignment updated" : "Assignment created");
      load();
    } catch (e: unknown) {
      showToast("Failed to save: " + (e instanceof Error ? e.message : "unknown error"));
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this assignment?")) return;
    try {
      const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      showToast("Deleted");
      load();
    } catch {
      showToast("Failed to delete");
    }
  };

  const badgeClass: Record<Status, string> = {
    Create: "bg-blue-50 text-blue-800",
    "On Process": "bg-amber-50 text-amber-800",
    Submitted: "bg-green-50 text-green-800",
  };

  const filtered = filter ? assignments.filter(a => a.status === filter) : assignments;

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-gray-900">Assignment log book</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and track all your assignments</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {[["Total", assignments.length], ["In progress", assignments.filter(a => a.status === "On Process").length], ["Submitted", assignments.filter(a => a.status === "Submitted").length]].map(([label, val]) => (
          <div key={label} className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-1">{label}</div>
            <div className="text-2xl font-medium">{val}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-6 items-center">
        <select value={filter} onChange={e => setFilter(e.target.value)} className="h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white">
          <option value="">All statuses</option>
          <option>Create</option>
          <option>On Process</option>
          <option>Submitted</option>
        </select>
        <div className="flex-1" />
        <button onClick={openCreate} className="h-9 px-4 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700">
          + New assignment
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
      {loading && <div className="text-center text-sm text-gray-400 py-10">Loading...</div>}

      <div className="flex flex-col gap-2">
        {!loading && filtered.length === 0 && <div className="text-center text-sm text-gray-400 py-10">No assignments. Create one to get started.</div>}
        {filtered.map(a => (
          <div key={a.id} className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">{a.title}</div>
              <div className="text-xs text-gray-400 mt-0.5">Due {a.dueDate} · {a.description}</div>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badgeClass[a.status as Status]}`}>{a.status}</span>
            <button onClick={() => openEdit(a)} className="w-8 h-8 flex items-center justify-center text-gray-400 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">✎</button>
            <button onClick={() => del(a.id)} className="w-8 h-8 flex items-center justify-center text-gray-400 border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-sm">✕</button>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setModal(false)}>
          <div className="bg-white rounded-xl border border-gray-100 p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-medium mb-5">{editingId ? "Edit assignment" : "New assignment"}</h2>
            {(["title", "description", "dueDate"] as const).map(field => (
              <div key={field} className="mb-4">
                <label className="block text-xs text-gray-500 mb-1.5 capitalize">{field === "dueDate" ? "Due date" : field}</label>
                {field === "description"
                  ? <textarea value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm h-20 resize-none" />
                  : <input type={field === "dueDate" ? "date" : "text"} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 h-9 text-sm" />}
              </div>
            ))}
            <div className="mb-5">
              <label className="block text-xs text-gray-500 mb-1.5">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Status }))} className="w-full border border-gray-200 rounded-lg px-3 h-9 text-sm bg-white">
                <option>Create</option><option>On Process</option><option>Submitted</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setModal(false)} className="h-9 px-4 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={save} className="h-9 px-4 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700">Save</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-lg">{toast}</div>}
    </main>
  );
}
