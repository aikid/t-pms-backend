import { Activity, BarChart3, ChartNoAxesCombined, MessageSquareMore, ScanSearch, UsersRound } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

const analytics = [
  { icon: BarChart3, title: 'Distribuição de performance', text: 'Leitura clara das notas por faixa e população.' },
  { icon: ChartNoAxesCombined, title: 'Pré e pós-calibração', text: 'Compare movimentos e ajustes ao longo do processo.' },
  { icon: ScanSearch, title: 'Mapa de inconsistências', text: 'Visualize pontos que concentram revisão e atenção.' },
  { icon: UsersRound, title: 'Área, nível e gestor', text: 'Recortes que apoiam análises mais contextualizadas.' },
  { icon: Activity, title: 'Evolução do ciclo', text: 'Acompanhe progresso, pendências e ritmo de conclusão.' },
  { icon: MessageSquareMore, title: 'Qualidade do feedback', text: 'Indicadores para elevar consistência e utilidade.' },
];

export function AnalyticsSection() {
  return (
    <section className="section analytics-section" aria-labelledby="analytics-title">
      <div className="container">
        <Reveal>
          <div className="analytics-heading-grid">
            <SectionHeading
              id="analytics-title"
              eyebrow="Dados que viram ação"
              title="Analytics para transformar avaliação em decisão."
              text="Performance, distribuição de notas, evolução, calibração, evidências e recomendações em uma visão que ajuda o RH a agir com mais contexto."
            />
            <div className="analytics-summary">
              <small>Índice de conclusão do ciclo</small>
              <div><strong>86%</strong><span>+12 p.p.</span></div>
              <div className="progress-track"><i /></div>
              <p>Visão ilustrativa para apresentação comercial.</p>
            </div>
          </div>
        </Reveal>

        <div className="analytics-layout">
          <Reveal className="analytics-chart-reveal">
            <div className="analytics-chart-card">
              <div className="chart-heading">
                <div><small>Distribuição</small><strong>Performance por faixa</strong></div>
                <span>Ciclo atual</span>
              </div>
              <div className="distribution-chart" aria-label="Gráfico ilustrativo de distribuição de performance">
                {[28, 48, 82, 64, 34].map((height, index) => (
                  <div key={height}><span style={{ height: `${height}%` }}><i>{[8, 18, 36, 27, 11][index]}%</i></span><small>{index + 1}</small></div>
                ))}
              </div>
              <div className="chart-legend"><span><i /> Antes da calibração</span><span><i /> Após calibração</span></div>
            </div>
          </Reveal>
          <div className="analytics-card-grid">
            {analytics.map(({ icon: Icon, title, text }, index) => (
              <Reveal delay={index * 50} key={title}>
                <article className="analytics-card">
                  <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
