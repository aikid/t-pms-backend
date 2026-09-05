import { Activity, AlertTriangle, BarChart3, FileUser, ListChecks, Sparkles } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

const indicators = [
  { icon: ListChecks, value: '56', title: 'Pendências', text: 'Saiba quais avaliações ainda precisam de ação e quem envolver.' },
  { icon: AlertTriangle, value: '03', title: 'Divergências', text: 'Identifique desalinhamentos entre notas, comentários e critérios.' },
  { icon: BarChart3, value: 'Pré / pós', title: 'Curva da sala', text: 'Visualize a distribuição antes e depois da calibração.' },
  { icon: FileUser, value: '360º', title: 'Dossiê do colaborador', text: 'Consulte histórico, evidências, avaliações e comentários.' },
  { icon: Activity, value: '86%', title: 'Status do ciclo', text: 'Acompanhe o avanço por área, sala, gestor e etapa.' },
  { icon: Sparkles, value: '08', title: 'Alertas da IA', text: 'Veja pontos que merecem análise e revisão humana.' },
];

export function RealtimeIndicatorsSection() {
  return (
    <section className="section realtime-section" id="indicadores" aria-labelledby="realtime-title">
      <div className="container">
        <Reveal>
          <div className="realtime-heading">
            <SectionHeading
              id="realtime-title"
              eyebrow="Data driven em tempo real"
              title="Indicadores para conduzir o ciclo — não apenas observá-lo."
              text="Acompanhe salas, pendências, divergências, distribuição de notas, curva pré e pós-calibração e evolução do ciclo. A SARA ajuda RH e gestores a entender onde agir e quais decisões precisam de mais evidência."
            />
            <p>Mais clareza operacional para priorizar ações, envolver as pessoas certas e registrar decisões ao longo de todo o ciclo.</p>
          </div>
        </Reveal>
        <div className="realtime-grid">
          {indicators.map(({ icon: Icon, value, title, text }, index) => (
            <Reveal delay={index * 55} key={title}>
              <article className="realtime-card">
                <div className="realtime-card-top"><span><Icon size={18} strokeWidth={1.6} aria-hidden="true" /></span><strong>{value}</strong></div>
                <h3>{title}</h3><p>{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
