import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function classMerge(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(...inputs))
}
