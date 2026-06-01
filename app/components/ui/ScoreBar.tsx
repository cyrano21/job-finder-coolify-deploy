import { cn } from '@/app/lib/utils'

interface ScoreBarProps {
  label: string
  value: number // 0-100
  className?: string
  tone?: 'brand' | 'light'
}

/**
 * Barre de score réutilisable (0-100). 'light' pour fond coloré (texte clair),
 * 'brand' pour fond clair (barre indigo).
 */
export function ScoreBar({ label, value, className, tone = 'brand' }: ScoreBarProps) {
  const v = Math.max(0, Math.min(100, value))
  const isLight = tone === 'light'
  return (
    <div className={className}>
      <div
        className={cn(
          'flex justify-between text-xs mb-1',
          isLight ? 'text-white/80' : 'text-gray-500'
        )}
      >
        <span>{label}</span>
        <span className="font-semibold">{v}/100</span>
      </div>
      <div
        className={cn(
          'h-2 rounded-full overflow-hidden',
          isLight ? 'bg-white/20' : 'bg-gray-100'
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isLight ? 'bg-white' : 'bg-brand-gradient'
          )}
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  )
}
