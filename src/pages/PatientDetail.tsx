import { Link, useParams } from "react-router-dom";
import { patients, ageFromDob, formatDate, formatRelative } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, MapPin, AlertTriangle, HeartPulse, Plus, Calendar } from "lucide-react";

const PatientDetail = () => {
  const { id } = useParams();
  const patient = patients.find((p) => p.id === id);

  if (!patient) {
    return (
      <div className="mx-auto max-w-md text-center py-20">
        <p className="text-muted-foreground">Patient not found.</p>
        <Button asChild variant="link"><Link to="/app/patients">Back to patients</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link to="/app/patients" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> All patients
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-border/70 bg-gradient-card p-6 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-sage font-display text-2xl font-semibold text-primary-deep-foreground shadow-soft">
            {patient.firstName[0]}{patient.lastName[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs text-muted-foreground">{patient.id}</p>
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {patient.firstName} {patient.lastName}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span>{patient.sex} · {ageFromDob(patient.dob)} years · {formatDate(patient.dob)}</span>
              {patient.bloodType && <span className="inline-flex items-center gap-1.5"><HeartPulse className="h-3.5 w-3.5" />{patient.bloodType}</span>}
              <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{patient.phone}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{patient.village}</span>
            </div>
          </div>
          <Button variant="sage" size="lg">
            <Plus className="mr-2 h-4 w-4" /> Log visit
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sidebar info */}
        <div className="space-y-6">
          <Section title="Conditions" icon={HeartPulse}>
            {patient.conditions.length ? (
              <div className="flex flex-wrap gap-2">
                {patient.conditions.map((c) => (
                  <span key={c} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary-deep">{c}</span>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground">None recorded.</p>}
          </Section>

          <Section title="Allergies" icon={AlertTriangle}>
            {patient.allergies.length ? (
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((a) => (
                  <span key={a} className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">{a}</span>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground">No known allergies.</p>}
          </Section>

          <Section title="Registration">
            <p className="text-sm">Registered <span className="text-muted-foreground">{formatDate(patient.registeredAt)}</span></p>
            <p className="mt-1 text-sm">Last visit <span className="text-muted-foreground">{patient.lastVisit ? formatRelative(patient.lastVisit) : "—"}</span></p>
          </Section>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-2 rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Visit history</h2>
            <span className="text-xs text-muted-foreground">{patient.visits.length} encounters</span>
          </div>
          <ol className="mt-6 relative border-l-2 border-border/60 ml-2">
            {patient.visits.map((v) => (
              <li key={v.id} className="relative pl-6 pb-8 last:pb-0">
                <span className="absolute -left-[9px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-deep ring-4 ring-background">
                  <Calendar className="h-2 w-2 text-primary-deep-foreground" />
                </span>
                <div className="rounded-xl border border-border/60 bg-surface/60 p-4 transition-shadow hover:shadow-soft">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display font-semibold">{v.reason}</h3>
                    <p className="text-xs text-muted-foreground">{formatDate(v.date)} · {formatRelative(v.date)}</p>
                  </div>
                  <p className="mt-1 text-sm font-medium text-primary-deep">{v.diagnosis}</p>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.notes}</p>
                  {v.vitals && (
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {v.vitals.bp && <span>BP <span className="font-mono text-foreground">{v.vitals.bp}</span></span>}
                      {v.vitals.hr && <span>HR <span className="font-mono text-foreground">{v.vitals.hr}</span></span>}
                      {v.vitals.temp && <span>T <span className="font-mono text-foreground">{v.vitals.temp}°</span></span>}
                    </div>
                  )}
                  <p className="mt-3 text-xs text-muted-foreground">— {v.clinician}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, icon: Icon, children }: { title: string; icon?: any; children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
    <h3 className="flex items-center gap-2 font-display text-sm font-semibold">
      {Icon && <Icon className="h-4 w-4 text-primary-deep" />} {title}
    </h3>
    <div className="mt-3">{children}</div>
  </div>
);

export default PatientDetail;
