import { ArrowUpRight, CalendarDays, Check } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const demoUrl =
  'mailto:contato@8rtech.com.br?subject=Agendar%20demonstra%C3%A7%C3%A3o%20SARA%20Performance';

export function CTASection() {
  return (
    <section className="section cta-section" id="contato" aria-labelledby="cta-title">
      <div className="container">
        <Reveal>
          <div className="cta-card">
            <div className="cta-art" aria-hidden="true"><span /><span /><span /></div>
            <div className="cta-copy">
              <p className="eyebrow"><span /> Seu próximo ciclo pode ser diferente</p>
              <h2 id="cta-title">Pronto para reduzir o custo e aumentar a qualidade do seu próximo ciclo de performance?</h2>
              <p>Veja como calibração assíncrona, IA assistida e analytics podem transformar a gestão de performance da sua empresa.</p>
              <div className="cta-actions">
                <a className="button button-light" href={demoUrl}>Agendar demonstração <CalendarDays size={17} aria-hidden="true" /></a>
                <a className="cta-link" href="mailto:contato@8rtech.com.br">Falar com a 8R Tech <ArrowUpRight size={15} aria-hidden="true" /></a>
              </div>
              <span className="cta-reassurance"><Check size={13} strokeWidth={2.6} aria-hidden="true" /> Conversa consultiva, sem compromisso</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
