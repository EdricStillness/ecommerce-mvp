import prisma from "@/lib/prisma";
import { getSessionUserId } from "@/server/utils/session";
import { AdminCharts } from "@/components/AdminCharts";

export default async function AdminPage() {
  const userId = await getSessionUserId();
  if (!userId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Unauthorized</h1>
        <p className="mt-2">Please sign in to access the dashboard.</p>
      </div>
    );
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Forbidden</h1>
        <p className="mt-2">You don’t have permission to view this page.</p>
      </div>
    );
  }

  const [usersCount, productsCount, ordersCount] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
  ]);

  // Analytics
  const since = new Date();
  since.setDate(since.getDate() - 13); // last 14 days

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: since } },
    include: { items: true },
    orderBy: { createdAt: "asc" },
  });

  // Revenue by day
  const byDayMap = new Map<string, number>();
  for (let i = 0; i < 14; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    byDayMap.set(d.toISOString().slice(0, 10), 0);
  }
  for (const o of orders) {
    const key = o.createdAt.toISOString().slice(0, 10);
    const current = byDayMap.get(key) ?? 0;
    const total = Number(o.totalAmount);
    byDayMap.set(key, current + (o.status === "PAID" ? total : 0));
  }
  const revenueByDay = Array.from(byDayMap.entries()).map(([date, revenue]) => ({ date, revenue }));

  // Orders by status
  const statuses = ["PENDING", "PAID", "FAILED", "SHIPPED"] as const;
  const ordersByStatus = statuses.map((s) => ({ status: s, count: orders.filter((o) => o.status === s).length }));

  // Top products by qty across all time (could scope to last 30 days in future)
  const top = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { qty: true },
    orderBy: { _sum: { qty: "desc" } },
    take: 5,
  });
  const prodIds = top.map((t) => t.productId);
  const prodMap = new Map((await prisma.product.findMany({ where: { id: { in: prodIds } } })).map((p) => [p.id, p]));
  const topProducts = top.map((t) => ({ name: prodMap.get(t.productId)?.name || `#${t.productId}`, qty: t._sum.qty || 0 }));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border rounded p-4"><div className="text-sm text-gray-500">Users</div><div className="text-2xl font-semibold">{usersCount}</div></div>
        <div className="border rounded p-4"><div className="text-sm text-gray-500">Products</div><div className="text-2xl font-semibold">{productsCount}</div></div>
        <div className="border rounded p-4"><div className="text-sm text-gray-500">Orders</div><div className="text-2xl font-semibold">{ordersCount}</div></div>
      </div>
      <AdminCharts revenueByDay={revenueByDay} ordersByStatus={ordersByStatus} topProducts={topProducts} />
      <div className="space-x-3">
        <a href="/admin/products" className="btn-outline">Manage Products</a>
        <a href="/admin/orders" className="btn-outline">Manage Orders</a>
      </div>
    </div>
  );
}
