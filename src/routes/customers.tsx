import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search, Users } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/app-store";
import { formatMoney } from "@/lib/format";

export const Route = createFileRoute("/customers")({
  head: () => ({
    meta: [
      { title: "Clients — Payvolae" },
      {
        name: "description",
        content: "See every client you invoice, how much they've been billed and their history.",
      },
      { property: "og:title", content: "Clients — Payvolae" },
      { property: "og:description", content: "Your client list and billing totals in one view." },
    ],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  const { customers } = useAppStore();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(q) || customer.email.toLowerCase().includes(q),
    );
  }, [customers, query]);

  return (
    <AppShell>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold sm:text-2xl">Clients</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {customers.length} client{customers.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/invoices/new">
            <Plus className="size-4" />
            New invoice
          </Link>
        </Button>
      </div>

      <div className="relative mt-6">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search clients"
          className="pl-9"
          aria-label="Search clients"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          className="mt-5"
          icon={Users}
          title="No clients found"
          description="Clients are added automatically when you create an invoice."
        />
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((customer) => (
            <article key={customer.id} className="rounded-2xl border bg-card p-5 shadow-card">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-sm font-bold text-secondary-foreground">
                  {customer.name.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold">{customer.name}</h2>
                  <p className="truncate text-xs text-muted-foreground">{customer.email}</p>
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 border-t pt-4 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Invoices</dt>
                  <dd className="tabular mt-0.5 font-semibold">{customer.invoices}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Total billed</dt>
                  <dd className="tabular mt-0.5 font-semibold">
                    {formatMoney(customer.totalBilled)}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </AppShell>
  );
}
