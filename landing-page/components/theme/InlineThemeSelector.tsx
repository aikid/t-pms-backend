'use client';

import { Check } from 'lucide-react';
import { brandThemes, useBrandTheme } from '@/components/theme/themeStore';

export function InlineThemeSelector() {
  const { currentTheme, selectTheme } = useBrandTheme();

  return (
    <div className="inline-theme-selector">
      <div className="inline-theme-swatches" role="group" aria-label="Escolha a identidade visual da página">
        {brandThemes.map((theme) => (
          <button
            type="button"
            key={theme.id}
            className={currentTheme === theme.id ? 'is-selected' : ''}
            aria-label={`Mudar toda a página para o tema ${theme.name}`}
            aria-pressed={currentTheme === theme.id}
            title={theme.description}
            onClick={() => selectTheme(theme.id)}
          >
            <span style={{ backgroundColor: theme.color }} aria-hidden="true">
              {currentTheme === theme.id ? <Check size={13} strokeWidth={3} /> : null}
            </span>
            <small>{theme.name}</small>
          </button>
        ))}
      </div>
      <p>Clique em uma cor e veja toda a identidade da página se adaptar.</p>
    </div>
  );
}
