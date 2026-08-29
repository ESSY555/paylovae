export function paymentLink(invoiceId: string) {
  const origin = typeof window === "undefined" ? "https://payvolae.app" : window.location.origin;
  return `${origin}/pay/${invoiceId}`;
}
