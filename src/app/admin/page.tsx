"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, Pencil, BarChart2, Activity, Users, Store, ArrowLeft } from "lucide-react";
import { formatRupiah } from "@/lib/tax-engine";

interface Simulation {
  _id: string;
  module: string;
  input: {
    bulan?: string;
    omzetBulanIni?: number;
    totalOmzet?: number;
  };
  result: {
    totalTax: number;
    status: string;
    umkmDetail?: {
      bulan: string;
      omzetBulanIni: number;
      kumulatifOmzet: number;
      bebasPPh: number;
      omzetKenaPajakBulan: number;
      tarifPPh: number;
      pphSetorBulan: number;
      totalPPhKumulatif: number;
    };
  };
  createdAt: string;
}

export default function AdminPage() {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; data: Simulation | null }>({ open: false, data: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  
  // Edit Form States (strictly UMKM parameters)
  const [editForm, setEditForm] = useState({ 
    id: "",
    bulan: "Januari", 
    omzetBulanIni: 0, 
    totalOmzet: 0 
  });

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
    setEditForm({ 
      id: simulation._id,
      bulan: simulation.input.bulan || "Januari", 
      omzetBulanIni: simulation.input.omzetBulanIni || 0,
      totalOmzet: simulation.input.totalOmzet || 0
    });
  };

  const saveEdit = async () => {
    if (!editForm.id) return;
    try {
      // Calculate new tax values locally to ensure consistencies
      const BEBAS_THRESHOLD = 500_000_000;
      const TARIF = 0.005;
      
      const bebasPPh = Math.min(editForm.totalOmzet, BEBAS_THRESHOLD);
      const omzetKenaPajakTotal = Math.max(0, editForm.totalOmzet - BEBAS_THRESHOLD);
      const totalPPhKumulatif = Math.floor(omzetKenaPajakTotal * TARIF);
      
      const kumulatifSebelumBulanIni = editForm.totalOmzet - editForm.omzetBulanIni;
      let omzetKenaPajakBulan = 0;
      
      if (editForm.totalOmzet <= BEBAS_THRESHOLD) {
        omzetKenaPajakBulan = 0;
      } else if (kumulatifSebelumBulanIni >= BEBAS_THRESHOLD) {
        omzetKenaPajakBulan = editForm.omzetBulanIni;
      } else {
        omzetKenaPajakBulan = editForm.totalOmzet - BEBAS_THRESHOLD;
      }
      
      const pphSetorBulan = Math.floor(omzetKenaPajakBulan * TARIF);
      const isBebas = editForm.totalOmzet <= BEBAS_THRESHOLD;

      const updatedData = {
        id: editForm.id,
        module: "umkm",
        input: {
          bulan: editForm.bulan,
          omzetBulanIni: editForm.omzetBulanIni,
          totalOmzet: editForm.totalOmzet,
          omsetTahunan: editForm.totalOmzet
        },
        result: {
          penghasilanBruto: editForm.totalOmzet,
          biayaJabatan: 0,
          pengeluaranNorma: 0,
          pengeluaranOperasional: 0,
          penghasilanNeto: editForm.totalOmzet,
          ptkp: 0,
          pkp: 0,
          pkpRounded: 0,
          progressiveTax: 0,
          umkmTax: totalPPhKumulatif,
          kreditPajak: { pph21: 0, pph22: 0, pph23: 0, pph25: 0, total: 0 },
          totalTax: totalPPhKumulatif,
          status: isBebas ? "Nihil" : "Kurang Bayar",
          kurangBayar: isBebas ? 0 : pphSetorBulan,
          umkmDetail: {
            bulan: editForm.bulan,
            omzetBulanIni: editForm.omzetBulanIni,
            kumulatifOmzet: editForm.totalOmzet,
            bebasPPh,
            omzetKenaPajakBulan,
            tarifPPh: 0.5,
            pphSetorBulan,
            totalPPhKumulatif,
          }
        }
      };

      const response = await fetch(`/api/simulations/${editForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
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

  // Calculate sum totals
  const totalSimulations = simulations.length;
  const totalTaxRevenue = simulations.reduce((sum, sim) => {
    const pph = sim.result.umkmDetail?.pphSetorBulan ?? sim.result.totalTax;
    return sum + pph;
  }, 0);
  const totalOmzetProcessed = simulations.reduce((sum, sim) => sum + (sim.input.omzetBulanIni || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-inter p-6 md:p-12 relative">
      {/* Background Mesh */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-[10%] w-[70%] h-[70%] rounded-full opacity-10 blur-[120px]" style={{ background: "radial-gradient(circle, #1e3a8a 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 -right-[10%] w-[60%] h-[60%] rounded-full opacity-10 blur-[120px]" style={{ background: "radial-gradient(circle, #1e3b8a 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        <nav className="flex justify-between items-center pb-6 border-b border-white/5">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Admin Dashboard UMKM</h1>
            <p className="text-slate-400 text-xs mt-1">Kelola data rekam simulasi pajak pelaku usaha binaan</p>
          </div>
          <Link href="/dashboard" className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold text-slate-300 border border-white/10 hover:bg-white/5 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
        </nav>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white/[0.01] border border-white/5 backdrop-blur-md rounded-3xl shadow-xl flex items-center gap-5">
            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Simulasi UMKM</p>
              <p className="text-2xl font-black text-white mt-1">{totalSimulations}</p>
            </div>
          </div>
          <div className="p-6 bg-white/[0.01] border border-white/5 backdrop-blur-md rounded-3xl shadow-xl flex items-center gap-5">
            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Omzet Terkalkulasi</p>
              <p className="text-2xl font-black text-white mt-1">{formatRupiah(totalOmzetProcessed)}</p>
            </div>
          </div>
          <div className="p-6 bg-white/[0.01] border border-white/5 backdrop-blur-md rounded-3xl shadow-xl flex items-center gap-5">
            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Potensi Setoran Pajak</p>
              <p className="text-2xl font-black text-blue-400 mt-1">{formatRupiah(totalTaxRevenue)}</p>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white/[0.01] border border-white/5 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md">
          <div className="p-5 border-b border-white/5 bg-white/[0.005]">
            <h3 className="font-bold text-base text-white">Log Histori Simulasi Pajak</h3>
          </div>
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">Memuat data...</div>
          ) : simulations.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">Belum ada data simulasi yang tersimpan.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <th className="p-4 pl-6">Masa Pajak</th>
                    <th className="p-4">Omzet Bulan Ini</th>
                    <th className="p-4">Kumulatif Omzet</th>
                    <th className="p-4">PPh Harus Setor</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 pr-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {simulations.map((sim) => {
                    const pphSetor = sim.result.umkmDetail?.pphSetorBulan ?? sim.result.totalTax;
                    const isNihil = pphSetor === 0;
                    return (
                      <tr key={sim._id} className="hover:bg-white/[0.01] transition duration-200">
                        <td className="p-4 pl-6 font-bold text-white">Masa {sim.input.bulan || "Januari"}</td>
                        <td className="p-4 text-slate-300 font-medium">{formatRupiah(sim.input.omzetBulanIni || 0)}</td>
                        <td className="p-4 text-slate-300 font-medium">{formatRupiah(sim.input.totalOmzet || 0)}</td>
                        <td className="p-4 font-bold text-blue-400">{formatRupiah(pphSetor)}</td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-bold tracking-wide border uppercase ${
                            isNihil
                              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          }`}>
                            {isNihil ? "Nihil" : "Wajib Setor"}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="inline-flex gap-2">
                            <button onClick={() => handleEdit(sim)} className="text-slate-400 border border-slate-800 hover:border-blue-500/30 hover:text-blue-400 p-2 rounded-xl transition-all">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDelete(sim._id)} className="text-slate-400 border border-slate-800 hover:border-red-500/30 hover:text-red-400 p-2 rounded-xl transition-all">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editModal.open && editModal.data && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-lg bg-slate-900 border border-white/10 p-6 md:p-8 rounded-3xl text-zinc-400 shadow-2xl">
              <h2 className="text-lg font-bold text-white mb-6">Edit Simulasi Pajak UMKM</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-2">Bulan Pajak</label>
                  <select
                    value={editForm.bulan}
                    onChange={(e) => setEditForm((s) => ({ ...s, bulan: e.target.value }))}
                    className="w-full bg-[#071120] border border-slate-800 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  >
                    {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-2">Omzet Bulan Ini (Rp)</label>
                  <input
                    type="number"
                    value={editForm.omzetBulanIni}
                    onChange={(e) => setEditForm((s) => ({ ...s, omzetBulanIni: Number(e.target.value) }))}
                    className="w-full bg-[#071120] border border-slate-800 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                    placeholder="Rp0"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-2">Total Omzet Kumulatif s.d. Bulan Ini (Rp)</label>
                  <input
                    type="number"
                    value={editForm.totalOmzet}
                    onChange={(e) => setEditForm((s) => ({ ...s, totalOmzet: Number(e.target.value) }))}
                    className="w-full bg-[#071120] border border-slate-800 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                    placeholder="Rp0"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setEditModal({ open: false, data: null })}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl px-5 py-3 text-xs font-semibold transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={saveEdit}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl px-5 py-3 text-xs transition-all shadow-md shadow-blue-500/15"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.open && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md bg-slate-900 border border-white/10 p-6 md:p-8 rounded-3xl text-zinc-400 shadow-2xl">
              <h2 className="text-base font-bold text-white mb-2">Konfirmasi Hapus</h2>
              <p className="text-slate-400 text-xs leading-relaxed">Apakah Anda yakin ingin menghapus data simulasi UMKM ini dari database histori?</p>
              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModal({ open: false, id: null })}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl px-5 py-3 text-xs font-semibold transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl px-5 py-3 text-xs transition-all"
                >
                  Hapus Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
