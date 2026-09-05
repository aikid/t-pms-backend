import { ArrowUp } from 'lucide-react';
import { Brand } from '@/components/Brand';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Brand inverse />
          <p>A 8R Tech cria produtos digitais e soluções personalizadas para empresas que precisam operar melhor, integrar mais e escalar com inteligência.</p>
        </div>
        <div className="footer-links">
          <div><strong>Produto</strong><a href="#calibracao">Calibração</a><a href="#ia">IA assistida</a><a href="#feedback">Feedback</a></div>
          <div><strong>Plataforma</strong><a href="#plataforma">Ecossistema SARA</a><a href="#contato">Contato</a></div>
          <div><strong>Em breve</strong><span>Política de privacidade</span><span>Dados cadastrais</span></div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} SARA Performance · uma solução 8R Tech</span>
        <span>Smart Assessment, Recommendations &amp; Analytics</span>
        <a href="#inicio" aria-label="Voltar ao topo">Voltar ao topo <ArrowUp size={14} aria-hidden="true" /></a>
      </div>
    </footer>
  );
}
