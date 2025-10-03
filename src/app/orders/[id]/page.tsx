import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/server/utils/session";
import { redirect } from "next/navigation";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const userId = await getSessionUserId();
  if (!userId) redirect("/sign-in");
  const id = Number(params.id);
  const order = await prisma.order.findFirst({
    where: { id, userId },
    include: { items: { include: { product: true } } },
  });
  if (!order) redirect("/orders");
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Đơn hàng #{order.id}</h1>
      <p className="text-sm text-gray-600 mb-4">Trạng thái: {order.status}</p>
      <div className="space-y-2">
        {order.items.map((it) => (
          <div key={it.id} className="bg-white rounded border p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{it.product.name}</div>
              <div className="text-sm text-gray-600">x{it.qty}</div>
            </div>
            <div>{String(it.price)}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 font-semibold">Tổng: {String(order.totalAmount)}</div>
    </div>
  );
}
