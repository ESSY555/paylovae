import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Plus, Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { InvoiceTable } from "@/components/invoices/InvoiceTable";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/app-store";
import { invoiceTotal } from "@/lib/format";
import type { InvoiceStatus } from "@/lib/types";

export const Route = createFileRoute("/invoices/")({
  head: () => ({
    meta: [
      { title: "Invoices — Payvolae" },
      {
        name: "description",
        content: "Search, filter and manage every invoice you've sent with Payvolae.",
      },
      { property: "og:title", content: "Invoices — Payvolae" },
      {
        property: "og:description",
        content: "All your crypto invoices in one searchable place.",
      },
    ],
  }),
  component: InvoicesPage,
});

const STATUSES: (InvoiceStatus | "all")[] = ["all", "paid", "pending", "overdue", "draft"];
type SortKey = "newest" | "oldest" | "amount";

function InvoicesPage() {
  const { invoices } = useAppStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<InvoiceStatus | "all">("all");
  const [sort, setSort] = useState<SortKey>("newest");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = invoices.filter((invoice) => {
      const matchesStatus = status === "all" || invoice.status === status;
      const matchesQuery =
        q.length === 0 ||
        invoice.number.toLowerCase().includes(q) ||
        invoice.clientName.toLowerCase().includes(q) ||
        invoice.clientEmail.toLowerCase().includes(q) ||
        invoice.description.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
    return [...list].sort((a, b) => {
      if (sort === "amount") return invoiceTotal(b) - invoiceTotal(a);
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sort === "newest" ? diff : -diff;
    });
  }, [invoices, query, status, sort]);

  return (
    <AppShell>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold sm:text-2xl">Invoices</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {invoices.length} total · {filtered.length} shown
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/invoices/new">
            <Plus className="size-4" />
            Create Invoice
          </Link>
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search invoice, client or description"
            className="pl-9"
            aria-label="Search invoices"
          />
        </div>
        <Select value={status} onValueChange={(value) => setStatus(value as InvoiceStatus | "all")}>
          <SelectTrigger className="sm:w-40" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((option) => (
              <SelectItem key={option} value={option} className="capitalize">
                {option === "all" ? "All statuses" : option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
          <SelectTrigger className="sm:w-40" aria-label="Sort invoices">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="amount">Highest amount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5">
        {filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No invoices match your filters"
            description="Try a different search term or reset the status filter."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setStatus("all");
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="rounded-2xl border bg-card shadow-card">
            <InvoiceTable invoices={filtered} columns={["description", "dueDate", "created"]} />
          </div>
        )}
      </div>
    </AppShell>
  );
}
