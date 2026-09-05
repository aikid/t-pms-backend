import { ArrowDown, ArrowUpRight, Check } from 'lucide-react';
import { DashboardPreview } from '@/components/mockups/DashboardPreview';

const demoUrl =
  'mailto:contato@8rtech.com.br?subject=Solicitar%20demonstra%C3%A7%C3%A3o%20SARA%20Performance';

export function HeroSection() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-glow" aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow"><span /> People Intelligence para decisões mais consistentes</p>
          <h1>Calibração de performance com IA, <em>menos viés</em> e menor custo de ciclo.</h1>
          <p className="hero-lead">
            Avaliação, calibração assíncrona, recomendações assistidas e analytics para apoiar decisões de pessoas com mais clareza, consistência e velocidade.
          </p>
          <div className="hero-actions">
            <a className="button" href={demoUrl}>
              Solicitar demonstração <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <a className="text-link" href="#calibracao">
              Ver como funciona <ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
          <p className="human-note"><span aria-hidden="true"><Check size={11} strokeWidth={3} /></span> IA assistiva: a decisão continua com RH e liderança.</p>
        </div>
        <DashboardPreview />
      </div>
      <div className="container hero-proof" aria-label="Resumo da proposta de valor">
        <span>Menos semanas de discussão</span>
        <i aria-hidden="true" />
        <span>Mais consistência nas decisões</span>
        <i aria-hidden="true" />
        <span>Feedbacks melhores com apoio de IA</span>
      </div>
    </section>
  );
}
