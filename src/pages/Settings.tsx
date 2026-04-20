const Settings = () => (
  <div className="space-y-6">
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-deep">Configuration</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Settings</h1>
      <p className="mt-2 text-muted-foreground">Clinic profile, users, and access — coming next.</p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      {["Clinic profile", "Staff & access", "Backups", "Sync & offline"].map((s) => (
        <div key={s} className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
          <h3 className="font-display font-semibold">{s}</h3>
          <p className="mt-1 text-sm text-muted-foreground">Configurable in a follow-up version.</p>
        </div>
      ))}
    </div>
  </div>
);
export default Settings;
