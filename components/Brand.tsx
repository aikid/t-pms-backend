type BrandProps = {
  inverse?: boolean;
};

export function Brand({ inverse = false }: BrandProps) {
  return (
    <a
      className={`brand${inverse ? ' brand-inverse' : ''}`}
      href="#inicio"
      aria-label="SARA Performance — início"
    >
      <span className="brand-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="brand-copy">
        <strong>SARA</strong>
        <small>
          Performance <i>by 8R Tech</i>
        </small>
      </span>
    </a>
  );
}
