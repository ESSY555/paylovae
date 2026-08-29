import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { InvoicePreview } from "@/components/invoices/InvoicePreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/app-store";
import { addDaysISO, formatAmount, invoiceTotal, todayISO } from "@/lib/format";
import type { Currency, Invoice, LineItem } from "@/lib/types";

export const Route = createFileRoute("/invoices/new")({
  head: () => ({
    meta: [
      { title: "Create invoice — Payvolae" },
      {
        name: "description",
        content: "Build a professional invoice and get paid in USDC or SOL.",
      },
      { property: "og:title", content: "Create invoice — Payvolae" },
      {
        property: "og:description",
        content: "Add line items, pick a currency and share a payment link instantly.",
      },
    ],
  }),
  component: CreateInvoicePage,
});

function newItem(): LineItem {
  return { id: `li-${Math.random().toString(36).slice(2, 8)}`, description: "", quantity: 1, rate: 0 };
}

function CreateInvoicePage() {
  const navigate = useNavigate();
  const { profile, addInvoice, nextInvoiceNumber, customers } = useAppStore();

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [currency, setCurrency] = useState<Currency>(profile.defaultCurrency);
  const [issueDate, setIssueDate] = useState(todayISO());
  const [dueDate, setDueDate] = useState(addDaysISO(14));
  const [notes, setNotes] = useState("Thank you for your business.");
  const [items, setItems] = useState<LineItem[]>([newItem()]);

  const number = useMemo(() => nextInvoiceNumber(), [nextInvoiceNumber]);
  const total = invoiceTotal({ items });

  function patchItem(id: string, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function submit(status: "pending" | "draft") {
    if (!clientName.trim()) {
      toast.error("Add a client name");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(clientEmail)) {
      toast.error("Add a valid client email");
      return;
    }
    const validItems = items.filter((item) => item.description.trim() && item.rate > 0);
    if (validItems.length === 0) {
      toast.error("Add at least one line item with an amount");
      return;
    }

    const invoice: Invoice = {
      id: `inv-${Date.now().toString(36)}`,
      number,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      description: validItems[0]?.description ?? "Services",
      items: validItems,
      currency,
      issueDate,
      dueDate,
      createdAt: todayISO(),
      status,
      notes,
    };
    addInvoice(invoice);
    toast.success(status === "draft" ? "Draft saved" : `${number} created`);
    navigate({ to: "/invoices/$invoiceId", params: { invoiceId: invoice.id } });
  }

  return (
    <AppShell>
      <Link
        to="/invoices"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to invoices
      </Link>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold sm:text-2xl">Create invoice</h1>
          <p className="tabular mt-1 text-sm text-muted-foreground">{number}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => submit("draft")}>
            Save draft
          </Button>
          <Button onClick={() => submit("pending")}>Create &amp; Share</Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <div className="space-y-6">
          <section className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
            <h2 className="text-base font-semibold">Client details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="clientName">Client name</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(event) => setClientName(event.target.value)}
                  placeholder="Acme Design"
                  list="customer-names"
                />
                <datalist id="customer-names">
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.name} />
                  ))}
                </datalist>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="clientEmail">Client email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={clientEmail}
                  onChange={(event) => setClientEmail(event.target.value)}
                  placeholder="billing@acme.com"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold">Line items</h2>
              <Button variant="outline" size="sm" onClick={() => setItems((p) => [...p, newItem()])}>
                <Plus className="size-4" />
                Add item
              </Button>
            </div>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-3 rounded-xl border bg-surface p-3 sm:grid-cols-[minmax(0,1fr)_5rem_7rem_auto] sm:items-end"
                >
                  <div className="space-y-1.5">
                    <Label htmlFor={`desc-${item.id}`} className="text-xs">
                      Description
                    </Label>
                    <Input
                      id={`desc-${item.id}`}
                      value={item.description}
                      onChange={(event) => patchItem(item.id, { description: event.target.value })}
                      placeholder="Brand identity package"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`qty-${item.id}`} className="text-xs">
                      Qty
                    </Label>
                    <Input
                      id={`qty-${item.id}`}
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) =>
                        patchItem(item.id, { quantity: Number(event.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`rate-${item.id}`} className="text-xs">
                      Rate
                    </Label>
                    <Input
                      id={`rate-${item.id}`}
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.rate}
                      onChange={(event) =>
                        patchItem(item.id, { rate: Number(event.target.value) || 0 })
                      }
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Remove item"
                    disabled={items.length === 1}
                    onClick={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <span className="text-sm font-medium text-muted-foreground">Total</span>
              <span className="tabular font-display text-lg font-semibold">
                {formatAmount(total, currency)}
              </span>
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
            <h2 className="text-base font-semibold">Payment &amp; dates</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="SOL">SOL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="issueDate">Issue date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={issueDate}
                  onChange={(event) => setIssueDate(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dueDate">Due date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Live preview
          </p>
          <InvoicePreview
            data={{
              number,
              fromName: profile.businessName,
              fromEmail: profile.email,
              clientName,
              clientEmail,
              issueDate,
              dueDate,
              items,
              currency,
              notes,
            }}
          />
        </aside>
      </div>
    </AppShell>
  );
}
