import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ArrowRight, Search, FileText, ShieldCheck, Wifi, ClipboardList, HeartPulse } from "lucide-react";

const features = [
  { icon: ClipboardList, title: "Register in seconds", desc: "Capture name, demographics, and contact in a single pass — no paper, no double entry." },
  { icon: Search, title: "Find anyone, fast", desc: "Search by name, ID, or phone. Records appear as you type." },
  { icon: FileText, title: "Visit history at a glance", desc: "Every encounter, diagnosis, and prescription on one timeline." },
  { icon: HeartPulse, title: "Track conditions", desc: "Chronic conditions, allergies, and vitals follow the patient." },
  { icon: Wifi, title: "Built for low bandwidth", desc: "Designed to stay usable when connections are slow or intermittent." },
  { icon: ShieldCheck, title: "Private by default", desc: "Role-based access. Audit-friendly. Patient data stays patient data." },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#mission" className="hover:text-foreground transition-colors">Mission</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/app">Sign in</Link>
            </Button>
            <Button asChild size="sm" variant="sage">
              <Link to="/app">Open demo <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div className="absolute inset-0 grain opacity-60" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-7 animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-deep/30 bg-surface/70 px-3 py-1 text-xs font-medium text-primary-deep backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-deep animate-pulse-ring" />
              Built for clinics in low-resource settings
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Patient records,<br />
              <span className="text-primary-deep">made simple.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              CareTrack replaces paper files with a calm, fast electronic record system —
              so clinicians spend less time searching, and more time caring.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" variant="sage" className="h-12 px-6 text-base">
                <Link to="/app">Try the live demo <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base">
                <a href="#features">See features</a>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
              <div><span className="font-display text-2xl font-semibold text-foreground">3,400+</span><br/>Records managed</div>
              <div className="h-8 w-px bg-border" />
              <div><span className="font-display text-2xl font-semibold text-foreground">12s</span><br/>Avg. registration</div>
              <div className="h-8 w-px bg-border" />
              <div><span className="font-display text-2xl font-semibold text-foreground">98%</span><br/>Retrieval accuracy</div>
            </div>
          </div>

          {/* Hero card preview */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-primary/20 blur-2xl" />
              <div className="relative rounded-2xl border border-border/70 bg-card p-5 shadow-elevated">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/30 font-display font-semibold text-primary-deep">AO</div>
                    <div>
                      <p className="font-display text-sm font-semibold">Amara Okafor</p>
                      <p className="text-xs text-muted-foreground">CT-2024-0142 · 38 y · Female</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-primary-deep">Active</span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-surface p-3 text-center">
                  <div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">BP</p><p className="font-display font-semibold">132/84</p></div>
                  <div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">HR</p><p className="font-display font-semibold">72</p></div>
                  <div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Temp</p><p className="font-display font-semibold">36.6°</p></div>
                </div>
                <div className="mt-4 space-y-2">
                  {[
                    { d: "6 days ago", r: "Follow-up: BP", x: "Stable" },
                    { d: "3 mo ago", r: "Headache", x: "HTN stage 1" },
                    { d: "1 yr ago", r: "Annual check", x: "Healthy" },
                  ].map((v, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-border/60 bg-surface/60 px-3 py-2 text-xs">
                      <div>
                        <p className="font-medium text-foreground">{v.r}</p>
                        <p className="text-muted-foreground">{v.d}</p>
                      </div>
                      <span className="text-primary-deep font-medium">{v.x}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-deep">What it does</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Everything a small clinic needs.<br/>Nothing it doesn't.
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group rounded-2xl border border-border/70 bg-gradient-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary-deep transition-colors group-hover:bg-primary-deep group-hover:text-primary-deep-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How */}
      <section id="how" className="border-y border-border/60 bg-surface/60">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-deep">How it works</p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight">A workflow built around the consultation, not the paperwork.</h2>
            </div>
            <ol className="lg:col-span-7 space-y-6">
              {[
                { n: "01", t: "Patient arrives", d: "Search by name, phone, or ID — or register a new patient in under 30 seconds." },
                { n: "02", t: "Open the chart", d: "Conditions, allergies, medications, and last visit are visible immediately." },
                { n: "03", t: "Log the visit", d: "Reason, diagnosis, vitals, and notes captured during the consultation." },
                { n: "04", t: "Saved & searchable", d: "The record becomes part of the patient's timeline — instantly retrievable next time." },
              ].map((s) => (
                <li key={s.n} className="flex gap-5 rounded-xl border border-border/60 bg-card p-5 shadow-soft">
                  <span className="font-display text-2xl font-semibold text-primary-deep">{s.n}</span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{s.t}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Mission CTA */}
      <section id="mission" className="mx-auto max-w-7xl px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-sage p-10 shadow-elevated sm:p-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-deep-foreground/10 blur-3xl" />
          <div className="relative max-w-2xl text-primary-deep-foreground">
            <p className="text-xs font-medium uppercase tracking-[0.2em] opacity-80">Our mission</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Better records.<br/>Better care. Everywhere.
            </h2>
            <p className="mt-5 text-base leading-relaxed opacity-90">
              CareTrack is built to be lightweight, offline-capable, and durable —
              suitable for clinics where reliability matters more than features.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="h-12 bg-background px-6 text-base text-foreground hover:bg-background/90">
                <Link to="/app">Open the demo <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <Logo />
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} CareTrack — Digital Patient Records Made Simple.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
