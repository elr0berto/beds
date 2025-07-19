import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// return something like 15:20 equivalent to HH:mm
export function date2Time(date: Date) : string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// a function that takes 3 parameters: startDate, endDate, max length and returns the percentage of the time between startDate and endDate that is within the max length
export function calculatePercentage(statStart: Date, statEnd: Date, schedStart: Date, schedEnd: Date): number {
  const statDuration = statEnd.getTime() - statStart.getTime();
  const schedDuration = schedEnd.getTime() - schedStart.getTime();

  return (statDuration / schedDuration) * 100;
}

export function calculateOffset(statStart: Date, schedStart: Date, schedEnd: Date): number {
    const schedDuration = schedEnd.getTime() - schedStart.getTime();
    const offset = statStart.getTime() - schedStart.getTime();

    return (offset / schedDuration) * 100;
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
