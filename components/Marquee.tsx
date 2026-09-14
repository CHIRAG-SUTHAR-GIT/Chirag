export function Marquee({ items }: { items: string[] }) {
  // Rendered twice so the CSS animation loop is seamless — no JS needed.
  const doubled = [...items, ...items];
  return (
    <div className="mq" aria-hidden="true">
      <div className="mq__track">
        {doubled.map((m, i) => (
          <span className="mq__item" key={i}>
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
