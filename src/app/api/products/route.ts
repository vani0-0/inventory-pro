import { data } from "@/data/sample_data";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({ data }, { status: 200 });
}
