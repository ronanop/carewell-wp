interface SectionHeaderProps {
  overline: string;
  title: string;
  description?: string;
  className?: string;
  inverted?: boolean;
}

export function SectionHeader({
  overline,
  title,
  description,
  className,
  inverted = false,
}: SectionHeaderProps) {
  return (
    <div className={className}>
      <p
        className={
          inverted
            ? "text-label uppercase text-primary-foreground/70"
            : "text-label uppercase text-accent"
        }
      >
        {overline}
      </p>
      <h2
        className={
          inverted
            ? "mt-3 font-heading text-h2 text-primary-foreground"
            : "mt-3 font-heading text-h2 text-foreground"
        }
      >
        {title}
      </h2>
      {description ? (
        <p
          className={
            inverted
              ? "mt-4 max-w-2xl text-body-lg text-primary-foreground/80"
              : "mt-4 max-w-2xl text-body-lg text-muted-foreground"
          }
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
