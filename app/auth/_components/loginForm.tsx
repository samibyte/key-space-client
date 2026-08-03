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

interface ILoginFormProps {
  redirectPath?: string;
}

export const LoginForm = ({ redirectPath }: ILoginFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);

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
