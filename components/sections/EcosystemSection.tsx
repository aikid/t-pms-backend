import { Activity, BarChart3, Boxes, CircleDollarSign, Gauge, Network, Sparkles } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

const modules = [
  { icon: Gauge, name: 'Performance', text: 'Avaliação, calibração assíncrona, IA e feedbacks.', status: 'Disponível', active: true },
  { icon: Activity, name: 'Pulse', text: 'Clima, engajamento, escuta contínua e pesquisas.', status: 'Em evolução' },
  { icon: CircleDollarSign, name: 'Rewards', text: 'Mérito, promoção, remuneração e orçamento.', status: 'Roadmap' },
  { icon: Network, name: 'Positions', text: 'Posições, cargos, estrutura e headcount.', status: 'Roadmap' },
  { icon: BarChart3, name: 'Insights', text: 'Analytics executivo e inteligência integrada.', status: 'Visão de plataforma' },
];

export function EcosystemSection() {
  return (
    <section className="section ecosystem-section" id="plataforma" aria-labelledby="ecosystem-title">
      <div className="ecosystem-grid-bg" aria-hidden="true" />
      <div className="container ecosystem-content">
        <Reveal>
          <div className="ecosystem-intro">
            <SectionHeading
              id="ecosystem-title"
              eyebrow="O próximo capítulo"
              title="Uma plataforma integrada de People Intelligence."
              text="A SARA nasce com Performance, mas foi pensada para evoluir conectando avaliação, clima, remuneração, posições e analytics em uma experiência única, eficiente e inteligente."
              inverse
            />
            <div className="roadmap-stamp"><Sparkles size={17} aria-hidden="true" /><span>Visão de plataforma<br /><strong>Ecossistema em evolução</strong></span></div>
          </div>
        </Reveal>
        <div className="module-grid">
          {modules.map(({ icon: Icon, name, text, status, active }, index) => (
            <Reveal delay={index * 70} key={name}>
              <article className={`module-card${active ? ' is-active' : ''}`}>
                <div className="module-top">
                  <span className="module-icon"><Icon size={20} strokeWidth={1.6} aria-hidden="true" /></span>
                  <span className="module-status">{status}</span>
                </div>
                <small>SARA</small>
                <h3>{name}</h3>
                <p>{text}</p>
                {active ? <span className="active-line"><i /> Produto atual</span> : null}
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="ecosystem-note"><Boxes size={20} strokeWidth={1.5} aria-hidden="true" /><p>As soluções foram pensadas para conversar entre si, evitando silos, retrabalho e desconexão entre ferramentas.</p></div>
        </Reveal>
      </div>
    </section>
  );
}
