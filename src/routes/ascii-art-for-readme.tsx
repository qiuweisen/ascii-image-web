import { createFileRoute } from '@tanstack/react-router';
import { AsciiScenePage } from '@/components/ascii/ascii-scene-page';
import { m } from '@/locale/paraglide/messages';
import { seo, softwareApplicationJsonLd } from '@/lib/seo';

export const Route = createFileRoute('/ascii-art-for-readme')({
  head: () => {
    const title = m.ascii_scene_readme_title();
    const description = m.ascii_scene_readme_description();
    return {
      ...seo('/ascii-art-for-readme', { title, description }),
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(
            softwareApplicationJsonLd({
              path: '/ascii-art-for-readme',
              name: title,
              description,
            })
          ),
        },
      ],
    };
  },
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
      exampleTitle={m.ascii_scene_readme_example_title()}
      exampleBody={m.ascii_scene_readme_example_body()}
      exampleCode={m.ascii_scene_readme_example_code()}
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
