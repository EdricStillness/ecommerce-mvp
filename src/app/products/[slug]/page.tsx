import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: { orderBy: { sort: "asc" } } },
  });

  if (!product) return notFound();

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <img
          src={product.images[0]?.url || "https://picsum.photos/seed/placeholder/800/600"}
          alt={product.name}
          className="w-full rounded-xl bg-white shadow"
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-lg mt-2">${product.price.toString()}</p>
        <p className="text-sm text-gray-600 mt-2">{product.description}</p>

        <form action={async () => {
          "use server";
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: product.id, qty: 1 }),
          });
        }}>
          <button
            className="mt-6 px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50"
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? "Add to Cart" : "Out of stock"}
          </button>
        </form>
      </div>
    </div>
  );
}
