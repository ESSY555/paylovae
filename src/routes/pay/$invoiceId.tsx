import { useState } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { Check, FileText, Loader2, ShieldCheck, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/Logo";
import { QrCode } from "@/components/common/QrCode";
import { CopyButton } from "@/components/common/CopyButton";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { WalletModal } from "@/components/wallet/WalletModal";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/app-store";
import { formatAmount, formatDate, formatMoney, invoiceTotal, truncateMiddle } from "@/lib/format";
import { MERCHANT_WALLET } from "@/lib/mock-data";
import { confirmPayment, sendPayment, solanaPayUri } from "@/lib/solana";

export const Route = createFileRoute("/pay/$invoiceId")({
  head: () => ({
    meta: [
      { title: "Pay invoice — Payvolae" },
      {
        name: "description",
        content: "Pay this invoice securely with SOL or USDC on Solana.",
      },
      { property: "og:title", content: "Pay invoice — Payvolae" },
      {
        property: "og:description",
        content: "Scan the QR code or connect your wallet to settle this invoice.",
      },
    ],
  }),
  component: PublicPaymentPage,
});

type Stage = "idle" | "sending" | "confirming";

function PublicPaymentPage() {
  const { invoiceId } = useParams({ from: "/pay/$invoiceId" });
  const navigate = useNavigate();
  const { getInvoice, profile, wallet, markInvoicePaid } = useAppStore();
  const [walletOpen, setWalletOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");

  const invoice = getInvoice(invoiceId);

  if (!invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4">
        <EmptyState
          icon={FileText}
          title="Invoice not found"
          description="This payment link is invalid or the invoice was removed."
          action={
            <Button asChild>
              <Link to="/">Go to Payvolae</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const total = invoiceTotal(invoice);
  const fee = 0.0002;
  const uri = solanaPayUri(MERCHANT_WALLET, total, profile.businessName, invoice.number);
  const paid = invoice.status === "paid";

  async function pay() {
    if (!wallet.connected) {
      setWalletOpen(true);
      return;
    }
    setStage("sending");
    const signature = await sendPayment();
    setStage("confirming");
    await confirmPayment();
    markInvoicePaid(invoice!.id, signature);
    setStage("idle");
    toast.success("Payment confirmed");
    navigate({
      to: "/pay/success",
      search: { invoice: invoice!.number, tx: signature },
    });
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
          <Link to="/">
            <Logo />
          </Link>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="size-4 text-success" />
            Secure Solana payment
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border bg-card p-6 shadow-card sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Invoice {invoice.number}
              </p>
              <h1 className="mt-2 font-display text-3xl font-semibold">
                {formatAmount(total, invoice.currency)}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                From {profile.businessName} · due {formatDate(invoice.dueDate)}
              </p>
            </div>
            <StatusBadge status={invoice.status} />
          </div>

          <ul className="mt-7 divide-y border-y">
            {invoice.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{item.description}</span>
                  <span className="tabular block text-xs text-muted-foreground">
                    {item.quantity} × {formatMoney(item.rate)}
                  </span>
                </span>
                <span className="tabular shrink-0 font-semibold">
                  {formatMoney(item.quantity * item.rate)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="tabular">{formatMoney(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Estimated network fee</dt>
              <dd className="tabular">{fee} SOL</dd>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <dt>Total due</dt>
              <dd className="tabular">{formatAmount(total, invoice.currency)}</dd>
            </div>
          </dl>

          {paid ? (
            <div className="mt-7 flex items-center gap-3 rounded-xl bg-success/10 px-4 py-3.5 text-sm text-success">
              <Check className="size-4 shrink-0" />
              <span className="font-medium">
                This invoice was paid{invoice.paidAt ? ` on ${formatDate(invoice.paidAt)}` : ""}.
              </span>
            </div>
          ) : (
            <div className="mt-7 grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="space-y-3">
                <Button size="lg" className="w-full" onClick={pay} disabled={stage !== "idle"}>
                  {stage === "idle" ? (
                    <>
                      <Wallet className="size-4" />
                      {wallet.connected ? "Pay with wallet" : "Connect wallet to pay"}
                    </>
                  ) : (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {stage === "sending" ? "Approving transaction…" : "Confirming on-chain…"}
                    </>
                  )}
                </Button>
                <div className="flex items-center gap-2">
                  <code className="min-w-0 flex-1 truncate rounded-lg bg-secondary px-3 py-2 text-xs text-muted-foreground">
                    {truncateMiddle(MERCHANT_WALLET, 12, 8)}
                  </code>
                  <CopyButton value={MERCHANT_WALLET} label="Wallet address copied" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Or scan the QR code with Phantom, Solflare or Backpack.
                </p>
              </div>
              <QrCode value={uri} size={150} className="justify-self-center" />
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Payments are settled directly on Solana. Payvolae never holds your funds.
        </p>
      </main>

      <WalletModal open={walletOpen} onOpenChange={setWalletOpen} onConnected={() => void pay()} />
    </div>
  );
}
