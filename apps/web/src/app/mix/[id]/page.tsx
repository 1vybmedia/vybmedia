type MixDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function MixDetailPage({ params }: MixDetailPageProps) {
  const { id } = await params;

  return (
    <section className="page-stack">
      <div className="section-heading">
        <p className="eyebrow">Vyb detail</p>
        <h1>{id}</h1>
      </div>
      <div className="mix-builder">
        <div className="mix-row">
          <strong>1</strong>
          <span>Tracklist</span>
          <small>ordered transitions</small>
        </div>
        <div className="mix-row">
          <strong>2</strong>
          <span>Comments</span>
          <small>threaded social layer</small>
        </div>
      </div>
    </section>
  );
}
