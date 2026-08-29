import { Link } from "@tanstack/react-router";
import { Download, Eye, Link2, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatAmount, formatDate, invoiceTotal } from "@/lib/format";
import { paymentLink } from "@/lib/links";
import type { Invoice } from "@/lib/types";

type Column = "description" | "dueDate" | "created";

export function InvoiceTable({
  invoices,
  columns = [],
}: {
  invoices: Invoice[];
  columns?: Column[];
}) {
  const show = (c: Column) => columns.includes(c);

  async function copyLink(invoice: Invoice) {
    try {
      await navigator.clipboard.writeText(paymentLink(invoice.id));
      toast.success("Payment link copied");
    } catch {
      toast.error("Couldn't access the clipboard");
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[46rem] border-collapse text-sm">
        <thead>
          <tr className="border-b text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <th className="px-4 py-3 font-semibold">Invoice</th>
            <th className="px-4 py-3 font-semibold">Client</th>
            {show("description") ? <th className="px-4 py-3 font-semibold">Description</th> : null}
            <th className="px-4 py-3 font-semibold">Amount</th>
            {show("dueDate") ? <th className="px-4 py-3 font-semibold">Due date</th> : null}
            <th className="px-4 py-3 font-semibold">{show("created") ? "Created" : "Date"}</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 text-right font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-b last:border-0 transition-colors hover:bg-secondary/50">
              <td className="px-4 py-3.5">
                <Link
                  to="/invoices/$invoiceId"
                  params={{ invoiceId: invoice.id }}
                  className="tabular font-semibold text-foreground underline-offset-4 hover:underline"
                >
                  {invoice.number}
                </Link>
              </td>
              <td className="px-4 py-3.5">
                <span className="block font-medium">{invoice.clientName}</span>
                <span className="block text-xs text-muted-foreground">{invoice.clientEmail}</span>
              </td>
              {show("description") ? (
                <td className="max-w-[14rem] truncate px-4 py-3.5 text-muted-foreground">
                  {invoice.description}
                </td>
              ) : null}
              <td className="tabular whitespace-nowrap px-4 py-3.5 font-semibold">
                {formatAmount(invoiceTotal(invoice), invoice.currency)}
              </td>
              {show("dueDate") ? (
                <td className="tabular whitespace-nowrap px-4 py-3.5 text-muted-foreground">
                  {formatDate(invoice.dueDate)}
                </td>
              ) : null}
              <td className="tabular whitespace-nowrap px-4 py-3.5 text-muted-foreground">
                {formatDate(show("created") ? invoice.createdAt : invoice.issueDate)}
              </td>
              <td className="px-4 py-3.5">
                <StatusBadge status={invoice.status} />
              </td>
              <td className="px-4 py-3.5 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button asChild variant="ghost" size="icon" aria-label="View invoice">
                    <Link to="/invoices/$invoiceId" params={{ invoiceId: invoice.id }}>
                      <Eye className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Copy payment link"
                    onClick={() => copyLink(invoice)}
                  >
                    <Link2 className="size-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="More actions">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => window.print()}>
                        <Download className="size-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => copyLink(invoice)}>
                        <Link2 className="size-4" />
                        Copy payment link
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/pay/$invoiceId" params={{ invoiceId: invoice.id }}>
                          <Eye className="size-4" />
                          Open payment page
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
