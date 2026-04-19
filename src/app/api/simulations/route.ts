import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Simulation from "@/models/Simulation";

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
      { success: false, error: "Failed to create simulation" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    await dbConnect();

    if (id) {
      await Simulation.findByIdAndDelete(id);
      return NextResponse.json({ success: true, message: "Deleted" });
    } else {
      await Simulation.deleteMany({});
      return NextResponse.json({ success: true, message: "All deleted" });
    }
  } catch (error) {
    console.error("DELETE /api/simulations error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete" },
      { status: 500 }
    );
  }
}
