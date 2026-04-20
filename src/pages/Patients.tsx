import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { patients, ageFromDob, formatRelative } from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Filter } from "lucide-react";

const Patients = () => {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return patients;
    return patients.filter((p) =>
      [p.firstName, p.lastName, p.id, p.phone, p.village].join(" ").toLowerCase().includes(t)
    );
  }, [q]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-deep">Records</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Patients</h1>
          <p className="mt-2 text-muted-foreground">{patients.length} registered · search any record in seconds</p>
        </div>
        <Button variant="sage" size="lg">
          <UserPlus className="mr-2 h-4 w-4" /> Register patient
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-soft">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, ID, phone, village…"
            className="h-11 border-0 bg-transparent pl-10 focus-visible:ring-0"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-3.5 w-3.5" /> Filters
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
        <div className="grid grid-cols-12 gap-4 border-b border-border/60 bg-surface/60 px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          <div className="col-span-5">Patient</div>
          <div className="col-span-2 hidden sm:block">ID</div>
          <div className="col-span-2 hidden md:block">Conditions</div>
          <div className="col-span-3 sm:col-span-3 md:col-span-3 text-right">Last visit</div>
        </div>
        <ul className="divide-y divide-border/60">
          {filtered.map((p) => (
            <li key={p.id}>
              <Link to={`/app/patients/${p.id}`} className="grid grid-cols-12 items-center gap-4 px-5 py-4 transition-colors hover:bg-surface/60">
                <div className="col-span-12 sm:col-span-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/30 font-display text-sm font-semibold text-primary-deep">
                    {p.firstName[0]}{p.lastName[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.firstName} {p.lastName}</p>
                    <p className="truncate text-xs text-muted-foreground">{p.sex} · {ageFromDob(p.dob)} y · {p.village}</p>
                  </div>
                </div>
                <div className="col-span-2 hidden sm:block">
                  <p className="font-mono text-xs text-muted-foreground">{p.id}</p>
                </div>
                <div className="col-span-2 hidden md:flex flex-wrap gap-1.5">
                  {p.conditions.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
                  {p.conditions.slice(0, 2).map((c) => (
                    <span key={c} className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-primary-deep">{c}</span>
                  ))}
                </div>
                <div className="col-span-12 sm:col-span-3 md:col-span-3 text-right">
                  <p className="text-sm font-medium">{p.lastVisit ? formatRelative(p.lastVisit) : "—"}</p>
                  <p className="text-xs text-muted-foreground truncate">{p.visits[0]?.reason ?? "—"}</p>
                </div>
              </Link>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-5 py-12 text-center text-sm text-muted-foreground">
              No patients match "{q}".
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Patients;
