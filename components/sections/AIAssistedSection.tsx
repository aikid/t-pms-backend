import { ArrowRight, BrainCircuit, Check, CircleUserRound, Database, FileText, ShieldCheck, Sparkles, UsersRound } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

const inputs = [
  { icon: CircleUserRound, label: 'Autoavaliação' },
  { icon: UsersRound, label: 'Avaliação do gestor' },
  { icon: UsersRound, label: 'Feedbacks de pares' },
  { icon: FileText, label: 'Comentários e evidências' },
  { icon: Database, label: 'Matriz de senioridade' },
  { icon: Database, label: 'Expectativas de cargo e nível' },
];

const outputs = [
  'Recomendação de nota',
  'Justificativa curta e orientada',
  'Inconsistências e possíveis vieses',
  'Apoio para RH e gestores',
  'Base opcional para o feedback final',
];

export function AIAssistedSection() {
  return (
    <section className="section ai-section" id="ia" aria-labelledby="ai-title">
      <div className="container">
        <Reveal>
          <SectionHeading
            id="ai-title"
            eyebrow="Inteligência assistiva"
            title="IA para apoiar decisões, não para substituir pessoas."
            text="A IA atua dentro do processo: cruza autoavaliação, gestor, pares, evidências, matriz de senioridade e expectativas por cargo para recomendar caminhos e apoiar calibrações mais consistentes."
            align="center"
          />
        </Reveal>

        <Reveal>
          <div className="ai-flow" aria-label="Fluxo de análise assistida da SARA">
            <div className="ai-flow-column input-column">
              <span className="flow-kicker">01 · Contexto</span>
              <h3>Dados do ciclo</h3>
              <div className="input-list">
                {inputs.map(({ icon: Icon, label }) => (
                  <div key={label}><Icon size={17} strokeWidth={1.7} aria-hidden="true" /><span>{label}</span></div>
                ))}
              </div>
            </div>
            <ArrowRight className="flow-arrow" size={23} aria-hidden="true" />
            <div className="ai-core">
              <div className="ai-core-rings" aria-hidden="true"><span /><span /></div>
              <span className="flow-kicker">02 · Análise</span>
              <div className="ai-core-icon"><BrainCircuit size={30} strokeWidth={1.5} aria-hidden="true" /></div>
              <h3>Camada SARA</h3>
              <p>Organiza, cruza e estrutura evidências para sinalizar inconsistências e possíveis vieses.</p>
              <div className="ai-status"><span /> Análise assistida</div>
            </div>
            <ArrowRight className="flow-arrow" size={23} aria-hidden="true" />
            <div className="ai-flow-column output-column">
              <span className="flow-kicker">03 · Apoio</span>
              <h3>Recomendações</h3>
              <div className="output-list">
                {outputs.map((output) => (
                  <div key={output}><Check size={14} strokeWidth={2.4} aria-hidden="true" /><span>{output}</span></div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="human-decision-banner">
            <div className="human-decision-icon"><ShieldCheck size={24} strokeWidth={1.6} aria-hidden="true" /></div>
            <div>
              <strong>A decisão permanece humana.</strong>
              <p>A IA da SARA não substitui RH e liderança. Ela organiza evidências, sinaliza inconsistências e recomenda caminhos para decisões mais consistentes.</p>
            </div>
            <Sparkles size={24} strokeWidth={1.4} aria-hidden="true" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
