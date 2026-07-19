import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "cw-interactive inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-lg)] px-6 text-button font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md",
        secondary:
          "border border-primary bg-transparent text-primary hover:bg-primary/5",
        outline:
          "border border-border bg-background text-foreground hover:bg-muted",
        ghost: "text-primary hover:bg-muted",
        luxury:
          "bg-[#0A2540] text-white hover:bg-[#0A2540]/90 shadow-editorial",
        editorial:
          "border border-accent/40 bg-surface-cream text-foreground hover:border-accent hover:bg-accent/10",
        glass:
          "border border-border/60 bg-surface-glass text-foreground shadow-glass backdrop-blur-md hover:border-primary/30",
        medical:
          "bg-primary text-primary-foreground ring-1 ring-primary/20 hover:bg-primary/90",
        /** Official WhatsApp green — use for WhatsApp CTAs site-wide */
        whatsapp:
          "bg-[#25D366] text-white hover:bg-[#1ebe57] shadow-sm hover:shadow-md",
        /** Outline call action — pair with Phone icon */
        call: "border border-border bg-background text-foreground hover:bg-muted hover:border-primary/40",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-small",
        lg: "h-12 px-8",
        xl: "h-14 px-10 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
