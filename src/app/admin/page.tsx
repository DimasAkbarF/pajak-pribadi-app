"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, Pencil, BarChart2, Activity, Users } from "lucide-react";
import { formatRupiah } from "@/lib/tax-engine";
import { TaxModule } from "@/types";

interface Simulation {
  _id: string;
  module: TaxModule;
  result: {
    totalTax: number;
    status: string;
  };
  createdAt: string;
}

export default function AdminPage() {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; data: Simulation | null }>({ open: false, data: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [editForm, setEditForm] = useState<{ module: string; totalTax: number; status: string }>({ module: "", totalTax: 0, status: "" });

  useEffect(() => {
    fetchSimulations();
  }, []);

  const fetchSimulations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/simulations");
      const data = await response.json();
      if (data.success) {
        setSimulations(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch simulations", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (simulation: Simulation) => {
    setEditModal({ open: true, data: simulation });
    setEditForm({ module: simulation.module, totalTax: simulation.result.totalTax, status: simulation.result.status });
  };

  const saveEdit = async () => {
    if (!editModal.data) return;
    try {
      const id = editModal.data._id;
      const response = await fetch(`/api/simulations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: editForm.module, result: { totalTax: Number(editForm.totalTax), status: editForm.status } }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchSimulations();
        setEditModal({ open: false, data: null });
      } else {
        console.error("Update failed", data);
      }
    } catch (error) {
      console.error("Failed to update simulation", error);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteModal({ open: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      const response = await fetch(`/api/simulations/${deleteModal.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        await fetchSimulations();
        setDeleteModal({ open: false, id: null });
      } else {
        console.error("Delete failed", data);
      }
    } catch (error) {
      console.error("Failed to delete simulation", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-inter p-6">
      <nav className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/dashboard" legacyBehavior>
          <a className="border border-white/10 hover:bg-white/5 text-zinc-300 text-sm px-4 py-2 rounded-lg transition-all">
            back to calculator
          </a>
        </Link>
      </nav>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white/[0.03] backdrop-blur-xl rounded-2xl shadow-inner flex flex-col items-center">
          <BarChart2 className="text-indigo-600 w-8 h-8 mb-4" />
          <h2 className="text-xl font-semibold">Total Data</h2>
          <p className="text-3xl font-bold">{simulations.length}</p>
        </div>
        <div className="p-6 bg-white/[0.03] backdrop-blur-xl rounded-2xl shadow-inner flex flex-col items-center">
          <Activity className="text-indigo-600 w-8 h-8 mb-4" />
          <h2 className="text-xl font-semibold">Total Revenue Tax</h2>
          <p className="text-3xl font-bold">
            {formatRupiah(
              simulations.reduce((sum, sim) => sum + sim.result.totalTax, 0)
            )}
          </p>
        </div>
        <div className="p-6 bg-white/[0.03] backdrop-blur-xl rounded-2xl shadow-inner flex flex-col items-center">
          <Users className="text-indigo-600 w-8 h-8 mb-4" />
          <h2 className="text-xl font-semibold">User Active</h2>
          <p className="text-3xl font-bold">
            {simulations.filter((sim) => sim.result.status === "active").length}
          </p>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-white/5 bg-white/[0.03] backdrop-blur-xl rounded-xl">
          <thead className="sticky top-0 bg-white/5 text-xs font-semibold uppercase tracking-widest">
            <tr>
              <th className="p-4 border border-white/5">Module</th>
              <th className="p-4 border border-white/5">Total Tax</th>
              <th className="p-4 border border-white/5">Status</th>
              <th className="p-4 border border-white/5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {simulations.map((sim) => (
              <tr
                key={sim._id}
                className="hover:bg-white/5 transition duration-200"
              >
                <td className="p-4 border border-white/5">{sim.module}</td>
                <td className="p-4 border border-white/5">
                  {formatRupiah(sim.result.totalTax)}
                </td>
                <td className="p-4 border border-white/5">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      sim.result.status === "active"
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}
                  >
                    {sim.result.status}
                  </span>
                </td>
                <td className="p-4 border border-white/5 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(sim);
                    }}
                    className="text-indigo-400 border border-indigo-500/10 hover:bg-white/5 p-2 rounded-lg"
                  >
                    <Pencil />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(sim._id);
                    }}
                    className="text-red-400 border border-red-500/10 hover:bg-white/5 p-2 rounded-lg"
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editModal.open && editModal.data && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-full max-w-lg bg-[#0f172a] border border-white/10 p-6 rounded-2xl text-zinc-400">
            <h2 className="text-xl font-bold text-white mb-4">Edit Simulation</h2>

            <label className="block text-sm text-zinc-300 mb-1">Module</label>
            <input
              value={editForm.module}
              onChange={(e) => setEditForm((s) => ({ ...s, module: e.target.value }))}
              className="w-full bg-transparent border border-white/10 rounded px-3 py-2 text-white mb-3"
            />

            <label className="block text-sm text-zinc-300 mb-1">Total Tax</label>
            <input
              type="number"
              value={editForm.totalTax}
              onChange={(e) => setEditForm((s) => ({ ...s, totalTax: Number(e.target.value) }))}
              className="w-full bg-transparent border border-white/10 rounded px-3 py-2 text-white mb-3"
            />

            <label className="block text-sm text-zinc-300 mb-1">Status</label>
            <input
              value={editForm.status}
              onChange={(e) => setEditForm((s) => ({ ...s, status: e.target.value }))}
              className="w-full bg-transparent border border-white/10 rounded px-3 py-2 text-white"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditModal({ open: false, data: null })}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-[#0f172a] border border-white/10 p-6 rounded-2xl text-zinc-400">
            <h2 className="text-xl font-bold text-white mb-2">Confirm Delete</h2>
            <p className="text-zinc-400">Apakah Anda yakin ingin menghapus data ini?</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteModal({ open: false, id: null })}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
