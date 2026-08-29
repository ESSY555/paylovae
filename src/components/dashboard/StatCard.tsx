import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  trend,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  trend?: string;
  hint?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-muted-foreground">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="tabular mt-3 font-display text-2xl font-semibold">{value}</p>
      <div className="mt-1.5 flex items-center gap-2 text-xs">
        {trend ? (
          <span className={cn("inline-flex items-center gap-0.5 font-semibold text-success")}>
            <ArrowUpRight className="size-3.5" />
            {trend}
          </span>
        ) : null}
        {hint ? <span className="text-muted-foreground">{hint}</span> : null}
      </div>
    </div>
  );
}
