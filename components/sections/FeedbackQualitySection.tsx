import { ArrowRight, Check, FileText, MessageSquareText, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

const benefits = [
  'Feedbacks menos genéricos',
  'Conexão entre nota, evidências e expectativas',
  'Recomendações mais práticas',
  'Mais qualidade em conversas de desenvolvimento',
];

export function FeedbackQualitySection() {
  return (
    <section className="section feedback-section" id="feedback" aria-labelledby="feedback-title">
      <div className="container feedback-layout">
        <Reveal>
          <div className="feedback-copy">
            <SectionHeading
              id="feedback-title"
              eyebrow="Do ciclo para a conversa"
              title="Feedbacks mais claros, úteis e acionáveis."
              text="A SARA transforma comentários dispersos em uma base estruturada para feedbacks melhores. O RH decide se as notas da calibração entram na composição, e o gestor mantém a palavra final."
            />
            <ul className="check-list">
              {benefits.map((benefit) => (
                <li key={benefit}><Check size={16} strokeWidth={2.3} aria-hidden="true" /> {benefit}</li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="feedback-composer" aria-label="Exemplo ilustrativo de construção de feedback com IA">
            <div className="composer-top">
              <div><MessageSquareText size={18} aria-hidden="true" /><strong>Construção do feedback</strong></div>
              <span>Rascunho</span>
            </div>
            <div className="feedback-sources">
              <div><FileText size={14} aria-hidden="true" /><span><strong>8 comentários</strong><small>gestor, pares e autoavaliação</small></span></div>
              <ArrowRight size={15} aria-hidden="true" />
              <div><SlidersHorizontal size={14} aria-hidden="true" /><span><strong>4 critérios</strong><small>cargo e senioridade</small></span></div>
            </div>
            <div className="ai-draft">
              <div className="ai-draft-label"><Sparkles size={14} aria-hidden="true" /> Sugestão assistida pela SARA</div>
              <p>
                Você demonstrou evolução consistente na condução de entregas complexas e na colaboração com outras áreas. Para o próximo ciclo, priorize ampliar a clareza na delegação e registrar os impactos das iniciativas lideradas.
              </p>
              <div className="draft-highlights"><span>Evidência</span><span>Desenvolvimento</span><span>Próximo passo</span></div>
            </div>
            <div className="composer-footer">
              <small>O gestor revisa, adapta e aprova a comunicação final.</small>
              <button type="button">Usar como base</button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
