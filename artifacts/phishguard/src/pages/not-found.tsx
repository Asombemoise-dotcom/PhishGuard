import { ArrowLeft, Radar } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="security-grid flex min-h-[100dvh] items-center justify-center bg-background px-5">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-[0_20px_50px_hsl(var(--foreground)/.07)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Radar size={25} /></div>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[.2em] text-primary">Signal introuvable / 404</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-[-.06em]">Ce chemin n’existe pas.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">La page demandée ne fait pas partie de l’espace d’entraînement. Aucun risque n’a été pris.</p>
        <Link href="/" className="mt-7 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground" data-testid="link-not-found-home"><ArrowLeft size={15} /> Retour à PhishGuard</Link>
      </div>
    </div>
  );
}
