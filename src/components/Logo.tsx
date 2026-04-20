import { Link } from "react-router-dom";

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`flex items-center gap-2.5 group ${className}`}>
    <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-sage shadow-soft">
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary-deep-foreground" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z"/>
        <path d="M9 11h2v-2h2v2h2v2h-2v2h-2v-2H9z"/>
      </svg>
    </span>
    <span className="font-display text-lg font-semibold tracking-tight text-foreground">
      Care<span className="text-primary-deep">Track</span>
    </span>
  </Link>
);
