import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AnyFieldApi } from "@tanstack/react-form-nextjs";
import { Building2, Home } from "lucide-react";
import { getErrorMessage } from "./RegisterForm";

export const RoleSelect = ({ field }: { field: AnyFieldApi }) => {
  const firstError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0
      ? getErrorMessage(field.state.meta.errors[0])
      : null;
  const hasError = firstError !== null;
  const value = field.state.value as string;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={field.name} className={cn(hasError && "text-destructive")}>
        I am a <span className="text-destructive">*</span>
      </Label>

      <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Role">
        {(
          [
            { val: "TENANT", Icon: Home, label: "Tenant" },
            { val: "LANDLORD", Icon: Building2, label: "Landlord" },
          ] as const
        ).map(({ val, Icon, label }) => (
          <button
            key={val}
            type="button"
            role="radio"
            aria-checked={value === val}
            onClick={() => field.handleChange(val)}
            onBlur={() => field.handleBlur()}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-all duration-200 cursor-pointer",
              "hover:border-primary/60 hover:bg-primary/5",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
              value === val
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-transparent text-muted-foreground",
              hasError && value !== val && "border-destructive/50",
            )}
          >
            <Icon
              className={cn(
                "size-5",
                value === val ? "text-primary" : "text-muted-foreground",
              )}
              aria-hidden
            />
            {label}
          </button>
        ))}
      </div>

      {hasError && (
        <p id={`${field.name}-error`} role="alert" className="text-sm text-destructive">
          {firstError}
        </p>
      )}
    </div>
  );
};