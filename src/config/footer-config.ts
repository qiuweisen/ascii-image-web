import { m } from '@/locale/paraglide/messages';
import { Routes } from '@/lib/routes';
import type { MenuItemConfig } from '../types';

/** Focused MVP footer; template modules remain available behind feature flags. */
export function getFooterLinks(): MenuItemConfig[] {
  return [
    {
      title: m.nav_product(),
      items: [
        { title: m.common_home(), href: Routes.Root, external: false },
        {
          title: m.ascii_nav_line_art(),
          href: '/line-art',
          external: false,
        },
      ],
    },
    {
      title: m.nav_legal(),
      items: [
        {
          title: m.nav_privacy_policy_title(),
          href: Routes.PrivacyPolicy,
          external: false,
        },
        {
          title: m.nav_terms_of_service_title(),
          href: Routes.TermsOfService,
          external: false,
        },
        {
          title: m.nav_cookie_policy_title(),
          href: Routes.CookiePolicy,
          external: false,
        },
      ],
    },
  ];
}
