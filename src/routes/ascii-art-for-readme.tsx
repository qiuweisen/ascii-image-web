import { createFileRoute } from '@tanstack/react-router';
import { AsciiScenePage } from '@/components/ascii/ascii-scene-page';
import { m } from '@/locale/paraglide/messages';
import { seo } from '@/lib/seo';

export const Route = createFileRoute('/ascii-art-for-readme')({
  head: () =>
    seo('/ascii-art-for-readme', {
      title: m.ascii_scene_readme_title(),
      description: m.ascii_scene_readme_description(),
    }),
  component: ReadmeAsciiPage,
});

function ReadmeAsciiPage() {
  return (
    <AsciiScenePage
      kicker={m.ascii_scene_readme_kicker()}
      title={m.ascii_scene_readme_title()}
      lede={m.ascii_scene_readme_lede()}
      presetId="readme"
      guideTitle={m.ascii_scene_readme_how_title()}
      steps={[
        {
          title: m.ascii_scene_readme_step_1_title(),
          body: m.ascii_scene_readme_step_1_body(),
        },
        {
          title: m.ascii_scene_readme_step_2_title(),
          body: m.ascii_scene_readme_step_2_body(),
        },
        {
          title: m.ascii_scene_readme_step_3_title(),
          body: m.ascii_scene_readme_step_3_body(),
        },
      ]}
    />
  );
}
