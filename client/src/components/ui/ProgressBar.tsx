import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  className?: string;
  color?: string;
}

export function ProgressBar({ current, total, label, className, color = "bg-primary" }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between mb-1">
        {label && <span className="text-sm font-bold text-foreground/70">{label}</span>}
        <span className="text-sm font-bold text-foreground/50">{current}/{total}</span>
      </div>
      <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className={cn("h-full rounded-full shadow-sm", color)}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, type: "spring" }}
        />
      </div>
    </div>
  );
}
