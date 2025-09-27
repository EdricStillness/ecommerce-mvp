import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const products = await prisma.product.findMany({
    include: { images: { orderBy: { sort: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.slug}`}
            className="group bg-white rounded-xl shadow p-3 hover:shadow-md transition"
          >
            <img
              src={p.images[0]?.url || "https://picsum.photos/seed/placeholder/600/400"}
              alt={p.name}
              className="aspect-[3/2] w-full object-cover rounded-lg"
            />
            <div className="mt-3">
              <h3 className="font-medium group-hover:underline">{p.name}</h3>
              <p className="text-sm text-gray-600">${p.price.toString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
