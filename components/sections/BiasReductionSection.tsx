import { AlertTriangle, ArrowUpRight, EqualNot, Eye, MessageCircleWarning, Scale, ScanSearch } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

const signals = [
  { icon: ScanSearch, title: 'Evidência insuficiente', text: 'Nota alta sem exemplos concretos registrados no ciclo.' },
  { icon: MessageCircleWarning, title: 'Comentário vago', text: 'Argumentação genérica, com baixa conexão aos critérios da posição.' },
  { icon: EqualNot, title: 'Percepções divergentes', text: 'Diferença relevante entre autoavaliação, pares e avaliação da liderança.' },
  { icon: Scale, title: 'Padrão de severidade', text: 'Distribuição que pode indicar avaliações mais severas ou generosas.' },
];

export function BiasReductionSection() {
  return (
    <section className="section bias-section" aria-labelledby="bias-title">
      <div className="container bias-layout">
        <Reveal>
          <div className="bias-copy">
            <SectionHeading
              id="bias-title"
              eyebrow="Consistência baseada em evidências"
              title="Menos subjetividade. Mais evidência."
              text="A SARA ajuda a sinalizar inconsistências e possíveis vieses antes da decisão final — sem automatizar julgamentos que pertencem às pessoas."
            />
            <ul className="check-list">
              <li><Eye size={17} aria-hidden="true" /> Compara performance observada e nota atribuída</li>
              <li><Eye size={17} aria-hidden="true" /> Identifica desalinhamentos com cargo e senioridade</li>
              <li><Eye size={17} aria-hidden="true" /> Destaca pontos que precisam de revisão humana</li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="insight-console">
            <div className="console-header">
              <div><span className="status-dot" /><strong>Alertas inteligentes</strong></div>
              <span>Exemplo ilustrativo</span>
            </div>
            <div className="console-profile">
              <div className="person-avatar large">AC</div>
              <div><strong>Avaliação em análise</strong><small>Especialista · Área de Operações</small></div>
              <div className="score-pill"><small>Nota atual</small><strong>4.6</strong></div>
            </div>
            <div className="console-alert">
              <div className="alert-icon"><AlertTriangle size={17} aria-hidden="true" /></div>
              <div>
                <span>Possível inconsistência</span>
                <p>A nota atribuída está acima da média das evidências registradas para o critério “influência”. Considere revisar os exemplos.</p>
              </div>
            </div>
            <div className="console-recommendation">
              <span>Recomendação SARA</span>
              <p>Validar evidências adicionais com a liderança antes de concluir a calibração.</p>
              <button type="button">Ver evidências <ArrowUpRight size={13} aria-hidden="true" /></button>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="container signal-grid">
        {signals.map(({ icon: Icon, title, text }, index) => (
          <Reveal delay={index * 60} key={title}>
            <article className="signal-card">
              <Icon size={19} strokeWidth={1.6} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
