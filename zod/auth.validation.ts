import z from "zod";

export const loginZodSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type ILoginPayload = z.infer<typeof loginZodSchema>;

// Register 

export const UserRole = {
  TENANT: "TENANT",
  LANDLORD: "LANDLORD",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

const PHONE_REGEX = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

export const registerZodSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(80, "Name must be at most 80 characters"),

    email: z.string().email("Invalid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),

    confirmPassword: z.string().min(1, "Please confirm your password"),

    role: z.enum(["TENANT", "LANDLORD"], {
      message: "Please select a role",
    }),

    /** Optional for tenants, required for landlords enforced via superRefine */
    phone: z
      .string()
      .optional()
      .refine((val) => !val || PHONE_REGEX.test(val), {
        message: "Invalid phone number format",
      }),

    /** Cloudinary upload scaffolding — will hold the public_id after upload */
    avatarUrl: z.string().url("Invalid avatar URL").optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }

    if (data.role === "LANDLORD" && !data.phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: "Phone number is required for landlords",
      });
    }
  });

export type IRegisterPayload = z.infer<typeof registerZodSchema>;

