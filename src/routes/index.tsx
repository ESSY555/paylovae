import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Link2,
  QrCode as QrCodeIcon,
  ShieldCheck,
  Coins,
  Activity,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Payvolae — Get paid simply, on Solana" },
      {
        name: "description",
        content:
          "Payvolae helps freelancers and small businesses send professional invoices and get paid in SOL or USDC, with on-chain payment verification.",
      },
      { property: "og:title", content: "Payvolae — Get paid simply, on Solana" },
      {
        property: "og:description",
        content:
          "Create professional invoices, share a payment link or QR code, and get paid in SOL or USDC.",
      },
    ],
  }),
  component: LandingPage,
});

const STEPS = [
  {
    title: "Create an invoice",
    body: "Add your client, service and amount.",
    icon: FileText,
  },
  {
    title: "Share your payment link",
    body: "Send the invoice or QR code to your client.",
    icon: Link2,
  },
  {
    title: "Get paid",
    body: "Your invoice automatically updates when payment is confirmed.",
    icon: CheckCircle2,
  },
];

const FEATURES = [
  { title: "Professional invoices", body: "Clean, branded invoices your clients trust.", icon: FileText },
  { title: "SOL & USDC payments", body: "Accept stablecoins or SOL, your choice.", icon: Coins },
  { title: "Shareable payment links", body: "One link, no accounts required for clients.", icon: Link2 },
  { title: "QR code payments", body: "Scan and pay from any Solana wallet.", icon: QrCodeIcon },
  { title: "On-chain verification", body: "Every payment is matched to its transaction.", icon: ShieldCheck },
  { title: "Real-time payment status", body: "Watch invoices flip to paid automatically.", icon: Activity },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/signin">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b">
        <div className="pointer-events-none absolute inset-0 grid-backdrop opacity-60" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-success" />
              Invoices settled on Solana in seconds
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-[3.5rem]">
              Get Paid. Simply.
              <br />
              On Solana.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Create professional invoices and receive fast, transparent payments in SOL or USDC.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link to="/invoices/new">
                  Create Your First Invoice
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/dashboard">View Demo</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border bg-card p-4 shadow-lift sm:p-5">
              <div className="flex items-center justify-between border-b pb-3">
                <p className="text-sm font-semibold">Invoices</p>
                <span className="tabular text-xs text-muted-foreground">Aug 2026</span>
              </div>

              <div className="mt-4 rounded-2xl border bg-background p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="tabular text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Invoice #INV-00124
                    </p>
                    <p className="mt-1.5 truncate font-display text-base font-semibold">
                      Website Development
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-warning/35 bg-warning/12 px-2.5 py-1 text-xs font-semibold text-warning-foreground">
                    <span className="size-1.5 rounded-full bg-current" />
                    Awaiting Payment
                  </span>
                </div>
                <p className="tabular mt-6 font-display text-3xl font-semibold">$500.00 USDC</p>
                <Button className="mt-5 w-full" size="lg" asChild>
                  <Link to="/pay/$invoiceId" params={{ invoiceId: "inv-124" }}>
                    Pay Invoice
                  </Link>
                </Button>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: "Paid", value: "24" },
                  { label: "Pending", value: "5" },
                  { label: "Revenue", value: "$8.4k" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border bg-background px-3 py-2.5">
                    <p className="text-[0.6875rem] text-muted-foreground">{s.label}</p>
                    <p className="tabular mt-0.5 text-sm font-semibold">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="text-2xl font-semibold sm:text-3xl">How it works</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="rounded-2xl border bg-card p-6 shadow-card">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                    <step.icon className="size-4" />
                  </span>
                  <span className="tabular text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="max-w-2xl text-2xl font-semibold sm:text-3xl">
            Built for modern independent businesses
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-2xl border bg-card p-6 shadow-card">
                <span className="grid size-9 place-items-center rounded-lg bg-secondary text-foreground">
                  <feature.icon className="size-4" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
          <h2 className="mx-auto max-w-2xl text-2xl font-semibold sm:text-3xl">
            Start sending invoices today
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Set up your first invoice in under a minute. No monthly fees, no chasing wire transfers.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/signup">
              Create Your First Invoice
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t bg-background">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-6">
          <Logo showTagline />
          <p className="text-xs text-muted-foreground">
            © 2026 Payvolae. Payments verified on the Solana blockchain.
          </p>
        </div>
      </footer>
    </div>
  );
}
