import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ExternalLink } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { CopyButton } from "@/components/common/CopyButton";
import { Button } from "@/components/ui/button";
import { truncateMiddle } from "@/lib/format";
import { explorerUrl } from "@/lib/solana";

export const Route = createFileRoute("/pay/success")({
  validateSearch: (search: Record<string, unknown>) => ({
    invoice: typeof search["invoice"] === "string" ? search["invoice"] : "",
    tx: typeof search["tx"] === "string" ? search["tx"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Payment successful — Payvolae" },
      {
        name: "description",
        content: "Your Solana payment was confirmed and the invoice is now marked as paid.",
      },
      { property: "og:title", content: "Payment successful — Payvolae" },
      { property: "og:description", content: "Payment confirmed on the Solana network." },
    ],
  }),
  component: PaymentSuccessPage,
});

function PaymentSuccessPage() {
  const { invoice, tx } = Route.useSearch();

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-12">
        <Link to="/" className="mx-auto">
          <Logo />
        </Link>

        <div className="mt-8 rounded-2xl border bg-card p-8 text-center shadow-card">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-success/15 text-success">
            <Check className="size-7" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold">Payment successful</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {invoice ? `Invoice ${invoice} is now marked as paid.` : "Your invoice is now paid."}{" "}
            A receipt has been emailed to you.
          </p>

          {tx ? (
            <div className="mt-6 rounded-xl bg-secondary/60 px-4 py-3 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Transaction
              </p>
              <div className="mt-2 flex items-center gap-2">
                <code className="tabular min-w-0 flex-1 truncate text-xs text-muted-foreground">
                  {truncateMiddle(tx, 12, 8)}
                </code>
                <CopyButton value={tx} label="Signature copied" size="icon" variant="ghost" />
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            {tx ? (
              <Button asChild variant="outline">
                <a href={explorerUrl(tx)} target="_blank" rel="noreferrer">
                  View on explorer
                  <ExternalLink className="size-3.5" />
                </a>
              </Button>
            ) : null}
            <Button asChild>
              <Link to="/">Back to Payvolae</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
