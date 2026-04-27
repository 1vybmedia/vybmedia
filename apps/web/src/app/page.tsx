import Link from "next/link";

const stats = [
  ["32", "draft tracks"],
  ["8", "vybs in progress"],
  ["14k", "listens this week"]
];

export default function HomePage() {
  return (
    <section className="home-grid">
      <div className="intro-panel">
        <p className="eyebrow">Music first. Social right behind it.</p>
        <h1>VYB</h1>
        <p className="lede">
          Upload tracks, let VYB shape transitions, publish a vyb, and keep the
          conversation around the music.
        </p>
        <div className="button-row">
          <Link className="button primary" href="/feed">
            Open feed
          </Link>
          <Link className="button" href="/mix">
            Build a vyb
          </Link>
        </div>
      </div>
      <div className="studio-panel" aria-label="Creator workspace preview">
        <div className="waveform" aria-hidden="true">
          {Array.from({ length: 40 }, (_, index) => (
            <span key={index} style={{ height: `${24 + ((index * 17) % 58)}px` }} />
          ))}
        </div>
        <div className="transition-row">
          <span>124 BPM</span>
          <strong>8A -> 9A</strong>
          <span>12s crossfade</span>
        </div>
        <div className="stats-grid">
          {stats.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
