import { cn } from "@/lib/utils";

export interface StashCoverageBarProps {
  colorName: string;
  colorSwatch: string;
  ownedGrams: number;
  neededGrams: number;
  className?: string;
}

export function StashCoverageBar({
  colorName,
  colorSwatch,
  ownedGrams,
  neededGrams,
  className,
}: StashCoverageBarProps) {
  const percent = neededGrams === 0 ? 100 : Math.min(100, (ownedGrams / neededGrams) * 100);
  const shortfall = Math.max(0, neededGrams - ownedGrams);
  const covered = percent >= 100;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 font-medium text-text-primary">
          <span
            className="size-3 rounded-full border border-border-default"
            style={{ backgroundColor: colorSwatch }}
            aria-hidden
          />
          {colorName}
        </span>
        <span className="text-text-secondary">{Math.round(percent)}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-sunken">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-[var(--duration-slow)] ease-[var(--ease-out)]",
            covered ? "bg-success-fg" : "bg-pink-400",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-text-tertiary">
        {covered
          ? "✓ covered"
          : `need ${Math.round(shortfall)}g more`}
      </p>
    </div>
  );
}
