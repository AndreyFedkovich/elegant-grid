import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function columnDividerClasses(
  show: boolean,
  options?: { omitLastReset?: boolean }
): string {
  if (!show) return '';
  return options?.omitLastReset
    ? 'border-r border-border'
    : 'border-r border-border last:border-r-0';
}
