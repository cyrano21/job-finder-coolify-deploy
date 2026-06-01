import { cn } from '@/app/lib/utils'

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('animate-shimmer rounded-lg', className)} {...props} />
  )
}
