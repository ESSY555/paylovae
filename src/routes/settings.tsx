import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { CopyButton } from "@/components/common/CopyButton";
import { WalletModal } from "@/components/wallet/WalletModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/app-store";
import { truncateMiddle } from "@/lib/format";
import { disconnectWallet, WALLET_PROVIDERS } from "@/lib/solana";
import type { Currency } from "@/lib/types";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Payvolae" },
      {
        name: "description",
        content: "Update your business profile, invoice defaults and connected Solana wallet.",
      },
      { property: "og:title", content: "Settings — Payvolae" },
      {
        property: "og:description",
        content: "Manage business details, payment currencies and wallet connection.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { profile, setProfile, wallet, disconnectWalletState } = useAppStore();
  const [walletOpen, setWalletOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(false);

  const providerName =
    WALLET_PROVIDERS.find((provider) => provider.id === wallet.provider)?.name ?? "Wallet";

  function toggleCurrency(currency: Currency, enabled: boolean) {
    const next = enabled
      ? Array.from(new Set([...profile.acceptedCurrencies, currency]))
      : profile.acceptedCurrencies.filter((item) => item !== currency);
    if (next.length === 0) {
      toast.error("Keep at least one currency enabled");
      return;
    }
    setProfile({ acceptedCurrencies: next });
  }

  return (
    <AppShell>
      <div className="min-w-0">
        <h1 className="truncate text-xl font-semibold sm:text-2xl">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, invoicing defaults and wallet.
        </p>
      </div>

      <div className="mt-6 grid max-w-3xl gap-6">
        <section className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
          <h2 className="text-base font-semibold">Business profile</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                value={profile.fullName}
                onChange={(event) => setProfile({ fullName: event.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(event) => setProfile({ email: event.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="businessName">Business name</Label>
              <Input
                id="businessName"
                value={profile.businessName}
                onChange={(event) => setProfile({ businessName: event.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invoicePrefix">Invoice prefix</Label>
              <Input
                id="invoicePrefix"
                value={profile.invoicePrefix}
                onChange={(event) => setProfile({ invoicePrefix: event.target.value })}
              />
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            <Label htmlFor="businessAddress">Business address</Label>
            <Textarea
              id="businessAddress"
              rows={2}
              value={profile.businessAddress}
              onChange={(event) => setProfile({ businessAddress: event.target.value })}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => toast.success("Profile saved")}>Save changes</Button>
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
          <h2 className="text-base font-semibold">Payment preferences</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="defaultCurrency">Default currency</Label>
              <Select
                value={profile.defaultCurrency}
                onValueChange={(value) => setProfile({ defaultCurrency: value as Currency })}
              >
                <SelectTrigger id="defaultCurrency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="SOL">SOL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="paymentTerms">Payment terms</Label>
              <Select
                value={profile.paymentTerms}
                onValueChange={(value) => setProfile({ paymentTerms: value })}
              >
                <SelectTrigger id="paymentTerms">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Due on receipt">Due on receipt</SelectItem>
                  <SelectItem value="Net 7">Net 7</SelectItem>
                  <SelectItem value="Net 14">Net 14</SelectItem>
                  <SelectItem value="Net 30">Net 30</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {(["USDC", "SOL"] as Currency[]).map((currency) => (
              <div key={currency} className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium">Accept {currency}</p>
                  <p className="text-xs text-muted-foreground">
                    {currency === "USDC"
                      ? "Stablecoin payments, no price volatility."
                      : "Native Solana payments with low fees."}
                  </p>
                </div>
                <Switch
                  checked={profile.acceptedCurrencies.includes(currency)}
                  onCheckedChange={(checked) => toggleCurrency(currency, checked)}
                  aria-label={`Accept ${currency}`}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
          <h2 className="text-base font-semibold">Wallet</h2>
          {wallet.connected && wallet.address ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-secondary/60 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold">{providerName} connected</p>
                <p className="tabular truncate text-xs text-muted-foreground">
                  {truncateMiddle(wallet.address, 10, 8)}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <CopyButton value={wallet.address} label="Address copied" variant="ghost" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await disconnectWallet();
                    disconnectWalletState();
                    toast.success("Wallet disconnected");
                  }}
                >
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Connect a wallet to receive invoice payments.
              </p>
              <Button onClick={() => setWalletOpen(true)}>
                <Wallet className="size-4" />
                Connect wallet
              </Button>
            </div>
          )}
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
          <h2 className="text-base font-semibold">Notifications</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">Payment received emails</p>
                <p className="text-xs text-muted-foreground">
                  Get notified as soon as a payment confirms on-chain.
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
                aria-label="Payment received emails"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">Automatic overdue reminders</p>
                <p className="text-xs text-muted-foreground">
                  Nudge clients three days after the due date.
                </p>
              </div>
              <Switch
                checked={reminders}
                onCheckedChange={setReminders}
                aria-label="Automatic overdue reminders"
              />
            </div>
          </div>
        </section>
      </div>

      <WalletModal open={walletOpen} onOpenChange={setWalletOpen} />
    </AppShell>
  );
}
