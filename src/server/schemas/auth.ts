import { z } from "zod";

export const RegisterBody = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export const LoginBody = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export type TRegisterBody = z.infer<typeof RegisterBody>;
export type TLoginBody = z.infer<typeof LoginBody>;
