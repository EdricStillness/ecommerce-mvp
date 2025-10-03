import { NextResponse } from "next/server";
import { productService } from "@/server/services/product.service";

export async function GET() {
  const products = await productService.list();
  return NextResponse.json({ products });
}
