import { jsx, jsxs } from "react/jsx-runtime";
import { createRootRoute, Link, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter, useRouter } from "@tanstack/react-router";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Toaster$1 } from "sonner";
import { createClient } from "@supabase/supabase-js";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const DEFAULT_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzaWZzc2toYnlyZ2Jtc2RlenFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NzAxOTIsImV4cCI6MjA5MzU0NjE5Mn0.ZHodmo_0A-VXO4H4uZxz6QOpnkTdAuyZSEZfPkrt-QI";
const url = "https://jsifsskhbyrgbmsdezqs.supabase.co";
const anonKey = DEFAULT_ANON_KEY;
const isSupabaseConfigured = Boolean(anonKey);
let _client = null;
if (isSupabaseConfigured) {
  _client = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== "undefined" ? window.localStorage : void 0
    }
  });
}
const supabase = _client;
const Ctx = React.createContext(null);
function AuthProvider({ children }) {
  const [session, setSession] = React.useState(null);
  const [role, setRole] = React.useState(null);
  const [fullName, setFullName] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const loadProfile = React.useCallback(async (uid) => {
    const [{ data: roleRow }, { data: profileRow }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", uid).maybeSingle(),
      supabase.from("profiles").select("full_name").eq("id", uid).maybeSingle()
    ]);
    setRole(roleRow?.role ?? "viewer");
    setFullName(profileRow?.full_name ?? null);
  }, []);
  React.useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) {
        setTimeout(() => loadProfile(s.user.id), 0);
      } else {
        setRole(null);
        setFullName(null);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) loadProfile(data.session.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);
  const signOut = React.useCallback(async () => {
    await supabase.auth.signOut();
  }, []);
  const refreshRole = React.useCallback(async () => {
    if (session?.user) await loadProfile(session.user.id);
  }, [session, loadProfile]);
  return /* @__PURE__ */ jsx(
    Ctx.Provider,
    {
      value: {
        session,
        user: session?.user ?? null,
        role,
        fullName,
        loading,
        signOut,
        refreshRole
      },
      children
    }
  );
}
function useAuth() {
  const v = React.useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Card = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
      ...props
    }
  )
);
Card.displayName = "Card";
const CardHeader = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props })
);
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn("font-semibold leading-none tracking-tight", className),
      ...props
    }
  )
);
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("text-sm text-muted-foreground", className), ...props })
);
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props })
);
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props })
);
CardFooter.displayName = "CardFooter";
function SetupScreen() {
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center p-6 bg-background", children: /* @__PURE__ */ jsxs(Card, { className: "max-w-2xl w-full shadow-[var(--shadow-elegant)]", children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl", children: "Connect Tipp Focus to Supabase" }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxs("p", { children: [
        "This app connects to ",
        /* @__PURE__ */ jsx("strong", { children: "your own" }),
        " Supabase project. Set the following environment variables in ",
        /* @__PURE__ */ jsx("em", { children: "Project Settings → Environment Variables" }),
        ":"
      ] }),
      /* @__PURE__ */ jsx("pre", { className: "bg-muted rounded-md p-4 text-foreground text-xs overflow-x-auto", children: `VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJI...` }),
      /* @__PURE__ */ jsxs("p", { children: [
        "Then run the SQL script in ",
        /* @__PURE__ */ jsx("code", { children: "supabase/schema.sql" }),
        " in your Supabase SQL editor to create all tables, enums, RLS policies, and the auto-promote-first-admin trigger."
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs", children: "After setting the env vars, refresh this page." })
    ] })
  ] }) });
}
const appCss = "/assets/styles-ZFRBmwpg.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
        children: "Go home"
      }
    ) })
  ] }) });
}
const Route$7 = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Tipp Focus — Asset Management & Help Desk" },
      {
        name: "description",
        content: "Tipp Focus internal platform for asset tracking, verification, reporting and help desk tickets."
      }
    ],
    links: [{ rel: "stylesheet", href: appCss }]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  if (!isSupabaseConfigured) return /* @__PURE__ */ jsx(SetupScreen, {});
  const [qc] = React.useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 3e4, refetchOnWindowFocus: false } }
  }));
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: qc, children: /* @__PURE__ */ jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsx(Outlet, {}),
    /* @__PURE__ */ jsx(Toaster, { richColors: true, position: "top-right" })
  ] }) });
}
const $$splitComponentImporter$6 = () => import("./verify-CMLbxX6u.js");
const Route$6 = createFileRoute("/verify")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./tickets-CC0uCnu2.js");
const Route$5 = createFileRoute("/tickets")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./reset-password-srgE0892.js");
const Route$4 = createFileRoute("/reset-password")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./reports-CT5hMUF1.js");
const Route$3 = createFileRoute("/reports")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./login-ttrP2TtH.js");
const Route$2 = createFileRoute("/login")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./assets-DP-SRoFn.js");
const Route$1 = createFileRoute("/assets")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-DgNPTuu8.js");
const Route = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const VerifyRoute = Route$6.update({
  id: "/verify",
  path: "/verify",
  getParentRoute: () => Route$7
});
const TicketsRoute = Route$5.update({
  id: "/tickets",
  path: "/tickets",
  getParentRoute: () => Route$7
});
const ResetPasswordRoute = Route$4.update({
  id: "/reset-password",
  path: "/reset-password",
  getParentRoute: () => Route$7
});
const ReportsRoute = Route$3.update({
  id: "/reports",
  path: "/reports",
  getParentRoute: () => Route$7
});
const LoginRoute = Route$2.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$7
});
const AssetsRoute = Route$1.update({
  id: "/assets",
  path: "/assets",
  getParentRoute: () => Route$7
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$7
});
const rootRouteChildren = {
  IndexRoute,
  AssetsRoute,
  LoginRoute,
  ReportsRoute,
  ResetPasswordRoute,
  TicketsRoute,
  VerifyRoute
};
const routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
function DefaultErrorComponent({ error, reset }) {
  const router2 = useRouter();
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10", children: /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        className: "h-8 w-8 text-destructive",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Something went wrong" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "An unexpected error occurred. Please try again." }),
    false,
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Card as C,
  CardHeader as a,
  CardTitle as b,
  CardContent as c,
  cn as d,
  router as r,
  supabase as s,
  useAuth as u
};
