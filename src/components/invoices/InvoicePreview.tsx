import { LogoMark } from "@/components/brand/Logo";
import { formatDate, formatMoney, invoiceTotal, itemAmount } from "@/lib/format";
import type { Currency, LineItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export type PreviewData = {
  number: string;
  fromName: string;
  fromEmail: string;
  clientName: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  items: LineItem[];
  currency: Currency;
  notes?: string;
  networkFee?: number;
};

export function InvoicePreview({
  data,
  className,
  showFee = false,
}: {
  data: PreviewData;
  className?: string;
  showFee?: boolean;
}) {
  const subtotal = invoiceTotal({ items: data.items });
  const fee = showFee ? (data.networkFee ?? 0.0002) : 0;

  return (
    <article className={cn("rounded-2xl border bg-card p-6 shadow-card sm:p-8", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Payvolae
          </span>
        </div>
        <div className="text-right">
          <p className="font-display text-lg font-semibold">Invoice</p>
          <p className="tabular text-sm text-muted-foreground">#{data.number}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            From
          </p>
          <p className="mt-1.5 text-sm font-semibold">{data.fromName || "Your name"}</p>
          <p className="text-sm text-muted-foreground">{data.fromEmail}</p>
        </div>
        <div className="sm:text-right">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Bill to
          </p>
          <p className="mt-1.5 text-sm font-semibold">{data.clientName || "Client name"}</p>
          <p className="text-sm text-muted-foreground">{data.clientEmail || "client@email.com"}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 rounded-xl bg-secondary/60 px-4 py-3 sm:grid-cols-3">
        <Meta label="Issue date" value={data.issueDate ? formatDate(data.issueDate) : "—"} />
        <Meta label="Due date" value={data.dueDate ? formatDate(data.dueDate) : "—"} />
        <Meta label="Currency" value={data.currency} />
      </div>

      <div className="mt-7">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b pb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <span>Description</span>
          <span className="text-right">Amount</span>
        </div>
        <ul className="divide-y">
          {data.items.length === 0 ? (
            <li className="py-4 text-sm text-muted-foreground">No items yet.</li>
          ) : null}
          {data.items.map((item) => (
            <li key={item.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 py-3">
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">
                  {item.description || "Untitled item"}
                </span>
                <span className="tabular block text-xs text-muted-foreground">
                  {item.quantity} × {formatMoney(item.rate)}
                </span>
              </span>
              <span className="tabular text-right text-sm font-semibold">
                {formatMoney(itemAmount(item))}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 space-y-2 border-t pt-4 text-sm">
        <Row label="Subtotal" value={formatMoney(subtotal)} />
        {showFee ? (
          <Row label="Network fee" value={`${fee.toFixed(4)} SOL`} muted />
        ) : null}
        <div className="flex items-center justify-between border-t pt-3">
          <span className="font-semibold">Total</span>
          <span className="tabular font-display text-lg font-semibold">
            {formatMoney(subtotal)} {data.currency}
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-secondary/50 px-4 py-3">
        <span className="text-xs font-medium text-muted-foreground">Payment method</span>
        <span className="text-sm font-semibold">Solana · {data.currency}</span>
      </div>

      {data.notes ? (
        <p className="mt-5 text-sm text-muted-foreground">{data.notes}</p>
      ) : null}
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="tabular mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn(muted ? "text-muted-foreground" : "text-muted-foreground")}>{label}</span>
      <span className="tabular font-medium">{value}</span>
    </div>
  );
}
