const notifications = ["New mix from @maya", "@kito followed you", "@sol liked Late set warmup"];

export default function NotificationsPage() {
  return (
    <section className="page-stack">
      <div className="section-heading">
        <p className="eyebrow">Activity</p>
        <h1>Notifications</h1>
      </div>
      <div className="feed-list">
        {notifications.map((notification) => (
          <article className="feed-item" key={notification}>
            <span>new</span>
            <div>
              <h2>{notification}</h2>
              <p>Just now</p>
            </div>
            <small>unread</small>
          </article>
        ))}
      </div>
    </section>
  );
}
