export default function SettingsPage() {
  return (
    <section className="page-stack">
      <div className="section-heading">
        <p className="eyebrow">Account</p>
        <h1>Settings</h1>
      </div>
      <div className="mix-builder">
        <div className="mix-row">
          <strong>1</strong>
          <span>Profile details</span>
          <small>handle, avatar, bio</small>
        </div>
        <div className="mix-row">
          <strong>2</strong>
          <span>Notifications</span>
          <small>follows and new vybs</small>
        </div>
      </div>
    </section>
  );
}
