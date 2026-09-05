import { Clock3, FileQuestion, MessageSquareWarning, Scale, UsersRound, Workflow } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

const problems = [
  { icon: Clock3, label: 'Semanas de discussão' },
  { icon: UsersRound, label: 'Reuniões extensas' },
  { icon: Workflow, label: 'Baixa rastreabilidade' },
  { icon: MessageSquareWarning, label: 'Feedbacks inconsistentes' },
  { icon: Scale, label: 'Decisões mais expostas a vieses' },
  { icon: FileQuestion, label: 'Gestores sem evidências organizadas' },
];

export function ProblemSection() {
  return (
    <section className="section problem-section" aria-labelledby="problem-title">
      <div className="container">
        <Reveal>
          <div className="problem-layout">
            <SectionHeading
              id="problem-title"
              eyebrow="O custo invisível do ciclo"
              title="Ciclos de avaliação ainda custam caro demais."
              text="Quando a calibração depende de agendas cheias, planilhas dispersas e memória, o custo cresce — e a qualidade da decisão não acompanha."
            />
            <p className="problem-aside">
              O desafio não é só avaliar. É fazer RH, gestores e lideranças chegarem a decisões coerentes sem transformar cada ciclo em uma maratona operacional.
            </p>
          </div>
        </Reveal>
        <div className="problem-grid">
          {problems.map(({ icon: Icon, label }, index) => (
            <Reveal delay={index * 60} key={label}>
              <article className="problem-card">
                <Icon size={19} strokeWidth={1.65} aria-hidden="true" />
                <span>{label}</span>
                <small>{String(index + 1).padStart(2, '0')}</small>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
