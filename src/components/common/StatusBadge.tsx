import { cn } from "@/lib/utils";
import type { InvoiceStatus } from "@/lib/types";

const STYLES: Record<InvoiceStatus, string> = {
  paid: "bg-success/10 text-success border-success/25",
  pending: "bg-warning/12 text-warning-foreground border-warning/35",
  overdue: "bg-destructive/10 text-destructive border-destructive/25",
  draft: "bg-muted text-muted-foreground border-border",
};

const LABELS: Record<InvoiceStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
  draft: "Draft",
};

export function StatusBadge({
  status,
  className,
  uppercase = false,
}: {
  status: InvoiceStatus;
  className?: string;
  uppercase?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        STYLES[status],
        uppercase && "tracking-wider uppercase",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {LABELS[status]}
    </span>
  );
}
