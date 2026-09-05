type SectionHeadingProps = {
  id?: string;
  eyebrow: string;
  title: string;
  text?: string;
  align?: 'left' | 'center';
  inverse?: boolean;
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  text,
  align = 'left',
  inverse = false,
}: SectionHeadingProps) {
  return (
    <div className={`section-heading ${align === 'center' ? 'is-centered' : ''}${inverse ? ' is-inverse' : ''}`}>
      <p className="eyebrow"><span /> {eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {text ? <p className="section-description">{text}</p> : null}
    </div>
  );
}
