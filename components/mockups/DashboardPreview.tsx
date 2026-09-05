import { ArrowUpRight, Sparkles } from 'lucide-react';

export function DashboardPreview() {
  return (
    <div className="hero-visual" aria-label="Prévia ilustrativa do dashboard da SARA Performance">
      <div className="dashboard-shell">
        <aside className="dashboard-sidebar" aria-hidden="true">
          <div className="mini-brand">S</div>
          {[0, 1, 2, 3, 4].map((item) => (
            <span className={item === 1 ? 'active' : ''} key={item} />
          ))}
        </aside>
        <div className="dashboard-main">
          <div className="dashboard-topline">
            <div>
              <small>Ciclo 2026</small>
              <strong>Visão de calibração</strong>
            </div>
            <span className="avatar-stack" aria-hidden="true"><i /><i /><i /></span>
          </div>
          <div className="dashboard-stats">
            <div><small>Em análise</small><strong>24</strong><em>7 áreas</em></div>
            <div><small>Calibrados</small><strong>86%</strong><em>+12% esta semana</em></div>
            <div><small>Alertas da IA</small><strong>08</strong><em>revisão sugerida</em></div>
          </div>
          <div className="calibration-panel">
            <div className="panel-heading">
              <div><small>Colaboradores</small><strong>Calibração por evidências</strong></div>
              <span>Filtrar</span>
            </div>
            {[
              ['MC', 'Marina Costa', 'Produto', '4.2', 'Consistente'],
              ['RL', 'Rafael Lima', 'Tecnologia', '3.8', 'Revisar'],
              ['AS', 'Ana Souza', 'Operações', '4.5', 'Consistente'],
            ].map(([initials, name, area, score, status]) => (
              <div className="person-row" key={name}>
                <span className="person-avatar">{initials}</span>
                <span><strong>{name}</strong><small>{area}</small></span>
                <b>{score}</b>
                <em className={status === 'Revisar' ? 'warning' : ''}>{status}</em>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="floating-card floating-card-ai">
        <span className="spark"><Sparkles size={16} aria-hidden="true" /></span>
        <span><small>Recomendação SARA</small><strong>Revisar evidências do critério liderança</strong></span>
        <ArrowUpRight size={13} aria-hidden="true" />
      </div>
      <div className="floating-card floating-card-cost">
        <small>Tempo de ciclo</small>
        <strong>− 3 semanas</strong>
        <span>potencial estimado</span>
      </div>
      <p className="mockup-caption">Interface ilustrativa · substitua por um print real em <code>/public/sara</code></p>
    </div>
  );
}
