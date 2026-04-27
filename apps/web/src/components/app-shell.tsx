import Link from "next/link";
import { Bell, Search, Upload } from "lucide-react";
import { BottomPlayer } from "./bottom-player";

const navItems = [
  { href: "/feed", label: "Feed" },
  { href: "/mix", label: "Mix" },
  { href: "/upload", label: "Upload" }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <header className="top-nav">
        <Link className="brand" href="/">
          VYB
        </Link>
        <nav aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions" aria-label="Quick actions">
          <Link aria-label="Search" href="/search">
            <Search size={19} />
          </Link>
          <Link aria-label="Upload" href="/upload">
            <Upload size={19} />
          </Link>
          <Link aria-label="Notifications" href="/notifications">
            <Bell size={19} />
          </Link>
        </div>
      </header>
      <main>{children}</main>
      <BottomPlayer />
    </div>
  );
}
