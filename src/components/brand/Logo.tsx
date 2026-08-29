import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none">
        <path
          d="M6 20V4h6.5a5.5 5.5 0 0 1 0 11H9.5"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function Logo({
  className,
  showTagline = false,
}: {
  className?: string;
  showTagline?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex min-w-0 flex-col leading-none">
        <span className="font-display text-[1.0625rem] font-semibold tracking-tight">
          Payvolae
        </span>
        {showTagline ? (
          <span className="mt-1 text-[0.625rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Invoices. Payments. Simplified.
          </span>
        ) : null}
      </span>
    </span>
  );
}
