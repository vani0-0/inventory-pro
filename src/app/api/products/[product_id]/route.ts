import { data } from "@/data/sample_data";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ product_id: string | null }> }
) {
  const { product_id } = await params;
  const product = data.find((item) => item.product_id === product_id);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product, { status: 200 });
}
