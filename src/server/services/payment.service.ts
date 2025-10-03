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
    const payload = await verifyJwt<{ kind: string; orderId: number; amount: string }>(token);
    if (payload.kind !== "paypal") throw new Error("Invalid token kind");
    const order = await prisma.order.update({
      where: { id: Number(payload.orderId) },
      data: { status: "PAID", transactionId: `SIM-${Date.now()}`, paidAt: new Date() },
    });
    return { orderId: order.id, status: order.status };
  },
};
