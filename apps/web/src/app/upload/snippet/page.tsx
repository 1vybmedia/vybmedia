export default function SnippetUploadPage() {
  return (
    <section className="page-stack">
      <div className="section-heading">
        <p className="eyebrow">Up to 20 seconds</p>
        <h1>Snippet upload</h1>
      </div>
      <div className="timeline-editor">
        <div className="trim-window" aria-hidden="true" />
      </div>
      <p className="muted">Trim controls will clamp source audio to the MVP 20 second limit.</p>
    </section>
  );
}
