const tracks = ["Night relay", "Warehouse bloom", "Afterglow draft"];

export default function MixPage() {
  return (
    <section className="page-stack">
      <div className="section-heading">
        <p className="eyebrow">Automix builder</p>
        <h1>Build a vyb</h1>
      </div>
      <div className="mix-builder">
        {tracks.map((track, index) => (
          <div className="mix-row" key={track}>
            <strong>{index + 1}</strong>
            <span>{track}</span>
            <small>{index === 0 ? "124 BPM · 8A" : "126 BPM · 9A"}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
