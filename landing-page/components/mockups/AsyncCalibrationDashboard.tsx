import {
  AlertTriangle,
  BarChart3,
  Bell,
  Check,
  ChevronRight,
  FileText,
  Gauge,
  LayoutDashboard,
  MessageSquareText,
  Search,
  Settings,
  Sparkles,
  Target,
  UsersRound,
} from 'lucide-react';

const rooms = [
  ['Dados · Pleno', '12 pessoas'],
  ['Dados · Sênior', '8 pessoas'],
  ['Produto · Sênior', '10 pessoas'],
  ['Engenharia · Pleno', '16 pessoas'],
];

const people = [
  ['LN', 'Lara Nunes', 'Eng. de Dados', '4.2', '4.0', 'Consensado'],
  ['BA', 'Bruno Almeida', 'Analista Sênior', '3.8', '—', 'Aguardando'],
  ['CR', 'Camila Rocha', 'Data Scientist', '4.5', '4.3', 'Revisar'],
];

export function AsyncCalibrationDashboard() {
  return (
    <div className="product-dashboard" aria-label="Mockup ilustrativo da sala de calibração assíncrona da SARA Performance com dados fictícios">
      <div className="product-topbar">
        <div className="product-wordmark"><span>S</span><div><strong>SARA</strong><small>Performance · ACME Corp</small></div></div>
        <div className="product-breadcrumb"><span>Calibração</span><ChevronRight size={11} /><span>Ciclo 2026.02</span><ChevronRight size={11} /><strong>Sala de calibração</strong></div>
        <div className="product-search"><Search size={13} /><span>Buscar colaboradores, ciclos...</span></div>
        <Bell size={15} aria-label="Notificações" />
      </div>

      <div className="product-body">
        <aside className="product-sidebar" aria-label="Navegação ilustrativa do sistema">
          {[
            [Gauge, 'Início'], [LayoutDashboard, 'Dashboard'], [Target, 'Ciclos'], [BarChart3, 'Calibração'],
            [UsersRound, 'Colaboradores'], [FileText, 'Avaliações'], [MessageSquareText, 'Feedbacks'], [Settings, 'Configurações'],
          ].map(([Icon, label]) => {
            const NavigationIcon = Icon as typeof Gauge;
            return <div className={label === 'Calibração' ? 'is-active' : ''} key={label as string}><NavigationIcon size={14} /><span>{label as string}</span></div>;
          })}
        </aside>

        <div className="product-main">
          <div className="product-page-heading">
            <div>
              <span className="product-kicker">SALA EM ANDAMENTO <i /></span>
              <h3>Calibração assíncrona</h3>
              <p>Analise evidências, registre argumentos e proponha ajustes com rastreabilidade.</p>
            </div>
            <div className="live-pill"><span /> Indicadores em tempo real</div>
          </div>

          <div className="product-overview">
            <div><UsersRound size={13} /><span><strong>60</strong><small>avaliados</small></span></div>
            <div><LayoutDashboard size={13} /><span><strong>20</strong><small>áreas / salas</small></span></div>
            <div className="is-warning"><AlertTriangle size={13} /><span><strong>56</strong><small>pendências</small></span></div>
            <div><Sparkles size={13} /><span><strong>8</strong><small>alertas da IA</small></span></div>
            <div><Check size={13} /><span><strong>86%</strong><small>calibrados</small></span></div>
          </div>

          <div className="product-workspace">
            <section className="room-list" aria-label="Salas de calibração">
              <div className="product-panel-title"><strong>Minhas salas</strong><span>20 salas</span></div>
              <div className="room-search"><Search size={11} /><span>Buscar sala</span></div>
              {rooms.map(([room, count], index) => (
                <div className={`room-item${index === 1 ? ' is-selected' : ''}`} key={room}>
                  <div><strong>{room}</strong><small>{count}</small></div>
                  <span>Em andamento</span>
                </div>
              ))}
            </section>

            <section className="calibration-room" aria-label="Colaboradores da sala Dados Sênior">
              <div className="room-heading"><div><small>Sala selecionada</small><strong>Dados · Sênior</strong></div><span>3 divergências críticas</span></div>
              <div className="room-metrics">
                <div><small>Colaboradores</small><strong>8</strong></div>
                <div><small>Gestores</small><strong>4</strong></div>
                <div><small>Pendentes</small><strong>2</strong></div>
                <div><small>Divergências</small><strong>3</strong></div>
              </div>
              <div className="people-table">
                <div className="people-table-head"><span>Colaborador</span><span>Cargo</span><span>Gestor</span><span>Calibrado</span><span>Status</span><span>Ação</span></div>
                {people.map(([initials, name, role, manager, calibrated, status]) => (
                  <div className="people-table-row" key={name}>
                    <span className="table-person"><i>{initials}</i><strong>{name}</strong></span>
                    <span>{role}</span><span>{manager}</span><span>{calibrated}</span>
                    <span className={`table-status status-${status.toLowerCase()}`}>{status}</span>
                    <button type="button">Ver dossiê</button>
                  </div>
                ))}
              </div>
              <div className="room-actions"><span><MessageSquareText size={12} /> Feedbacks públicos da sala</span><button type="button">Registrar argumento</button></div>
            </section>

            <aside className="curve-panel" aria-label="Curva de performance da sala">
              <div className="product-panel-title"><strong>Curva da sala</strong><BarChart3 size={14} /></div>
              <div className="curve-scores"><div><small>Média gestores</small><strong>3.8</strong></div><div><small>Média proposta</small><strong>4.0</strong></div></div>
              <div className="curve-chart" aria-hidden="true">
                <span /><span /><span /><span /><span />
                <i className="curve-line" />
              </div>
              <div className="curve-labels"><span>Baixa</span><span>Atende</span><span>Supera</span></div>
              <div className="curve-insight"><Sparkles size={12} /><p><strong>Insight SARA</strong>Há concentração de notas acima das evidências registradas.</p></div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
