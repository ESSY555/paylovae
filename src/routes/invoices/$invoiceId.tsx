import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Download,
  ExternalLink,
  FileText,
  Link2,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { InvoicePreview } from "@/components/invoices/InvoicePreview";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CopyButton } from "@/components/common/CopyButton";
import { QrCode } from "@/components/common/QrCode";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/app-store";
import { formatAmount, formatDate, invoiceTotal, truncateMiddle } from "@/lib/format";
import { paymentLink } from "@/lib/links";
import { explorerUrl, solanaPayUri } from "@/lib/solana";
import { MERCHANT_WALLET } from "@/lib/mock-data";

export const Route = createFileRoute("/invoices/$invoiceId")({
  head: () => ({
    meta: [
      { title: "Invoice details — Payvolae" },
      {
        name: "description",
        content: "Review an invoice, share its payment link and track its payment status.",
      },
      { property: "og:title", content: "Invoice details — Payvolae" },
      {
        property: "og:description",
        content: "Invoice status, QR code and on-chain transaction details.",
      },
    ],
  }),
  component: InvoiceDetailsPage,
});

function InvoiceDetailsPage() {
  const { invoiceId } = useParams({ from: "/invoices/$invoiceId" });
  const { getInvoice, profile, updateInvoice } = useAppStore();
  const invoice = getInvoice(invoiceId);

  if (!invoice) {
    return (
      <AppShell>
        <EmptyState
          icon={FileText}
          title="Invoice not found"
          description="This invoice may have been removed or the link is incorrect."
          action={
            <Button asChild>
              <Link to="/invoices">Back to invoices</Link>
            </Button>
          }
        />
      </AppShell>
    );
  }

  const total = invoiceTotal(invoice);
  const link = paymentLink(invoice.id);
  const uri = solanaPayUri(MERCHANT_WALLET, total, profile.businessName, invoice.number);

  const timeline = [
    { label: "Invoice created", date: invoice.createdAt, done: true },
    { label: "Payment link shared", date: invoice.issueDate, done: invoice.status !== "draft" },
    {
      label: invoice.status === "paid" ? "Payment received" : "Awaiting payment",
      date: invoice.paidAt ?? invoice.dueDate,
      done: invoice.status === "paid",
    },
  ];

  return (
    <AppShell>
      <Link
        to="/invoices"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to invoices
      </Link>

      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <h1 className="tabular truncate text-xl font-semibold sm:text-2xl">{invoice.number}</h1>
            <StatusBadge status={invoice.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {invoice.clientName} · {formatAmount(total, invoice.currency)} · due{" "}
            {formatDate(invoice.dueDate)}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="size-4" />
            Download
          </Button>
          {invoice.status === "draft" ? (
            <Button
              onClick={() => {
                updateInvoice(invoice.id, { status: "pending" });
                toast.success("Invoice sent to client");
              }}
            >
              <Send className="size-4" />
              Send invoice
            </Button>
          ) : (
            <Button asChild>
              <Link to="/pay/$invoiceId" params={{ invoiceId: invoice.id }}>
                <ExternalLink className="size-4" />
                Payment page
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <InvoicePreview
          data={{
            number: invoice.number,
            fromName: profile.businessName,
            fromEmail: profile.email,
            clientName: invoice.clientName,
            clientEmail: invoice.clientEmail,
            issueDate: invoice.issueDate,
            dueDate: invoice.dueDate,
            items: invoice.items,
            currency: invoice.currency,
            ...(invoice.notes ? { notes: invoice.notes } : {}),
          }}
        />

        <div className="space-y-5">
          <section className="rounded-2xl border bg-card p-5 shadow-card">
            <h2 className="text-sm font-semibold">Share payment link</h2>
            <div className="mt-3 flex items-center gap-2">
              <code className="min-w-0 flex-1 truncate rounded-lg bg-secondary px-3 py-2 text-xs text-muted-foreground">
                {link}
              </code>
              <CopyButton value={link} label="Payment link copied" />
            </div>
            <div className="mt-4 flex justify-center">
              <QrCode value={uri} size={168} />
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Scan with any Solana Pay compatible wallet.
            </p>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => toast.success("Reminder email sent")}
            >
              <Link2 className="size-4" />
              Send reminder
            </Button>
          </section>

          <section className="rounded-2xl border bg-card p-5 shadow-card">
            <h2 className="text-sm font-semibold">Timeline</h2>
            <ol className="mt-4 space-y-4">
              {timeline.map((event) => (
                <li key={event.label} className="flex gap-3">
                  <span
                    className={
                      event.done
                        ? "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-success/15 text-success"
                        : "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground"
                    }
                  >
                    <Check className="size-3.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{event.label}</span>
                    <span className="tabular block text-xs text-muted-foreground">
                      {formatDate(event.date)}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {invoice.txSignature ? (
            <section className="rounded-2xl border bg-card p-5 shadow-card">
              <h2 className="text-sm font-semibold">Transaction</h2>
              <p className="tabular mt-2 text-xs text-muted-foreground">
                {truncateMiddle(invoice.txSignature, 10, 8)}
              </p>
              <div className="mt-3 flex gap-2">
                <CopyButton value={invoice.txSignature} label="Signature copied" />
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <a href={explorerUrl(invoice.txSignature)} target="_blank" rel="noreferrer">
                    View on explorer
                    <ExternalLink className="size-3.5" />
                  </a>
                </Button>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
