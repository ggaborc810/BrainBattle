import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GameButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "accent" | "danger" | "neutral" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

export const GameButton = React.forwardRef<HTMLButtonElement, GameButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-primary-foreground shadow-primary/40",
      secondary: "bg-secondary text-secondary-foreground shadow-secondary/40",
      accent: "bg-accent text-accent-foreground shadow-accent/40",
      danger: "bg-destructive text-destructive-foreground shadow-destructive/40",
      neutral: "bg-white text-slate-700 shadow-slate-200 border-2 border-slate-100",
      ghost: "bg-transparent text-slate-600 shadow-none hover:bg-slate-100",
    };

    const sizes = {
      sm: "text-sm px-4 py-2 rounded-lg",
      md: "text-base px-6 py-3 rounded-xl",
      lg: "text-lg px-8 py-4 rounded-2xl",
      xl: "text-xl md:text-2xl px-10 py-5 rounded-3xl",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95, y: 0 }}
        className={cn(
          "font-display font-bold shadow-lg transition-colors relative overflow-hidden",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
GameButton.displayName = "GameButton";
