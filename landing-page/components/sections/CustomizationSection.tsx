import { Check, Palette, Shapes } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { InlineThemeSelector } from '@/components/theme/InlineThemeSelector';

const themes = [
  { name: 'Aurora', primary: '#163c69', accent: '#8ec5ff', surface: '#eaf4ff' },
  { name: 'Terracota', primary: '#69362c', accent: '#e79578', surface: '#fff0e9' },
  { name: 'Origem', primary: '#123c2f', accent: '#7fc9a8', surface: '#e8f5ee' },
];

export function CustomizationSection() {
  return (
    <section className="section customization-section" aria-labelledby="customization-title">
      <div className="container">
        <Reveal>
          <div className="customization-heading-grid">
            <SectionHeading
              id="customization-title"
              eyebrow="Adaptabilidade"
              title="Seu sistema com a sua cara."
              text="Cores, logo e elementos visuais podem aproximar a SARA da identidade da contratante. A experiência fica mais familiar para colaboradores, gestores e RH, reduzindo a sensação de uso de uma ferramenta externa."
            />
            <div className="customization-note">
              <Palette size={19} strokeWidth={1.6} aria-hidden="true" />
              <div>
                <p><strong>A inteligência continua sendo SARA.</strong> A identidade visual pode acompanhar o ecossistema da sua empresa.</p>
                <InlineThemeSelector />
              </div>
            </div>
          </div>
        </Reveal>
        <div className="theme-showcase">
          {themes.map((theme, index) => (
            <Reveal delay={index * 90} key={theme.name}>
              <article
                className="theme-card"
                style={{
                  '--theme-primary': theme.primary,
                  '--theme-accent': theme.accent,
                  '--theme-surface': theme.surface,
                } as React.CSSProperties}
              >
                <div className="theme-browser">
                  <div className="theme-bar"><i /><i /><i /><span>{theme.name}</span></div>
                  <div className="theme-interface">
                    <aside><b>S</b><i /><i /><i /></aside>
                    <div className="theme-content">
                      <div className="theme-title"><span /><small /></div>
                      <div className="theme-metrics"><i /><i /><i /></div>
                      <div className="theme-chart"><span /><span /><span /><span /><span /></div>
                    </div>
                  </div>
                </div>
                <div className="theme-meta">
                  <div><Shapes size={16} aria-hidden="true" /><strong>Tema {theme.name}</strong></div>
                  <span><Check size={11} strokeWidth={3} aria-hidden="true" /> Identidade aplicada</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
