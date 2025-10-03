import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, signJwt } from "@/lib/auth";
import { TRegisterBody, TLoginBody } from "../schemas/auth";

export const authService = {
  async register(input: TRegisterBody) {
    const exists = await prisma.user.findUnique({ where: { email: input.email } });
    if (exists) throw new Error("Email already registered");
    const passwordHash = await hashPassword(input.password);
    const user = await prisma.user.create({ data: { name: input.name, email: input.email, passwordHash } });
    return { id: user.id, email: user.email, name: user.name };
  },

  async login(input: TLoginBody) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw new Error("Invalid credentials");
    const ok = await verifyPassword(input.password, user.passwordHash);
    if (!ok) throw new Error("Invalid credentials");
    const token = await signJwt({ sub: String(user.id), email: user.email, role: user.role });
    return { token };
  },
};
