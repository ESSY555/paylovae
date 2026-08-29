import { useState } from "react";
import { Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WALLET_PROVIDERS, connectWallet } from "@/lib/solana";
import { useAppStore } from "@/lib/app-store";
import type { WalletProviderId } from "@/lib/types";

export function WalletModal({
  open,
  onOpenChange,
  onConnected,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnected?: (address: string) => void;
}) {
  const { connectWalletState } = useAppStore();
  const [pending, setPending] = useState<WalletProviderId | null>(null);

  async function handleConnect(provider: WalletProviderId) {
    setPending(provider);
    try {
      const address = await connectWallet(provider);
      connectWalletState(address, provider);
      toast.success("Wallet connected");
      onOpenChange(false);
      onConnected?.(address);
    } finally {
      setPending(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Connect your Solana wallet</DialogTitle>
          <DialogDescription>Connect a wallet to complete your payment.</DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-2">
          {WALLET_PROVIDERS.map((wallet) => (
            <button
              key={wallet.id}
              type="button"
              disabled={pending !== null}
              onClick={() => handleConnect(wallet.id)}
              className="flex w-full items-center gap-3 rounded-xl border bg-card px-4 py-3 text-left transition-colors hover:bg-secondary disabled:opacity-60"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-xs font-bold text-secondary-foreground">
                {wallet.initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{wallet.name}</span>
                <span className="block text-xs text-muted-foreground">{wallet.hint}</span>
              </span>
              {pending === wallet.id ? (
                <Loader2 className="size-4 shrink-0 animate-spin text-primary" />
              ) : null}
            </button>
          ))}
        </div>

        <div className="mt-3 rounded-xl bg-secondary/60 px-4 py-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Don&apos;t have a wallet?</span>{" "}
          A Solana wallet lets you hold and send USDC or SOL.{" "}
          <a
            href="https://solana.com/wallets"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
          >
            Learn how to get one
            <ExternalLink className="size-3" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
