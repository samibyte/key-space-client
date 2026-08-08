"use client";

import { FieldGroup } from "@/components/ui/field";

import { loginAction } from "@/app/auth/_actions/authActions";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form-nextjs";
import AppField from "@/components/shared/forms/AppField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AppSubmitButton from "@/components/shared/forms/AppSubmitButton";
import { Zap } from "lucide-react";

interface ILoginFormProps {
  redirectPath?: string;
}

const DEMO_ROLES = [

  {
    label: "Landlord",
    email: "landlord1@rentnest.com",
    password: "Landlord123!",
    className:
      "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20",
  },
  {
    label: "Admin",
    email: "admin@rentnest.com",
    password: "AdminPassword123!",
    className:
      "bg-rose-500/10 text-rose-600 border-rose-300/50 hover:bg-rose-500/20 dark:text-rose-400 dark:border-rose-700/50",
  },
  {
    label: "Tenant",
    email: "tenant1@rentnest.com",
    password: "Tenant123!",
    className:
      "bg-emerald-500/10 text-emerald-600 border-emerald-300/50 hover:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-700/50",
  },
] as const;

export const LoginForm = ({ redirectPath }: ILoginFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ILoginPayload) => loginAction(payload, redirectPath),
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = await mutateAsync(value);

        if (result.redirectPath) {
          window.location.href = result.redirectPath;
          return;
        }

        if (!result.success) {
          setServerError(result.message || "Login failed");
          return;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Login failed";
        console.log(`Login failed: ${errorMessage}`);
        setServerError(`Login failed: ${errorMessage}`);
      }
    },
  });

  const fillDemo = (role: (typeof DEMO_ROLES)[number]) => {
    form.setFieldValue("email", role.email);
    form.setFieldValue("password", role.password);
    setActiveDemo(role.label);
  };

  return (
    <form
      method="POST"
      action="#"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      {/* Demo role picker */}
      <div className="mb-6 rounded-xl border border-border/50 bg-muted/30 p-3.5 space-y-2.5">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <Zap className="size-3 text-primary" />
          Quick Demo — click a role to auto-fill
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          {DEMO_ROLES.map((role) => (
            <button
              key={role.label}
              type="button"
              onClick={() => fillDemo(role)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] ${role.className} ${
                activeDemo === role.label ? "ring-2 ring-offset-1 ring-current" : ""
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>
        {activeDemo && (
          <p className="text-[11px] text-muted-foreground">
            ✓ Filled as <strong>{activeDemo}</strong> — click <em>Log In</em> to continue.
          </p>
        )}
      </div>

      <FieldGroup className="gap-6">
        <div className="flex flex-col gap-4">
          <form.Field
            name="email"
            validators={{ onChange: loginZodSchema.shape.email }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email"
                type="email"
                placeholder="Enter your email"
              />
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{ onChange: loginZodSchema.shape.password }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            )}
          </form.Field>
        </div>

        {/* <Field orientation="horizontal" className="justify-between">
          <div className="flex items-center gap-3">
            <Checkbox id="terms" defaultChecked className="cursor-pointer" />
            <FieldLabel
              htmlFor="terms"
              className="text-sm text-primary font-normal cursor-pointer"
            >
              Remember this device
            </FieldLabel>
          </div>
          <a
            href="#"
            className="text-sm text-card-foreground font-medium text-end"
          >
            Forgot password?
          </a>
        </Field> */}
        {serverError && (
          <Alert variant={"destructive"}>
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <form.Subscribe
          selector={(s) => [s.canSubmit, s.isSubmitting] as const}
        >
          {([canSubmit, isSubmitting]) => (
            <AppSubmitButton
              isPending={isSubmitting || isPending}
              pendingLabel="Logging In...."
              disabled={!canSubmit}
            >
              Log In
            </AppSubmitButton>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
};
