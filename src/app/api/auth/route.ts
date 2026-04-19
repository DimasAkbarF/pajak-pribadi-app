import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin1";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (username !== ADMIN_USER) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = password === ADMIN_PASS || await bcrypt.compare(password, await bcrypt.hash(ADMIN_PASS, 10));
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { username: ADMIN_USER, role: "admin" },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: "24h" }
    );

    return NextResponse.json({
      success: true,
      data: { token, username: ADMIN_USER },
    });
  } catch (error) {
    console.error("POST /api/auth error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
