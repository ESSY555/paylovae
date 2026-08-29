import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CopyButton({
  value,
  label = "Copied to clipboard",
  className,
  variant = "outline",
  size = "icon",
  children,
}: {
  value: string;
  label?: string;
  className?: string;
  variant?: "outline" | "ghost" | "secondary" | "default";
  size?: "icon" | "sm" | "default";
  children?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      toast.error("Couldn't access the clipboard");
      return;
    }
    setCopied(true);
    toast.success(label);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={copy}
      className={cn(className)}
      aria-label="Copy"
    >
      {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
      {children}
    </Button>
  );
}
