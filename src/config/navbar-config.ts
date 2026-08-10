import type { MenuItemConfig } from '../types';
import { Routes } from '@/lib/routes';
import { m } from '@/locale/paraglide/messages';

/** Public navigation for the focused ASCII Image tool. */
export function getNavbarLinks(): MenuItemConfig[] {
  return [
    { title: m.ascii_nav_line_art(), href: '/line-art', external: false },
    {
      title: m.ascii_nav_privacy(),
      href: Routes.PrivacyPolicy,
      external: false,
    },
  ];
}
