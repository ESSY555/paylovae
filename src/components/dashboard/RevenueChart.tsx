import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { REVENUE_SERIES } from "@/lib/mock-data";
import { formatMoney } from "@/lib/format";

export function RevenueChart() {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold">Revenue</h2>
          <p className="text-sm text-muted-foreground">Last 30 days</p>
        </div>
        <p className="tabular font-display text-xl font-semibold">
          {formatMoney(REVENUE_SERIES.reduce((s, p) => s + p.amount, 0))}
        </p>
      </div>
      <div className="mt-5 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={REVENUE_SERIES} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--color-border)" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              interval="preserveStartEnd"
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--color-border)",
                background: "var(--color-card)",
                fontSize: 12,
              }}
              formatter={(value) => [formatMoney(Number(value)), "Revenue"]}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#revenueFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
