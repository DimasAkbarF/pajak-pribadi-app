import mongoose, { Schema, Document } from "mongoose";
import { TaxModule, TaxBreakdown } from "@/types";

export interface ISimulation extends Document {
  module: TaxModule;
  input: {
    bulan?: string;
    omzetBulanIni?: number;
    totalOmzet?: number;
    omsetTahunan?: number;
  };
  result: TaxBreakdown;
  createdAt: Date;
}

const SimulationSchema = new Schema<ISimulation>(
  {
    module: {
      type: String,
      enum: ["umkm"],
      required: true,
    },
    input: {
      type: {
        bulan: { type: String, default: "Januari" },
        omzetBulanIni: { type: Number, default: 0 },
        totalOmzet: { type: Number, default: 0 },
        omsetTahunan: { type: Number, default: 0 },
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
