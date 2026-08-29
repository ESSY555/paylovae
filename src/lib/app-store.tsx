import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_PROFILE,
  MOCK_CUSTOMERS,
  MOCK_INVOICES,
  MOCK_PAYMENTS,
} from "./mock-data";
import { invoiceTotal } from "./format";
import type {
  Customer,
  Invoice,
  InvoiceStatus,
  Payment,
  Profile,
  WalletProviderId,
  WalletState,
} from "./types";

const STORAGE_KEY = "payvolae.state.v1";

type PersistedState = {
  invoices: Invoice[];
  payments: Payment[];
  customers: Customer[];
  profile: Profile;
  wallet: WalletState;
};

const initialState: PersistedState = {
  invoices: MOCK_INVOICES,
  payments: MOCK_PAYMENTS,
  customers: MOCK_CUSTOMERS,
  profile: DEFAULT_PROFILE,
  wallet: { connected: false, address: null, provider: null },
};

type Store = PersistedState & {
  hydrated: boolean;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, patch: Partial<Invoice>) => void;
  markInvoicePaid: (id: string, txSignature: string) => void;
  getInvoice: (idOrNumber: string) => Invoice | undefined;
  nextInvoiceNumber: () => string;
  setProfile: (patch: Partial<Profile>) => void;
  connectWalletState: (address: string, provider: WalletProviderId) => void;
  disconnectWalletState: () => void;
  stats: {
    totalRevenue: number;
    outstanding: number;
    paidCount: number;
    pendingCount: number;
  };
};

const StoreContext = createContext<Store | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as PersistedState) });
    } catch {
      /* ignore corrupted state */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state, hydrated]);

  const addInvoice = useCallback((invoice: Invoice) => {
    setState((prev) => {
      const exists = prev.customers.some(
        (c) => c.email.toLowerCase() === invoice.clientEmail.toLowerCase(),
      );
      const total = invoiceTotal(invoice);
      return {
        ...prev,
        invoices: [invoice, ...prev.invoices],
        customers: exists
          ? prev.customers.map((c) =>
              c.email.toLowerCase() === invoice.clientEmail.toLowerCase()
                ? { ...c, invoices: c.invoices + 1, totalBilled: c.totalBilled + total }
                : c,
            )
          : [
              {
                id: `c-${invoice.id}`,
                name: invoice.clientName,
                email: invoice.clientEmail,
                invoices: 1,
                totalBilled: total,
              },
              ...prev.customers,
            ],
      };
    });
  }, []);

  const updateInvoice = useCallback((id: string, patch: Partial<Invoice>) => {
    setState((prev) => ({
      ...prev,
      invoices: prev.invoices.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    }));
  }, []);

  const markInvoicePaid = useCallback((id: string, txSignature: string) => {
    setState((prev) => {
      const invoice = prev.invoices.find((i) => i.id === id);
      const paidAt = new Date().toISOString().slice(0, 10);
      if (!invoice) return prev;
      const alreadyRecorded = prev.payments.some((p) => p.txSignature === txSignature);
      return {
        ...prev,
        invoices: prev.invoices.map((i) =>
          i.id === id
            ? ({ ...i, status: "paid" as InvoiceStatus, txSignature, paidAt } as Invoice)
            : i,
        ),
        payments: alreadyRecorded
          ? prev.payments
          : [
              {
                id: `p-${txSignature.slice(0, 6)}`,
                invoiceNumber: invoice.number,
                clientName: invoice.clientName,
                amount: invoiceTotal(invoice),
                currency: invoice.currency,
                date: paidAt,
                txSignature,
              },
              ...prev.payments,
            ],
      };
    });
  }, []);

  const getInvoice = useCallback(
    (idOrNumber: string) =>
      state.invoices.find(
        (i) => i.id === idOrNumber || i.number.toLowerCase() === idOrNumber.toLowerCase(),
      ),
    [state.invoices],
  );

  const nextInvoiceNumber = useCallback(() => {
    const numbers = state.invoices
      .map((i) => Number.parseInt(i.number.replace(/\D/g, ""), 10))
      .filter((n) => Number.isFinite(n));
    const next = (numbers.length ? Math.max(...numbers) : 100) + 1;
    return `${state.profile.invoicePrefix}-${String(next).padStart(5, "0")}`;
  }, [state.invoices, state.profile.invoicePrefix]);

  const setProfile = useCallback((patch: Partial<Profile>) => {
    setState((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } }));
  }, []);

  const connectWalletState = useCallback((address: string, provider: WalletProviderId) => {
    setState((prev) => ({ ...prev, wallet: { connected: true, address, provider } }));
  }, []);

  const disconnectWalletState = useCallback(() => {
    setState((prev) => ({ ...prev, wallet: { connected: false, address: null, provider: null } }));
  }, []);

  const stats = useMemo(() => {
    const paid = state.invoices.filter((i) => i.status === "paid");
    const open = state.invoices.filter((i) => i.status === "pending" || i.status === "overdue");
    return {
      totalRevenue: paid.reduce((sum, i) => sum + invoiceTotal(i), 0),
      outstanding: open.reduce((sum, i) => sum + invoiceTotal(i), 0),
      paidCount: paid.length,
      pendingCount: open.length,
    };
  }, [state.invoices]);

  const value: Store = {
    ...state,
    hydrated,
    addInvoice,
    updateInvoice,
    markInvoicePaid,
    getInvoice,
    nextInvoiceNumber,
    setProfile,
    connectWalletState,
    disconnectWalletState,
    stats,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useAppStore must be used inside AppStoreProvider");
  return ctx;
}
