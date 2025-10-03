import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/server/utils/session";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/sign-in");
  const orders = await prisma.order.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>
      <ul className="space-y-2">
        {orders.map((o) => (
          <li key={o.id} className="bg-white rounded border p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Order #{o.id}</div>
                <div className="text-sm text-gray-600">{o.createdAt.toISOString()} • {o.status}</div>
              </div>
              <Link href={`/orders/${o.id}`} className="text-sm hover:underline">Chi tiết</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
