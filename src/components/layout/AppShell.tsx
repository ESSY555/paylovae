import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  CreditCard,
  Users,
  Settings,
  Menu,
  Wallet,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { WalletModal } from "@/components/wallet/WalletModal";
import { useAppStore } from "@/lib/app-store";
import { truncateMiddle } from "@/lib/format";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "Invoices", to: "/invoices", icon: FileText },
  { label: "Create Invoice", to: "/invoices/new", icon: PlusCircle },
  { label: "Payments", to: "/payments", icon: CreditCard },
  { label: "Customers", to: "/customers", icon: Users },
  { label: "Settings", to: "/settings", icon: Settings },
] as const;

function WalletCard() {
  const { wallet, disconnectWalletState } = useAppStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border bg-card p-3">
      <div className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        <Wallet className="size-3.5" />
        Wallet
      </div>
      {wallet.connected && wallet.address ? (
        <div className="mt-2.5">
          <p className="tabular truncate text-sm font-semibold">
            {truncateMiddle(wallet.address, 3, 4)}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-success">
            <span className="size-1.5 rounded-full bg-success" />
            Connected
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 h-7 w-full justify-start px-2 text-xs text-muted-foreground"
            onClick={disconnectWalletState}
          >
            <LogOut className="size-3.5" />
            Disconnect
          </Button>
        </div>
      ) : (
        <div className="mt-2.5">
          <p className="text-xs text-muted-foreground">No wallet connected</p>
          <Button size="sm" className="mt-2 h-8 w-full text-xs" onClick={() => setOpen(true)}>
            Connect wallet
          </Button>
        </div>
      )}
      <WalletModal open={open} onOpenChange={setOpen} />
    </div>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active =
          item.to === "/invoices"
            ? pathname === "/invoices" || /^\/invoices\/(?!new)/.test(pathname)
            : pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className={cn("size-4 shrink-0", active && "text-primary")} />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-semibold sm:text-2xl">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground sm:truncate">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-sidebar px-4 py-5 lg:flex">
        <Link to="/" className="px-1">
          <Logo />
        </Link>
        <div className="mt-7 flex-1 overflow-y-auto">
          <NavLinks />
        </div>
        <div className="pt-4">
          <WalletCard />
        </div>
      </aside>

      <div className="lg:pl-64">
        <div className="flex h-14 items-center gap-3 border-b bg-sidebar px-4 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar p-4">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Link to="/" className="px-1" onClick={() => setMobileOpen(false)}>
                <Logo />
              </Link>
              <div className="mt-7">
                <NavLinks onNavigate={() => setMobileOpen(false)} />
              </div>
              <div className="mt-6">
                <WalletCard />
              </div>
            </SheetContent>
          </Sheet>
          <Logo />
        </div>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
