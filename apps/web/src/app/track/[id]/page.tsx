type TrackDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TrackDetailPage({ params }: TrackDetailPageProps) {
  const { id } = await params;

  return (
    <section className="page-stack">
      <div className="section-heading">
        <p className="eyebrow">Track detail</p>
        <h1>{id}</h1>
      </div>
      <div className="studio-panel">
        <div className="waveform" aria-hidden="true">
          {Array.from({ length: 40 }, (_, index) => (
            <span key={index} style={{ height: `${20 + ((index * 13) % 64)}px` }} />
          ))}
        </div>
      </div>
    </section>
  );
}
