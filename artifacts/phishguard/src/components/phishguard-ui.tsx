import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useClerk, useUser } from '@clerk/react';
import {
  Activity,
  ChartNoAxesColumnIncreasing,
  CircleHelp,
  Gauge,
  LayoutDashboard,
  LogOut,
  Menu,
  Radar,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
} from 'lucide-react';

export const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className={cx('flex items-center gap-3 group', compact && 'justify-center')} data-testid="link-logo">
      <img src="/logo.svg" alt="PhishGuard" className="h-10 w-10 transition-transform duration-300 group-hover:rotate-3" data-testid="img-logo" />
      {!compact && <span className="text-[17px] font-extrabold tracking-[-0.04em] text-sidebar-foreground">Phish<span className="text-sidebar-primary">Guard</span></span>}
    </Link>
  );
}

export function Button({ children, variant = 'primary', className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  return (
    <button
      {...props}
      className={cx(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-[10px] px-4 text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-primary text-primary-foreground shadow-[0_5px_0_hsl(var(--primary)/.18)] hover:-translate-y-0.5 hover:shadow-[0_7px_0_hsl(var(--primary)/.18)]',
        variant === 'secondary' && 'border border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted',
        variant === 'ghost' && 'text-muted-foreground hover:bg-muted hover:text-foreground',
        variant === 'danger' && 'bg-destructive text-destructive-foreground hover:brightness-105',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Pill({ children, tone = 'teal' }: { children: React.ReactNode; tone?: 'teal' | 'amber' | 'red' | 'slate' }) {
  return <span className={cx('inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[.08em]', tone === 'teal' && 'bg-primary/10 text-primary', tone === 'amber' && 'bg-accent/20 text-amber-800', tone === 'red' && 'bg-destructive/10 text-destructive', tone === 'slate' && 'bg-muted text-muted-foreground')}>{children}</span>;
}

export function LoadingState({ label = 'Chargement de votre espace d’apprentissage' }: { label?: string }) {
  return <div className="space-y-4" aria-busy="true" data-testid="status-loading"><div className="h-28 animate-pulse rounded-2xl bg-muted/70" /><div className="grid gap-4 sm:grid-cols-3"><div className="h-24 animate-pulse rounded-2xl bg-muted/70" /><div className="h-24 animate-pulse rounded-2xl bg-muted/70" /><div className="h-24 animate-pulse rounded-2xl bg-muted/70" /></div><p className="text-sm text-muted-foreground">{label}</p></div>;
}

export function ErrorState({ onRetry, message = 'Impossible de charger cette page pour le moment.' }: { onRetry?: () => void; message?: string }) {
  return <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-8 text-center" data-testid="status-error"><div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-destructive"><X size={20} /></div><h3 className="font-bold">Un petit détour</h3><p className="mt-1 text-sm text-muted-foreground">{message}</p>{onRetry && <Button variant="secondary" className="mt-5" onClick={onRetry} data-testid="button-retry">Réessayer</Button>}</div>;
}

export function EmptyState({ icon: Icon = Radar, title, message, action }: { icon?: typeof Radar; title: string; message: string; action?: React.ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center" data-testid="status-empty"><div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon size={22} /></div><h3 className="font-bold">{title}</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{message}</p>{action && <div className="mt-5">{action}</div>}</div>;
}

const navItems = [
  { href: '/dashboard', label: 'Vue d’ensemble', icon: LayoutDashboard },
  { href: '/campaigns', label: 'Laboratoire', icon: Radar },
  { href: '/quiz', label: 'Quiz rapide', icon: CircleHelp },
  { href: '/recommendations', label: 'Conseils', icon: Sparkles },
  { href: '/results', label: 'Mes résultats', icon: ChartNoAxesColumnIncreasing },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();
  const isAdmin = (user?.publicMetadata as { role?: string } | undefined)?.role === 'admin';
  const close = () => setMobileOpen(false);
  return (
    <div className="min-h-[100dvh] bg-background">
      <aside className={cx('fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col bg-sidebar px-5 py-6 transition-transform duration-300 lg:translate-x-0', mobileOpen ? 'translate-x-0' : '-translate-x-full')} data-testid="nav-sidebar">
        <div className="flex items-center justify-between"><Logo /><button className="text-sidebar-foreground/70 lg:hidden" onClick={close} aria-label="Fermer la navigation" data-testid="button-close-nav"><X size={20} /></button></div>
        <div className="mt-12"><p className="mb-3 px-3 font-mono text-[10px] font-medium uppercase tracking-[.18em] text-sidebar-foreground/45">Votre apprentissage</p><nav className="space-y-1">{navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={close} className={cx('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors', location === href || (href !== '/dashboard' && location.startsWith(href)) ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-foreground')} data-testid={`link-nav-${href.slice(1)}`}><Icon size={17} /><span>{label}</span></Link>)}</nav></div>
        <div className="mt-8"><p className="mb-3 px-3 font-mono text-[10px] font-medium uppercase tracking-[.18em] text-sidebar-foreground/45">Compte</p><nav className="space-y-1"><Link href="/settings" onClick={close} className={cx('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors', location === '/settings' ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-foreground')} data-testid="link-nav-settings"><Settings size={17} />Paramètres</Link>{isAdmin && <Link href="/admin" onClick={close} className={cx('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors', location.startsWith('/admin') ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-foreground')} data-testid="link-nav-admin"><Gauge size={17} />Administration</Link>}</nav></div>
        <div className="mt-auto rounded-2xl border border-sidebar-border bg-sidebar-accent/60 p-4"><div className="flex items-center gap-2 text-sidebar-primary"><ShieldCheck size={16} /><span className="font-mono text-[10px] uppercase tracking-[.14em]">Sûr par conception</span></div><p className="mt-2 text-xs leading-5 text-sidebar-foreground/65">Chaque scénario est fictif. Entraînez-vous sans risque.</p></div>
        <button onClick={() => signOut({ redirectUrl: import.meta.env.BASE_URL || '/' })} className="mt-4 flex items-center gap-3 px-3 py-2 text-left text-sm font-semibold text-sidebar-foreground/60 hover:text-sidebar-foreground" data-testid="button-sign-out"><LogOut size={17} />Se déconnecter</button>
      </aside>
      {mobileOpen && <button className="fixed inset-0 z-30 bg-foreground/30 lg:hidden" onClick={close} aria-label="Fermer le menu" data-testid="button-overlay" />}
      <main className="lg:pl-[250px]"><header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border/70 bg-background/90 px-5 backdrop-blur-md sm:px-8"><button className="rounded-lg p-2 text-foreground lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Ouvrir la navigation" data-testid="button-open-nav"><Menu size={21} /></button><div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><Activity size={14} className="text-primary" /> Mode apprentissage <span className="h-1 w-1 rounded-full bg-primary" /> privé et fictif</div><div className="ml-auto flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-xs font-bold" data-testid="text-user-name">{user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'Apprenant'}</p><p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">apprenant</p></div><div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-extrabold text-secondary-foreground" data-testid="text-user-avatar">{(user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress?.[0] || 'A').toUpperCase()}</div></div></header><div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 lg:px-10">{children}</div></main>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-[11px] uppercase tracking-[.2em] text-primary" data-testid="text-eyebrow">{eyebrow}</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-0.045em] text-balance sm:text-4xl" data-testid="text-page-title">{title}</h1>{description && <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground" data-testid="text-page-description">{description}</p>}</div>{action}</div>;
}

export function StatCard({ label, value, detail, icon: Icon, tone = 'teal' }: { label: string; value: string | number; detail?: string; icon: typeof Target; tone?: 'teal' | 'amber' | 'slate' }) {
  return <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_8px_30px_hsl(var(--foreground)/.035)]" data-testid={`card-stat-${label.toLowerCase().replaceAll(' ', '-')}`}><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.08em] text-muted-foreground">{label}</p><p className="mt-3 text-3xl font-extrabold tracking-[-.06em]" data-testid={`text-stat-${label.toLowerCase().replaceAll(' ', '-')}`}>{value}</p></div><div className={cx('flex h-10 w-10 items-center justify-center rounded-xl', tone === 'teal' && 'bg-primary/10 text-primary', tone === 'amber' && 'bg-accent/20 text-amber-800', tone === 'slate' && 'bg-muted text-muted-foreground')}><Icon size={19} /></div></div>{detail && <p className="mt-3 text-xs text-muted-foreground">{detail}</p>}</div>;
}

export function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className="block space-y-2"><span className="text-xs font-bold uppercase tracking-[.08em] text-muted-foreground">{label}</span><input {...props} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" /></label>;
}

export function TextAreaField({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return <label className="block space-y-2"><span className="text-xs font-bold uppercase tracking-[.08em] text-muted-foreground">{label}</span><textarea {...props} className="min-h-24 w-full rounded-xl border border-input bg-background px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" /></label>;
}

export function ProgressBar({ value }: { value: number }) {
  return <div className="h-2 overflow-hidden rounded-full bg-muted" aria-label={`${value}% terminé`}><div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[10px] uppercase tracking-[.18em] text-muted-foreground">{children}</p>;
}