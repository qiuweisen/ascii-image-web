import { HomePage } from '@/components/blocks/homepage';
import { websiteConfig } from '@/config/website';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';
import { getLocale, localeConfig } from '@/lib/locale';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  head: () => {
    const name = websiteConfig.metadata?.name ?? '';
    const title = 'Image to ASCII - Convert Images to ASCII Art Free';
    const description =
      'Turn images into copyable ASCII art in your browser. Adjust character density, contrast, and style locally with no upload or signup.';
    const url = getCanonicalUrl('/');
    const inLanguage = localeConfig[getLocale()].hreflang;
    const webSiteJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name,
      description,
      url,
      inLanguage,
    };
    const metadata = seo('/', { title, description });
    return {
      ...metadata,
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(webSiteJsonLd),
        },
      ],
    };
  },
  component: HomePage,
});
