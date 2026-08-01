"use client";

import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { registerAction } from "@/app/auth/_actions/authActions";
import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form-nextjs";
import AppField from "@/components/shared/forms/AppField";
import AppSubmitButton from "@/components/shared/forms/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, Building2, Home, Upload, X, User } from "lucide-react";
import type { AnyFieldApi } from "@tanstack/react-form-nextjs";
import { RoleSelect } from "./RoleSelect";
import { AvatarPicker } from "./AvatarPicker";

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  )
    return error.message;
  return String(error);
};

interface IRegisterFormProps {
  redirectPath?: string;
}

const RegisterForm = ({ redirectPath }: IRegisterFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRegisterPayload) =>
      registerAction(payload, redirectPath),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "" as "TENANT" | "LANDLORD",
      phone: "",
      avatarUrl: "",
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
          setServerError(result.message || "Registration failed");
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Registration failed";
        setServerError(`Registration failed: ${msg}`);
      }
    },
  });

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
      <FieldGroup className="gap-5">
        <div className="flex flex-col gap-4">
          {/* Avatar */}
          <form.Field name="avatarUrl">
            {(field) => <AvatarPicker field={field} />}
          </form.Field>

          {/* Name & Email Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <form.Field
              name="name"
              validators={{ onChange: registerZodSchema.shape.name }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Full name"
                  placeholder="Jane Smith"
                />
              )}
            </form.Field>

            {/* Email */}
            <form.Field
              name="email"
              validators={{ onChange: registerZodSchema.shape.email }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Email"
                  type="email"
                  placeholder="jane@example.com"
                />
              )}
            </form.Field>
          </div>

          {/* Role */}
          <form.Field
            name="role"
            validators={{ onChange: registerZodSchema.shape.role }}
          >
            {(field) => <RoleSelect field={field} />}
          </form.Field>

          {/* Phone — label adapts based on selected role */}
          <form.Subscribe selector={(s) => s.values.role}>
            {(role) => (
              <form.Field
                name="phone"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return undefined;
                    const PHONE_REGEX =
                      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
                    return PHONE_REGEX.test(value)
                      ? undefined
                      : "Invalid phone number format";
                  },
                }}
              >
                {(field) => {
                  const firstError =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                      ? getErrorMessage(field.state.meta.errors[0])
                      : null;
                  const hasError = firstError !== null;

                  return (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor={field.name}
                        className={cn(hasError && "text-destructive")}
                      >
                        Phone number{" "}
                        {role === "LANDLORD" ? (
                          <span className="text-destructive">*</span>
                        ) : (
                          <span className="text-muted-foreground font-normal">
                            (optional)
                          </span>
                        )}
                      </Label>

                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                          <Phone className="size-4 text-muted-foreground" aria-hidden />
                        </span>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="tel"
                          value={field.state.value ?? ""}
                          placeholder="+1 (555) 000-0000"
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={hasError}
                          aria-describedby={
                            hasError ? `${field.name}-error` : undefined
                          }
                          className={cn(
                            "pl-10",
                            hasError &&
                              "border-destructive focus-visible:ring-destructive/20",
                          )}
                        />
                      </div>

                      {hasError && (
                        <p
                          id={`${field.name}-error`}
                          role="alert"
                          className="text-sm text-destructive"
                        >
                          {firstError}
                        </p>
                      )}
                    </div>
                  );
                }}
              </form.Field>
            )}
          </form.Subscribe>

          {/* Password & Confirm Password Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <form.Field
              name="password"
              validators={{ onChange: registerZodSchema.shape.password }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 chars"
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
              )}
            </form.Field>

            {/* Confirm password */}
            <form.Field
              name="confirmPassword"
              validators={{ onChange: registerZodSchema.shape.confirmPassword }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Confirm password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  showPassword={showConfirmPassword}
                  setShowPassword={setShowConfirmPassword}
                />
              )}
            </form.Field>
          </div>
        </div>

        {serverError && (
          <Alert variant="destructive">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
          {([canSubmit, isSubmitting]) => (
            <AppSubmitButton
              isPending={isSubmitting || isPending}
              pendingLabel="Creating account..."
              disabled={!canSubmit}
            >
              Create account
            </AppSubmitButton>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
};

export default RegisterForm;