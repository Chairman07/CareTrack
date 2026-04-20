import { Link } from "react-router-dom";
import { patients, formatRelative, ageFromDob } from "@/lib/mockData";
import { Users, CalendarClock, Activity, UserPlus, ArrowUpRight, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Active patients", value: "2,481", delta: "+34 this week", icon: Users },
  { label: "Visits today", value: "27", delta: "8 in queue", icon: CalendarClock },
  { label: "Avg. wait time", value: "11m", delta: "-3m vs avg", icon: Activity },
  { label: "New registrations", value: "12", delta: "this week", icon: UserPlus },
];

const Dashboard = () => {
  const recent = [...patients].sort((a, b) =>
    (b.lastVisit ?? "").localeCompare(a.lastVisit ?? "")
  ).slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-deep">Today</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Good morning, Dr. Adeyemi.
          </h1>
          <p className="mt-2 text-muted-foreground">Here's what's happening at the clinic.</p>
        </div>
        <Button variant="sage" size="lg" asChild>
          <Link to="/app/patients"><UserPlus className="mr-2 h-4 w-4" /> New patient</Link>
        </Button>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border/70 bg-gradient-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <s.icon className="h-4 w-4 text-primary-deep" />
            </div>
            <p className="mt-3 font-display text-3xl font-semibold tracking-tight">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.delta}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent patients */}
        <div className="lg:col-span-2 rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">Recently seen</h2>
              <p className="text-sm text-muted-foreground">Latest patient activity</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/patients">View all <ArrowUpRight className="ml-1 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
          <ul className="mt-5 divide-y divide-border/60">
            {recent.map((p) => (
              <li key={p.id}>
                <Link to={`/app/patients/${p.id}`} className="group flex items-center gap-4 py-3 transition-colors hover:bg-surface/70 -mx-2 px-2 rounded-lg">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/30 font-display text-sm font-semibold text-primary-deep">
                    {p.firstName[0]}{p.lastName[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{p.firstName} {p.lastName}</p>
                    <p className="truncate text-xs text-muted-foreground">{p.id} · {ageFromDob(p.dob)} y · {p.village}</p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-sm">{p.visits[0]?.reason ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{p.lastVisit ? formatRelative(p.lastVisit) : "—"}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Today's queue */}
        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
          <h2 className="font-display text-lg font-semibold">Today's queue</h2>
          <p className="text-sm text-muted-foreground">8 waiting · 4 in consult</p>
          <ul className="mt-5 space-y-3">
            {patients.slice(0, 4).map((p, i) => (
              <li key={p.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface/60 px-3 py-2.5">
                <span className="font-display text-sm font-semibold text-primary-deep w-6">{String(i+1).padStart(2,'0')}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.firstName} {p.lastName}</p>
                  <p className="truncate text-xs text-muted-foreground">{p.visits[0]?.reason ?? "Check-up"}</p>
                </div>
                <Stethoscope className="h-3.5 w-3.5 text-muted-foreground" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
