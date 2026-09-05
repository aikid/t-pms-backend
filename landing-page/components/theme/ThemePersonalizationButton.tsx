'use client';

import { Check, ChevronDown, Palette, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { brandThemes, useBrandTheme } from '@/components/theme/themeStore';

export function ThemePersonalizationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, selectTheme } = useBrandTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('pointerdown', closeOnOutsideClick);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('pointerdown', closeOnOutsideClick);
    };
  }, []);

  const selectedTheme = brandThemes.find((theme) => theme.id === currentTheme) ?? brandThemes[0];

  return (
    <div className="theme-switcher" id="theme-switcher" ref={wrapperRef}>
      <button
        className="theme-switcher-trigger"
        type="button"
        aria-expanded={isOpen}
        aria-controls="theme-switcher-panel"
        aria-label="Personalizar a identidade visual da página"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="chameleon-mark" aria-hidden="true"><i /><b /></span>
        <span><small>Sua marca</small><strong>Personalize</strong></span>
        <ChevronDown className={isOpen ? 'is-rotated' : ''} size={15} aria-hidden="true" />
      </button>

      <div
        className={`theme-switcher-panel${isOpen ? ' is-open' : ''}`}
        id="theme-switcher-panel"
        aria-hidden={!isOpen}
      >
        <div className="theme-panel-heading">
          <span><Palette size={16} aria-hidden="true" /></span>
          <div><strong>Adaptar identidade</strong><p>Escolha uma cor para mudar o tema de toda a página.</p></div>
          <button type="button" aria-label="Fechar personalização" onClick={() => setIsOpen(false)} tabIndex={isOpen ? 0 : -1}>
            <X size={15} aria-hidden="true" />
          </button>
        </div>
        <div className="theme-swatches" role="group" aria-label="Temas de cor">
          {brandThemes.map((theme) => (
            <button
              type="button"
              key={theme.id}
              className={currentTheme === theme.id ? 'is-selected' : ''}
              aria-label={`Usar tema ${theme.name}`}
              aria-pressed={currentTheme === theme.id}
              onClick={() => selectTheme(theme.id)}
              tabIndex={isOpen ? 0 : -1}
            >
              <span style={{ backgroundColor: theme.color }} aria-hidden="true">
                {currentTheme === theme.id ? <Check size={12} strokeWidth={3} /> : null}
              </span>
              <small>{theme.name}</small>
            </button>
          ))}
        </div>
        <div className="theme-current">
          <i style={{ backgroundColor: selectedTheme.color }} aria-hidden="true" />
          <span>Identidade ativa: <strong>{selectedTheme.name}</strong></span>
        </div>
      </div>
    </div>
  );
}
