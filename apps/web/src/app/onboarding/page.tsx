export default function OnboardingPage() {
  return (
    <section className="page-stack">
      <div className="section-heading">
        <p className="eyebrow">First run</p>
        <h1>Onboarding</h1>
      </div>
      <div className="mix-builder">
        <div className="mix-row">
          <strong>1</strong>
          <span>Choose handle</span>
          <small>unique profile URL</small>
        </div>
        <div className="mix-row">
          <strong>2</strong>
          <span>Pick genre tags</span>
          <small>feed personalization later</small>
        </div>
        <div className="mix-row">
          <strong>3</strong>
          <span>Select role</span>
          <small>creator or listener</small>
        </div>
      </div>
    </section>
  );
}
