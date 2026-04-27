export default function SignInPage() {
  return (
    <section className="page-stack">
      <div className="section-heading">
        <p className="eyebrow">Auth</p>
        <h1>Sign in</h1>
      </div>
      <div className="upload-zone">
        <p>Clerk SignIn mounts here</p>
        <span>Provider keys are intentionally left in `.env.example`.</span>
      </div>
    </section>
  );
}
