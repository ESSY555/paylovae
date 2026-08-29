import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthLayout, Divider, Field } from "@/components/auth/AuthLayout";
import { WalletModal } from "@/components/wallet/WalletModal";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your Payvolae account" },
      {
        name: "description",
        content: "Sign up for Payvolae and start invoicing clients in SOL or USDC today.",
      },
      { property: "og:title", content: "Create your Payvolae account" },
      {
        property: "og:description",
        content: "Start sending professional Solana invoices in minutes.",
      },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();
  const [walletOpen, setWalletOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const fullName = String(data.get("fullName") ?? "").trim();
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    const next: Record<string, string> = {};
    if (fullName.length < 2) next["fullName"] = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next["email"] = "Enter a valid email address.";
    if (password.length < 8) next["password"] = "Use at least 8 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    toast.success("Account created");
    navigate({ to: "/dashboard" });
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Send your first invoice in under a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/signin" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Field
          label="Full name"
          name="fullName"
          autoComplete="name"
          placeholder="Alex Morgan"
          error={errors["fullName"]}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="alex@example.com"
          error={errors["email"]}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          error={errors["password"]}
        />
        <Button type="submit" className="w-full" size="lg">
          Create Account
        </Button>
      </form>

      <Divider />

      <Button variant="outline" size="lg" className="w-full" onClick={() => setWalletOpen(true)}>
        <Wallet className="size-4" />
        Continue with Wallet
      </Button>

      <WalletModal
        open={walletOpen}
        onOpenChange={setWalletOpen}
        onConnected={() => navigate({ to: "/dashboard" })}
      />
    </AuthLayout>
  );
}
