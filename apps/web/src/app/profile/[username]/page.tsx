type ProfilePageProps = {
  params: Promise<{ username: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  return (
    <section className="page-stack">
      <div className="profile-header">
        <div className="avatar" aria-hidden="true" />
        <div>
          <p className="eyebrow">Profile</p>
          <h1>@{username}</h1>
          <p className="muted">Tracks, vybs, snippets, and reposts will land here.</p>
        </div>
      </div>
      <div className="tab-row" aria-label="Profile sections">
        <span>Mixes</span>
        <span>Tracks</span>
        <span>Snippets</span>
        <span>Reposts</span>
      </div>
    </section>
  );
}
