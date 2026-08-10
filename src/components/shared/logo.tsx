import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex size-8 shrink-0 items-center justify-center rounded-md',
        'border border-primary/40 bg-primary/10 font-mono text-xs font-semibold',
        'text-primary shadow-[0_0_18px_color-mix(in_oklab,var(--primary)_18%,transparent)]',
        className
      )}
    >
      {'>_'}
    </span>
  );
}
