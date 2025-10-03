import { prisma } from "@/lib/prisma";
import { TCheckoutBody } from "../schemas/order";

export const orderService = {
  async createOrder(userId: number, input: TCheckoutBody) {
    const productIds = input.items.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    if (products.length !== productIds.length) throw new Error("Some products not found");

    const totalAmount = products.reduce((sum, p) => {
      const qty = input.items.find((i) => i.productId === p.id)?.qty || 0;
      return sum + Number(p.price) * qty;
    }, 0);

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: { userId, totalAmount: totalAmount as any, status: "PENDING" },
      });

      await tx.orderItem.createMany({
        data: input.items.map((i) => ({
          orderId: created.id,
          productId: i.productId,
          price: products.find((p) => p.id === i.productId)!.price as any,
          qty: i.qty,
        })),
      });

      for (const i of input.items) {
        await tx.product.update({ where: { id: i.productId }, data: { stock: { decrement: i.qty } } });
      }

      return created;
    });

    return { orderId: order.id, totalAmount };
  },
};
