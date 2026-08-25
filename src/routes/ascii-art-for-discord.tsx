import { createFileRoute } from '@tanstack/react-router';
import { AsciiScenePage } from '@/components/ascii/ascii-scene-page';
import { m } from '@/locale/paraglide/messages';
import { seo } from '@/lib/seo';

export const Route = createFileRoute('/ascii-art-for-discord')({
  head: () =>
    seo('/ascii-art-for-discord', {
      title: m.ascii_scene_discord_title(),
      description: m.ascii_scene_discord_description(),
    }),
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
