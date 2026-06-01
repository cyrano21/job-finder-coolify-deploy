import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Fusionne des classes Tailwind en gérant les conflits (clsx + tailwind-merge).
 * Base du design system : tous les composants UI l'utilisent.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
