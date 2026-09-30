interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col gap-3 mb-14 ${alignClass}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-cyan-400">
          <span className="h-px w-8 bg-cyan-400/60" />
          {eyebrow}
          <span className="h-px w-8 bg-cyan-400/60" />
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-50 leading-tight">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-slate-400 text-base sm:text-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
