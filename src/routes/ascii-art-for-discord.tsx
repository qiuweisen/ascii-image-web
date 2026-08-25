import { createFileRoute } from '@tanstack/react-router';
import { AsciiScenePage } from '@/components/ascii/ascii-scene-page';
import { m } from '@/locale/paraglide/messages';
import { seo, softwareApplicationJsonLd } from '@/lib/seo';

export const Route = createFileRoute('/ascii-art-for-discord')({
  head: () => {
    const title = m.ascii_scene_discord_title();
    const description = m.ascii_scene_discord_description();
    return {
      ...seo('/ascii-art-for-discord', { title, description }),
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(
            softwareApplicationJsonLd({
              path: '/ascii-art-for-discord',
              name: title,
              description,
            })
          ),
        },
      ],
    };
  },
  component: DiscordAsciiPage,
});

function DiscordAsciiPage() {
  return (
    <AsciiScenePage
      kicker={m.ascii_scene_discord_kicker()}
      title={m.ascii_scene_discord_title()}
      lede={m.ascii_scene_discord_lede()}
      presetId="discord"
      guideTitle={m.ascii_scene_discord_how_title()}
      exampleTitle={m.ascii_scene_discord_example_title()}
      exampleBody={m.ascii_scene_discord_example_body()}
      exampleCode={m.ascii_scene_discord_example_code()}
      steps={[
        {
          title: m.ascii_scene_discord_step_1_title(),
          body: m.ascii_scene_discord_step_1_body(),
        },
        {
          title: m.ascii_scene_discord_step_2_title(),
          body: m.ascii_scene_discord_step_2_body(),
        },
        {
          title: m.ascii_scene_discord_step_3_title(),
          body: m.ascii_scene_discord_step_3_body(),
        },
      ]}
    />
  );
}
