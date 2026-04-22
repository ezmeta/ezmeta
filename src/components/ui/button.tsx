import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onMouseMove, onMouseLeave, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      const maxOffset = 8;
      const clampedX = Math.max(-maxOffset, Math.min(maxOffset, x * 0.18));
      const clampedY = Math.max(-maxOffset, Math.min(maxOffset, y * 0.18));
      target.style.setProperty("--magnetic-x", `${clampedX}px`);
      target.style.setProperty("--magnetic-y", `${clampedY}px`);
      onMouseMove?.(event);
    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLButtonElement>) => {
      const target = event.currentTarget;
      target.style.setProperty("--magnetic-x", "0px");
      target.style.setProperty("--magnetic-y", "0px");
      onMouseLeave?.(event);
    };

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          "transform-gpu [transform:translate3d(var(--magnetic-x,0px),var(--magnetic-y,0px),0)]"
        )}
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={style}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
