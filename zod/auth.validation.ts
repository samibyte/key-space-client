import z from "zod";

export const loginZodSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type ILoginPayload = z.infer<typeof loginZodSchema>;
