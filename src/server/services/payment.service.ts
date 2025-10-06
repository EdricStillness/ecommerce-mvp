import { prisma } from "@/lib/prisma";
import { signJwt, verifyJwt } from "@/lib/auth";

export const paymentService = {
  async createPaypalApproval(orderId: number, amount: string, origin: string) {
    const token = await signJwt({ kind: "paypal", orderId, amount }, "10m");
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentProvider: "PAYPAL", paymentToken: token },
    });
    return {
      token,
      approvalUrl: `${origin}/payments/paypal/approve?token=${encodeURIComponent(token)}`,
    };
  },

  async capturePaypal(token: string) {
    const payload = await verifyJwt<any>(token);
    if (payload.kind === "paypal") {
      // Legacy flow: mark existing order as PAID
      const order = await prisma.order.update({
        where: { id: Number(payload.orderId) },
        data: { status: "PAID", transactionId: `SIM-${Date.now()}`, paidAt: new Date() },
      });
      return { orderId: order.id, status: order.status };
    }
    if (payload.kind === "paypal-session") {
      // Session flow: create order now based on items
      const items: Array<{ productId: number; qty: number }> = payload.items || [];
      if (!Array.isArray(items) || items.length === 0) throw new Error("Empty items");
      const productIds = items.map((i) => i.productId);
      const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
      if (products.length !== productIds.length) throw new Error("Some products not found");
      const totalAmount = products.reduce((sum, p) => {
        const qty = items.find((i) => i.productId === p.id)?.qty || 0;
        return sum + Number(p.price) * qty;
      }, 0);
      // Optional: compare with payload.amount
      const order = await prisma.$transaction(async (tx) => {
        const created = await tx.order.create({
          data: {
            userId: Number(payload.userId),
            totalAmount: totalAmount as any,
            status: "PAID",
            paymentProvider: "PAYPAL",
            paymentToken: token,
            transactionId: `SIM-${Date.now()}`,
            paidAt: new Date(),
          },
        });
        await tx.orderItem.createMany({
          data: items.map((i) => ({
            orderId: created.id,
            productId: i.productId,
            price: products.find((p) => p.id === i.productId)!.price as any,
            qty: i.qty,
          })),
        });
        for (const i of items) {
          await tx.product.update({ where: { id: i.productId }, data: { stock: { decrement: i.qty } } });
        }
        return created;
      });
      return { orderId: order.id, status: order.status };
    }
    throw new Error("Invalid token kind");
  },

  async createPaypalSessionFromCart(
    userId: number,
    items: Array<{ productId: number; qty: number }>,
    origin: string
  ) {
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    if (products.length !== productIds.length) throw new Error("Some products not found");
    const amount = products.reduce((sum, p) => {
      const qty = items.find((i) => i.productId === p.id)?.qty || 0;
      return sum + Number(p.price) * qty;
    }, 0);
    const token = await signJwt({ kind: "paypal-session", userId, items, amount: String(amount) }, "10m");
    return { token, approvalUrl: `${origin}/payments/paypal/approve?token=${encodeURIComponent(token)}` };
  },
};
