import type { LucideIcon } from 'lucide-react';

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  text: string;
  number?: string;
  inverse?: boolean;
};

export function FeatureCard({ icon: Icon, title, text, number, inverse = false }: FeatureCardProps) {
  return (
    <article className={`feature-card${inverse ? ' feature-card-inverse' : ''}`}>
      <div className="feature-card-top">
        <span className="icon-box"><Icon size={19} strokeWidth={1.7} aria-hidden="true" /></span>
        {number ? <span className="card-number">{number}</span> : null}
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
