import { Link } from "react-router-dom";
import { patients, formatDate, formatRelative } from "@/lib/mockData";
import { CalendarClock } from "lucide-react";

const allVisits = patients.flatMap((p) =>
  p.visits.map((v) => ({ ...v, patient: p }))
).sort((a, b) => b.date.localeCompare(a.date));

const Visits = () => {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-deep">Encounters</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Recent visits</h1>
        <p className="mt-2 text-muted-foreground">All consultations across the clinic, newest first.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
        <ul className="divide-y divide-border/60">
          {allVisits.map((v) => (
            <li key={v.patient.id + v.id}>
              <Link to={`/app/patients/${v.patient.id}`} className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-surface/60">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary-deep">
                  <CalendarClock className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium">
                      {v.patient.firstName} {v.patient.lastName}
                      <span className="ml-2 font-mono text-xs text-muted-foreground">{v.patient.id}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(v.date)} · {formatRelative(v.date)}</p>
                  </div>
                  <p className="mt-1 text-sm">{v.reason} — <span className="text-primary-deep font-medium">{v.diagnosis}</span></p>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{v.notes}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Visits;
