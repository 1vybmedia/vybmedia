const feedItems = [
  { type: "vyb", title: "Late set warmup", by: "@dj", meta: "6 tracks · 18m" },
  { type: "track", title: "Night relay", by: "@maya", meta: "128 BPM · 8A" },
  { type: "snippet", title: "Drop idea 03", by: "@kito", meta: "18s clip" }
];

export default function FeedPage() {
  return (
    <section className="page-stack">
      <div className="section-heading">
        <p className="eyebrow">Chronological</p>
        <h1>Feed</h1>
      </div>
      <div className="feed-list">
        {feedItems.map((item) => (
          <article className="feed-item" key={`${item.type}-${item.title}`}>
            <span>{item.type}</span>
            <div>
              <h2>{item.title}</h2>
              <p>{item.by}</p>
            </div>
            <small>{item.meta}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
