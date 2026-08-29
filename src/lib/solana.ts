import type { WalletProviderId } from "./types";

/**
 * Mock Solana layer.
 * Every function here is a seam: swap the body for a real wallet adapter
 * (@solana/wallet-adapter-react) + RPC calls without touching the UI.
 */

export const WALLET_PROVIDERS: {
  id: WalletProviderId;
  name: string;
  hint: string;
  initials: string;
}[] = [
  { id: "phantom", name: "Phantom", hint: "Detected", initials: "Ph" },
  { id: "solflare", name: "Solflare", hint: "Popular", initials: "Sf" },
  { id: "backpack", name: "Backpack", hint: "Installed", initials: "Bp" },
];

const ADDRESSES: Record<WalletProviderId, string> = {
  phantom: "7xKq3nVfPzD8sYtLbRcW1uHg5AeM4Jd92Lm",
  solflare: "4mDp9sQzTnR2yLwBcXv1AeK6sMf5Gh81Nb",
  backpack: "9cTr5vLmPzN8sYtKbWcQ1uHg3AeD7Jf64Zx",
};

export async function connectWallet(provider: WalletProviderId): Promise<string> {
  await delay(700);
  return ADDRESSES[provider];
}

export async function disconnectWallet(): Promise<void> {
  await delay(200);
}

/** Simulates sending a transfer and returns a transaction signature. */
export async function sendPayment(): Promise<string> {
  await delay(900);
  return randomSignature();
}

/** Simulates polling the chain until the transfer is confirmed. */
export async function confirmPayment(): Promise<{ confirmed: true; slot: number }> {
  await delay(3200);
  return { confirmed: true, slot: 298_411_204 };
}

export function explorerUrl(signature: string) {
  return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
}

/** Solana Pay style URI — already the real format. */
export function solanaPayUri(recipient: string, amount: number, label: string, memo: string) {
  const params = new URLSearchParams({
    amount: String(amount),
    label,
    message: memo,
  });
  return `solana:${recipient}?${params.toString()}`;
}

function randomSignature() {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let out = "";
  for (let i = 0; i < 34; i += 1) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
