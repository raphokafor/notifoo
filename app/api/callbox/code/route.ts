import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { name, phone } = await request.json();
  console.log("name", name);
  console.log("phone", phone);
  return NextResponse.json({ message: "Call box created successfully" });
}
