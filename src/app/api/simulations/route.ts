import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Simulation from "@/models/Simulation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await dbConnect();
    const simulations = await Simulation.find().sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ success: true, data: simulations });
  } catch (error) {
    console.error("GET /api/simulations error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch simulations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { module, input, result } = body;

    if (!module || !input || !result) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();
    const simulation = await Simulation.create({
      module,
      input,
      result,
    });

    return NextResponse.json({ success: true, data: simulation }, { status: 201 });
  } catch (error) {
    console.error("POST /api/simulations error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create simulation",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing simulation ID" },
        { status: 400 }
      );
    }

    await dbConnect();
    const updatedSimulation = await Simulation.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedSimulation) {
      return NextResponse.json(
        { success: false, error: "Simulation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedSimulation });
  } catch (error) {
    console.error("PUT /api/simulations error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update simulation" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing simulation ID" },
        { status: 400 }
      );
    }

    await dbConnect();
    const deletedSimulation = await Simulation.findByIdAndDelete(id);

    if (!deletedSimulation) {
      return NextResponse.json(
        { success: false, error: "Simulation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deletedSimulation });
  } catch (error) {
    console.error("DELETE /api/simulations error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete simulation" },
      { status: 500 }
    );
  }
}
