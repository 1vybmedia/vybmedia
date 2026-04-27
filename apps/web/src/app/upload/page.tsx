import Link from "next/link";

export default function UploadPage() {
  return (
    <section className="page-stack">
      <div className="section-heading">
        <p className="eyebrow">Creator flow</p>
        <h1>Upload track</h1>
      </div>
      <div className="upload-zone">
        <p>MP3 upload dropzone</p>
        <span>Analysis, fingerprinting, and R2 storage will wire in behind this surface.</span>
      </div>
      <Link className="button" href="/upload/snippet">
        Upload a snippet instead
      </Link>
    </section>
  );
}
