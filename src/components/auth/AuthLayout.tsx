import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
        <Link to="/" className="mx-auto">
          <Logo showTagline />
        </Link>
        <div className="mt-8 rounded-2xl border bg-card p-6 shadow-card sm:p-8">
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-6 space-y-4">{children}</div>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
      </div>
    </div>
  );
}

export function Field({
  label,
  name,
  type = "text",
  error,
  autoComplete,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string | undefined;
  error?: string | undefined;
  autoComplete?: string | undefined;
  placeholder?: string | undefined;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error ? (
        <p id={`${name}-error`} className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Divider() {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs uppercase tracking-wider text-muted-foreground">or</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
