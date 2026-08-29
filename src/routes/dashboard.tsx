import { createFileRoute, Link } from "@tanstack/react-router";
import { CircleDollarSign, Clock, FileCheck2, Plus, Wallet } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { InvoiceTable } from "@/components/invoices/InvoiceTable";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/app-store";
import { formatMoney, greeting } from "@/lib/format";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Payvolae" },
      {
        name: "description",
        content: "Track revenue, outstanding balances and recent Solana invoice payments.",
      },
      { property: "og:title", content: "Dashboard — Payvolae" },
      {
        property: "og:description",
        content: "See what you're owed and which invoices are already paid.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { invoices, stats, profile } = useAppStore();
  const recent = invoices.slice(0, 4);
  const firstName = profile.fullName.split(" ")[0] ?? "there";

  return (
    <AppShell>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold sm:text-2xl">
            {greeting()}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening with your invoices.
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/invoices/new">
            <Plus className="size-4" />
            Create Invoice
          </Link>
        </Button>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={formatMoney(stats.totalRevenue)}
          trend="+12.5%"
          hint="vs last month"
          icon={CircleDollarSign}
        />
        <StatCard
          label="Outstanding"
          value={formatMoney(stats.outstanding)}
          hint="Across open invoices"
          icon={Wallet}
        />
        <StatCard
          label="Paid Invoices"
          value={String(stats.paidCount)}
          hint="All time"
          icon={FileCheck2}
        />
        <StatCard
          label="Pending Invoices"
          value={String(stats.pendingCount)}
          hint="Awaiting payment"
          icon={Clock}
        />
      </div>

      <div className="mt-6">
        <RevenueChart />
      </div>

      <section className="mt-6">
        <div className="rounded-2xl border bg-card shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
            <h2 className="text-base font-semibold">Recent Invoices</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/invoices">View all</Link>
            </Button>
          </div>
          {recent.length === 0 ? (
            <EmptyState
              className="border-0 shadow-none"
              icon={FileCheck2}
              title="No invoices yet"
              description="Create your first invoice and start getting paid."
              action={
                <Button asChild>
                  <Link to="/invoices/new">Create Invoice</Link>
                </Button>
              }
            />
          ) : (
            <InvoiceTable invoices={recent} />
          )}
        </div>
      </section>
    </AppShell>
  );
}
