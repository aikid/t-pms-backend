'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Brand } from '@/components/Brand';

const links = [
  { label: 'Calibração', href: '#calibracao' },
  { label: 'IA', href: '#ia' },
  { label: 'Feedback', href: '#feedback' },
  { label: 'Plataforma', href: '#plataforma' },
  { label: 'Contato', href: '#contato' },
];

const demoUrl =
  'mailto:contato@8rtech.com.br?subject=Solicitar%20demonstra%C3%A7%C3%A3o%20SARA%20Performance';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Navegação principal">
          {links.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="button button-small desktop-cta" href={demoUrl}>
            Agendar conversa <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <button
            className="menu-button"
            type="button"
            aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      <div
        className={`mobile-menu container${isOpen ? ' is-open' : ''}`}
        id="mobile-navigation"
        aria-hidden={!isOpen}
      >
        <nav aria-label="Navegação mobile">
          {links.map((link) => (
            <a href={link.href} key={link.href} onClick={() => setIsOpen(false)} tabIndex={isOpen ? 0 : -1}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="button" href={demoUrl} tabIndex={isOpen ? 0 : -1}>
          Solicitar demonstração <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
