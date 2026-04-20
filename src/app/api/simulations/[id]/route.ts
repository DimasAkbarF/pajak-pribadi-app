import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Simulation from "@/models/Simulation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const sim = await Simulation.findById(params.id);
    if (!sim) {
      return NextResponse.json({ success: false, error: "Simulation not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: sim });
  } catch (error) {
    console.error("GET /api/simulations/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch simulation" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updateData = body;

    await dbConnect();
    const updatedSimulation = await Simulation.findByIdAndUpdate(params.id, updateData, { new: true });

    if (!updatedSimulation) {
      return NextResponse.json({ success: false, error: "Simulation not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedSimulation });
  } catch (error) {
    console.error("PUT /api/simulations/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update simulation" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const deletedSimulation = await Simulation.findByIdAndDelete(params.id);

    if (!deletedSimulation) {
      return NextResponse.json({ success: false, error: "Simulation not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: deletedSimulation });
  } catch (error) {
    console.error("DELETE /api/simulations/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete simulation" }, { status: 500 });
  }
}
