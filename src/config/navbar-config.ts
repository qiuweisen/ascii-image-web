import type { MenuItemConfig } from '../types';
import { Routes } from '@/lib/routes';

/** Public navigation for the focused ASCII Image tool. */
export function getNavbarLinks(): MenuItemConfig[] {
  return [
    { title: 'Line Art', href: '/line-art', external: false },
    { title: 'Privacy', href: Routes.PrivacyPolicy, external: false },
  ];
}
