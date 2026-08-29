import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthLayout, Divider, Field } from "@/components/auth/AuthLayout";
import { WalletModal } from "@/components/wallet/WalletModal";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign in — Payvolae" },
      {
        name: "description",
        content: "Sign in to Payvolae to manage invoices and Solana payments.",
      },
      { property: "og:title", content: "Sign in — Payvolae" },
      { property: "og:description", content: "Access your Payvolae invoicing dashboard." },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const [walletOpen, setWalletOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    const next: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next["email"] = "Enter a valid email address.";
    if (password.length < 6) next["password"] = "Password must be at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    toast.success("Signed in");
    navigate({ to: "/dashboard" });
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your invoices and payments."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          error={errors["email"]}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          error={errors["password"]}
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox name="remember" /> Remember me
          </label>
          <button
            type="button"
            onClick={() => toast.info("Password reset link sent")}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Forgot password?
          </button>
        </div>
        <Button type="submit" className="w-full" size="lg">
          Sign In
        </Button>
      </form>

      <Divider />

      <Button variant="outline" size="lg" className="w-full" onClick={() => setWalletOpen(true)}>
        <Wallet className="size-4" />
        Connect Solana Wallet
      </Button>

      <WalletModal
        open={walletOpen}
        onOpenChange={setWalletOpen}
        onConnected={() => navigate({ to: "/dashboard" })}
      />
    </AuthLayout>
  );
}
