import prisma from "@/lib/prisma";
import { getSessionUserId } from "@/server/utils/session";

async function assertAdmin() {
  const userId = await getSessionUserId();
  if (!userId) return false;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return !!user && user.role === "ADMIN";
}

export default async function AdminProductsPage() {
  const ok = await assertAdmin();
  if (!ok) return <div className="p-6">Forbidden</div>;

  const products = await prisma.product.findMany({ include: { images: { orderBy: { sort: "asc" } } } });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Products</h1>
      <div className="flex items-center gap-3">
        <a href="/admin" className="btn-ghost">← Back</a>
        <a href="/admin/products/new" className="btn">Add product</a>
      </div>
      <div className="grid gap-4">
        {products.map(p => (
          <div key={p.id} className="border rounded p-4 flex items-center gap-4">
            <img src={p.images[0]?.url || "/vercel.svg"} alt={p.name} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1">
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-500">SKU: {p.sku} • ${String(p.price)} • Stock: {p.stock}</div>
            </div>
            <a className="btn-outline" href={`/products/${p.slug}`}>View</a>
          </div>
        ))}
      </div>
    </div>
  );
}
