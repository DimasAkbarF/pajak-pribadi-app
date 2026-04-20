import mongoose, { Schema, Document } from "mongoose";
import { TaxModule, TaxBreakdown, StatusPajak } from "@/types";

export interface ISimulation extends Document {
  module: TaxModule;
  input: {
    penghasilanBruto?: number;
    omsetTahunan?: number;
    statusPajak?: StatusPajak;
    penghasilanIstri?: number;
    pengeluaranOperasional?: number;
    kota?: string;
    jenisProfesi?: string;
    normaPersen?: number;
    pph21Dibayar?: number;
    pph22Dibayar?: number;
    pph23Dibayar?: number;
    pph25Dibayar?: number;
  };
  result: TaxBreakdown;
  createdAt: Date;
}

const SimulationSchema = new Schema<ISimulation>(
  {
    module: {
      type: String,
      enum: ["karyawan", "umkm", "norma", "profesi"],
      required: true,
    },
    input: {
      type: {
        penghasilanBruto: { type: Number, default: 0 },
        omsetTahunan: { type: Number, default: 0 },
        statusPajak: { type: String, default: "TK/0" },
        penghasilanIstri: { type: Number, default: 0 },
        pengeluaranOperasional: { type: Number, default: 0 },
        kota: { type: String, default: "" },
        jenisProfesi: { type: String, default: "" },
        normaPersen: { type: Number, default: 0 },
        pph21Dibayar: { type: Number, default: 0 },
        pph22Dibayar: { type: Number, default: 0 },
        pph23Dibayar: { type: Number, default: 0 },
        pph25Dibayar: { type: Number, default: 0 },
      },
      required: true,
      _id: false,
    },
    result: {
      type: {
        totalTax: { type: Number, required: true },
        status: { type: String, required: true },
      },
      required: true,
      _id: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Simulation ||
  mongoose.model<ISimulation>("Simulation", SimulationSchema);
