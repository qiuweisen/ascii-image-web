import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function BuiltWithButton() {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="/"
      className={cn(
        buttonVariants({ variant: 'outline', size: 'sm' }),
        'border border-border px-4 py-4 rounded-md gap-2'
      )}
    >
      <span>ASCII</span>
      <img src="/logo-generated.webp" alt="ASCII" className="size-5" />
      <span className="font-semibold">Image</span>
    </a>
  );
}
