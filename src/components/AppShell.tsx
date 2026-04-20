import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { Search, Users, CalendarClock, LayoutDashboard, Settings, LogOut, Stethoscope } from "lucide-react";
import { Input } from "@/components/ui/input";

const navItems = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/patients", label: "Patients", icon: Users },
  { to: "/app/visits", label: "Visits", icon: CalendarClock },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

export const AppShell = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-background grain">
      <div className="mx-auto flex max-w-[1400px]">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/70 bg-surface/60 px-4 py-6 lg:flex">
          <Logo />
          <nav className="mt-10 flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary-deep text-primary-deep-foreground shadow-soft"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-xl border border-border/70 bg-card p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/30 font-display text-sm font-semibold text-primary-deep">
                NA
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">Dr. N. Adeyemi</p>
                <p className="truncate text-xs text-muted-foreground">Clinician</p>
              </div>
              <button className="text-muted-foreground hover:text-foreground" aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          {/* Topbar */}
          <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur">
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="lg:hidden"><Logo /></div>
              <div className="relative hidden flex-1 max-w-xl md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search patient by name, ID, phone…"
                  className="h-10 rounded-full border-border/70 bg-surface pl-10 focus-visible:ring-primary-deep"
                />
                <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:block">
                  ⌘K
                </kbd>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="hidden items-center gap-2 rounded-full border border-border/70 bg-surface px-3 py-1.5 text-xs text-muted-foreground sm:flex">
                  <Stethoscope className="h-3.5 w-3.5 text-primary-deep" />
                  Clinic Nsukka · Online
                </span>
              </div>
            </div>
          </header>

          <div key={location.pathname} className="animate-fade-up px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
