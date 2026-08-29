import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownLeft, ExternalLink, Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/common/EmptyState";
import { CopyButton } from "@/components/common/CopyButton";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/app-store";
import { formatAmount, formatDate, formatMoney, truncateMiddle } from "@/lib/format";
import { explorerUrl } from "@/lib/solana";

export const Route = createFileRoute("/payments")({
  head: () => ({
    meta: [
      { title: "Payments — Payvolae" },
      {
        name: "description",
        content: "Every confirmed on-chain payment with its Solana transaction signature.",
      },
      { property: "og:title", content: "Payments — Payvolae" },
      { property: "og:description", content: "A verified log of all payments you've received." },
    ],
  }),
  component: PaymentsPage,
});

function PaymentsPage() {
  const { payments } = useAppStore();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return payments;
    return payments.filter(
      (payment) =>
        payment.invoiceNumber.toLowerCase().includes(q) ||
        payment.clientName.toLowerCase().includes(q) ||
        payment.txSignature.toLowerCase().includes(q),
    );
  }, [payments, query]);

  const received = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <AppShell>
      <div className="min-w-0">
        <h1 className="truncate text-xl font-semibold sm:text-2xl">Payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {payments.length} payments · {formatMoney(received)} received
        </p>
      </div>

      <div className="relative mt-6">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by invoice, client or signature"
          className="pl-9"
          aria-label="Search payments"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          className="mt-5"
          icon={ArrowDownLeft}
          title="No payments found"
          description="Confirmed payments appear here with their transaction details."
        />
      ) : (
        <div className="mt-5 overflow-x-auto rounded-2xl border bg-card shadow-card">
          <table className="w-full min-w-[42rem] border-collapse text-sm">
            <thead>
              <tr className="border-b text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Transaction</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b transition-colors last:border-0 hover:bg-secondary/50"
                >
                  <td className="tabular px-4 py-3.5 font-semibold">{payment.invoiceNumber}</td>
                  <td className="px-4 py-3.5">{payment.clientName}</td>
                  <td className="tabular whitespace-nowrap px-4 py-3.5 font-semibold text-success">
                    +{formatAmount(payment.amount, payment.currency)}
                  </td>
                  <td className="tabular whitespace-nowrap px-4 py-3.5 text-muted-foreground">
                    {formatDate(payment.date)}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <code className="tabular text-xs text-muted-foreground">
                        {truncateMiddle(payment.txSignature, 6, 6)}
                      </code>
                      <CopyButton
                        value={payment.txSignature}
                        label="Signature copied"
                        variant="ghost"
                      />
                      <a
                        href={explorerUrl(payment.txSignature)}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="View on explorer"
                        className="text-muted-foreground transition-colors hover:text-primary"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
