import { websiteConfig } from '@/config/website';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  const name = websiteConfig.metadata?.name ?? 'ASCII Image';
  const logo =
    websiteConfig.metadata?.images?.logoDark ?? '/logo-generated.webp';

  return (
    <img
      src={logo}
      alt={`${name} logo`}
      className={cn('size-8 shrink-0 rounded-md object-cover', className)}
      width={32}
      height={32}
      decoding="async"
    />
  );
}
