import { ArrowRight, CircleDollarSign, FileCheck2, GitCompareArrows, TimerReset } from 'lucide-react';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

const benefits = [
  { icon: TimerReset, title: 'Menos reuniões', text: 'O fluxo avança sem depender de longos blocos simultâneos de agenda.' },
  { icon: FileCheck2, title: 'Mais rastreabilidade', text: 'Argumentos, evidências e ajustes permanecem organizados e documentados.' },
  { icon: GitCompareArrows, title: 'Visão em tempo real', text: 'Pendências, divergências e status ficam visíveis para RH e gestores.' },
  { icon: CircleDollarSign, title: 'Menor custo operacional', text: 'Menos horas indiretas de liderança, gestão e RH consumidas pelo ciclo.' },
];

export function AsyncCalibrationSection() {
  return (
    <section className="section dark-section calibration-section" id="calibracao" aria-labelledby="calibration-title">
      <div className="dark-orbit" aria-hidden="true" />
      <div className="container calibration-content">
        <Reveal>
          <div className="calibration-heading-grid">
            <SectionHeading
              id="calibration-title"
              eyebrow="O diferencial central"
              title="Menos semanas de discussão. Mais clareza para RH e gestores."
              text="A calibração assíncrona organiza salas, evidências e decisões em um fluxo data driven. As discussões deixam de depender exclusivamente de reuniões longas e se tornam mais objetivas, rastreáveis e eficientes."
              inverse
            />
            <aside className="impact-card">
              <span>Impacto observado pelo modelo</span>
              <strong>Centenas de milhares</strong>
              <p>O modelo já demonstrou potencial de economia de centenas de milhares de reais por ciclo em operações com mais de mil colaboradores.</p>
              <small>Potencial demonstrado — não representa garantia de economia.</small>
            </aside>
          </div>
        </Reveal>

        <Reveal>
          <div className="comparison-board">
            <div className="comparison-column traditional-flow">
              <div className="comparison-label"><span /> Calibração tradicional</div>
              <div className="traditional-track">
                <div><small>SEMANA 01</small><strong>Consolidar dados espalhados</strong></div>
                <ArrowRight size={15} aria-hidden="true" />
                <div><small>SEMANA 02–03</small><strong>Encontrar agendas</strong></div>
                <ArrowRight size={15} aria-hidden="true" />
                <div><small>SEMANA 04+</small><strong>Discussões sem rastreabilidade</strong></div>
              </div>
            </div>
            <div className="comparison-divider"><span>VS</span></div>
            <div className="comparison-column sara-flow">
              <div className="comparison-label"><span /> Com SARA Performance</div>
              <div className="sara-track">
                {[
                  ['01', 'Salas organizadas', 'Pessoas, notas, comentários e critérios em um único fluxo.'],
                  ['02', 'Indicadores em tempo real', 'Pendências, curvas e divergências sinalizadas.'],
                  ['03', 'Decisão registrada', 'Ajustes rastreáveis e feedbacks melhor estruturados.'],
                ].map(([number, title, text]) => (
                  <div className="sara-step" key={number}>
                    <span>{number}</span>
                    <div><strong>{title}</strong><small>{text}</small></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <div className="benefit-grid">
          {benefits.map((benefit, index) => (
            <Reveal delay={index * 70} key={benefit.title}>
              <FeatureCard {...benefit} number={`0${index + 1}`} inverse />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="value-equation" aria-label="Equação de valor da SARA Performance">
            <span>Calibração assíncrona</span>
            <b>+</b>
            <span>IA assistida</span>
            <b>=</b>
            <strong>menos viés, melhores feedbacks e menor custo de ciclo</strong>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
