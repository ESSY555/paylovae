import type { Currency, Invoice, LineItem } from "./types";

export function itemAmount(item: LineItem) {
  return item.quantity * item.rate;
}

export function invoiceTotal(invoice: Pick<Invoice, "items">) {
  return invoice.items.reduce((sum, item) => sum + itemAmount(item), 0);
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatAmount(value: number, currency: Currency) {
  return `${formatMoney(value)} ${currency}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatLongDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function truncateMiddle(value: string, start = 3, end = 4) {
  if (value.length <= start + end + 1) return value;
  return `${value.slice(0, start)}...${value.slice(-end)}`;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
