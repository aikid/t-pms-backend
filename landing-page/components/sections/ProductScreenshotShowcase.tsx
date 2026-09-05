import { ArrowUpRight, CircleCheck, Eye, Gauge, ShieldCheck } from 'lucide-react';
import { AsyncCalibrationDashboard } from '@/components/mockups/AsyncCalibrationDashboard';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function ProductScreenshotShowcase() {
  return (
    <section className="section product-showcase-section" aria-labelledby="product-showcase-title">
      <div className="container">
        <Reveal>
          <div className="product-showcase-heading">
            <SectionHeading
              id="product-showcase-title"
              eyebrow="Produto real, operação visível"
              title="Calibração assíncrona com visão em tempo real."
              text="A SARA organiza salas, colaboradores, pendências, divergências, curvas de performance e status do ciclo em uma experiência única. RH e gestores acompanham o andamento com mais contexto, evidência e rastreabilidade."
            />
            <div className="product-proof-note">
              <span><CircleCheck size={17} aria-hidden="true" /> Produto em construção ativa</span>
              <p>Mockup fiel à tela atual do sistema, reconstruído com dados fictícios para preservar informações sensíveis.</p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <figure className="product-showcase-frame">
            <div className="product-frame-glow" aria-hidden="true" />
            <AsyncCalibrationDashboard />
            <figcaption>
              <span><Eye size={13} aria-hidden="true" /> Visão operacional compartilhada entre RH e gestores</span>
              <span><Gauge size={13} aria-hidden="true" /> Status atualizado ao longo do ciclo</span>
              <span><ShieldCheck size={13} aria-hidden="true" /> Dados demonstrativos e fictícios</span>
              <a href="#indicadores">Explorar indicadores <ArrowUpRight size={13} aria-hidden="true" /></a>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
