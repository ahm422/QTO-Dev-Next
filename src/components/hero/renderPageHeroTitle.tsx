export function renderPageHeroTitle(title: string, titleHighlight?: string) {
  if (!titleHighlight) return title;

  const parts = title.split(titleHighlight);
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <span className="bg-gradient-to-br from-primary via-primary to-cta-gold bg-clip-text text-transparent">
              {titleHighlight}
            </span>
          )}
        </span>
      ))}
    </>
  );
}
