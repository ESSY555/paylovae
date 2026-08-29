export type Currency = "USDC" | "SOL";

export type InvoiceStatus = "paid" | "pending" | "overdue" | "draft";

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
};

export type TimelineEvent = {
  label: string;
  date: string;
  done: boolean;
};

export type Invoice = {
  id: string;
  number: string;
  clientName: string;
  clientEmail: string;
  description: string;
  items: LineItem[];
  currency: Currency;
  issueDate: string;
  dueDate: string;
  createdAt: string;
  status: InvoiceStatus;
  notes?: string;
  txSignature?: string;
  paidAt?: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  invoices: number;
  totalBilled: number;
};

export type Payment = {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  currency: Currency;
  date: string;
  txSignature: string;
};

export type WalletProviderId = "phantom" | "solflare" | "backpack";

export type WalletState = {
  connected: boolean;
  address: string | null;
  provider: WalletProviderId | null;
};

export type Profile = {
  fullName: string;
  email: string;
  businessName: string;
  businessAddress: string;
  invoicePrefix: string;
  paymentTerms: string;
  defaultCurrency: Currency;
  acceptedCurrencies: Currency[];
};
