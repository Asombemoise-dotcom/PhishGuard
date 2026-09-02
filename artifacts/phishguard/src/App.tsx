import { useEffect, useRef, type ReactNode } from 'react';
import { ClerkProvider, Show, SignIn, SignUp, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AdminPage, CampaignsPage, DashboardPage, HomePage, QuizPage, RecommendationsPage, ResultsPage, SettingsPage } from '@/pages/phishguard-pages';
import NotFound from '@/pages/not-found';
import {
  Route,
  Redirect,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function stripBase(path: string) {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || '/'
    : path;
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: '#218f84',
    colorForeground: '#173846',
    colorMutedForeground: '#5d737a',
    colorDanger: '#c4473e',
    colorBackground: '#f8fcfb',
    colorInput: '#f8fcfb',
    colorInputForeground: '#173846',
    colorNeutral: '#c8d9d8',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    borderRadius: '0.75rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-[#f8fcfb] rounded-2xl w-[440px] max-w-full overflow-hidden border border-[#c8d9d8]',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-[#173846] font-extrabold',
    headerSubtitle: 'text-[#5d737a]',
    socialButtonsBlockButtonText: 'text-[#173846] font-semibold',
    formFieldLabel: 'text-[#173846] font-bold',
    footerActionLink: 'text-[#218f84] font-bold',
    footerActionText: 'text-[#5d737a]',
    dividerText: 'text-[#5d737a]',
    identityPreviewEditButton: 'text-[#218f84]',
    formFieldSuccessText: 'text-[#218f84]',
    alertText: 'text-[#c4473e]',
    logoBox: 'h-11',
    logoImage: 'h-10 w-10',
    socialButtonsBlockButton: 'border border-[#c8d9d8] bg-[#f8fcfb] hover:bg-[#e4f3f0]',
    formButtonPrimary: 'bg-[#218f84] text-[#f8fcfb] font-bold hover:bg-[#18796f]',
    formFieldInput: 'border-[#c8d9d8] bg-[#f8fcfb] text-[#173846]',
    footerAction: 'text-[#5d737a]',
    dividerLine: 'bg-[#c8d9d8]',
    alert: 'border-[#e8b7b2] bg-[#fff1ef]',
    otpCodeFieldInput: 'border-[#c8d9d8] bg-[#f8fcfb] text-[#173846]',
    formFieldRow: 'gap-2',
    main: 'bg-transparent',
  },
};

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in"><Redirect to="/dashboard" /></Show>
      <Show when="signed-out"><HomePage /></Show>
    </>
  );
}

function Protected({ children }: { children: ReactNode }) {
  return (
    <>
      <Show when="signed-in">{children}</Show>
      <Show when="signed-out"><Redirect to="/" /></Show>
    </>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={HomeRedirect} />
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?" component={SignUpPage} />
        <Route path="/dashboard">{() => <Protected><DashboardPage /></Protected>}</Route>
        <Route path="/campaigns/:id">{() => <Protected><CampaignsPage /></Protected>}</Route>
        <Route path="/campaigns">{() => <Protected><CampaignsPage /></Protected>}</Route>
        <Route path="/quiz">{() => <Protected><QuizPage /></Protected>}</Route>
        <Route path="/recommendations">{() => <Protected><RecommendationsPage /></Protected>}</Route>
        <Route path="/results">{() => <Protected><ResultsPage /></Protected>}</Route>
        <Route path="/settings">{() => <Protected><SettingsPage /></Protected>}</Route>
        <Route path="/admin">{() => <Protected><AdminPage /></Protected>}</Route>
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function SignInPage() {
  return <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-10"><SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} /></div>;
}

function SignUpPage() {
  return <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-10"><SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} /></div>;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const client = useQueryClient();
  const previousUserId = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (previousUserId.current !== undefined && previousUserId.current !== userId) client.clear();
      previousUserId.current = userId;
    });
    return unsubscribe;
  }, [addListener, client]);
  return null;
}

function App() {
  if (!clerkPubKey) throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();
  return (
    <ClerkProvider
        publishableKey={clerkPubKey}
        proxyUrl={clerkProxyUrl}
        appearance={clerkAppearance}
        signInUrl={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
         localization={{
           locale: 'fr-FR',
           socialButtonsBlockButton: 'Continuer avec {{provider|titleize}}',
           dividerText: 'ou',
           formFieldLabel__emailAddress: 'Adresse e-mail',
           formFieldInputPlaceholder__emailAddress: 'Saisissez votre adresse e-mail',
           formFieldLabel__password: 'Mot de passe',
           formFieldInputPlaceholder__password: 'Saisissez votre mot de passe',
           formFieldAction__forgotPassword: 'Mot de passe oublié ?',
           formButtonPrimary: 'Continuer',
           formButtonPrimary__verify: 'Vérifier',
           backButton: 'Retour',
           footerActionLink__useAnotherMethod: 'Utiliser une autre méthode',
           signIn: {
             start: {
               title: 'Bon retour',
               subtitle: 'Retrouvez votre espace d’entraînement',
               actionText: 'Vous n’avez pas encore de compte ?',
               actionLink: 'Créer un compte',
             },
           },
           signUp: {
             start: {
               title: 'Créez votre espace d’apprentissage',
               subtitle: 'Adoptez de meilleurs réflexes à votre rythme',
               actionText: 'Vous avez déjà un compte ?',
               actionLink: 'Se connecter',
             },
           },
         }}
        routerPush={(to) => setLocation(stripBase(to))}
        routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
      >
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <ClerkQueryClientCacheInvalidator />
            <Router />
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </ClerkProvider>
  );
}

export default App;
