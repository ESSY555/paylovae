import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { cn } from "@/lib/utils";

export function QrCode({
  value,
  size = 200,
  className,
}: {
  value: string;
  size?: number;
  className?: string;
}) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(value, {
      width: size * 2,
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#1b2033", light: "#ffffff" },
    })
      .then((url) => {
        if (active) setSrc(url);
      })
      .catch(() => setSrc(null));
    return () => {
      active = false;
    };
  }, [value, size]);

  return (
    <div
      className={cn(
        "grid place-items-center rounded-2xl border bg-white p-3 shadow-card",
        className,
      )}
      style={{ width: size + 24, height: size + 24 }}
    >
      {src ? (
        <img src={src} alt="Payment QR code" width={size} height={size} className="rounded-lg" />
      ) : (
        <div className="size-full animate-pulse rounded-lg bg-muted" />
      )}
    </div>
  );
}
