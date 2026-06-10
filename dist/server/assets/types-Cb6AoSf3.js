import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useNavigate, useLocation, Link } from "@tanstack/react-router";
import { d as cn, u as useAuth } from "./router-D4E3tyqy.js";
import { B as Button } from "./button-q-WgH9X2.js";
import { LayoutDashboard, Boxes, ScanLine, FileBarChart, LifeBuoy, ShieldCheck, LogOut } from "lucide-react";
import { cva } from "class-variance-authority";
import { l as logoUrl } from "./tipp-focus-logo-DATZ4ULS.js";
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/assets", label: "Asset Register", icon: Boxes },
  { to: "/verify", label: "Verification", icon: ScanLine },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/tickets", label: "Help Desk", icon: LifeBuoy }
];
function AppLayout({ children }) {
  const { user, role, fullName, signOut, loading } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  React.useEffect(() => {
    if (!loading && !user && loc.pathname !== "/login" && loc.pathname !== "/reset-password") {
      nav({ to: "/login" });
    }
  }, [loading, user, loc.pathname, nav]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center text-muted-foreground", children: "Loading…" });
  }
  if (!user) return null;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex bg-background", children: [
    /* @__PURE__ */ jsxs("aside", { className: "w-64 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col", children: [
      /* @__PURE__ */ jsx("div", { className: "px-5 py-5 border-b border-sidebar-border bg-white", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("img", { src: logoUrl, alt: "Tipp Focus", className: "h-12 w-auto object-contain" }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-600", children: "Asset & Help Desk" }) })
      ] }) }),
      /* @__PURE__ */ jsx("nav", { className: "flex-1 p-3 space-y-1", children: NAV.map((item) => {
        const Icon = item.icon;
        const active = item.to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(item.to);
        return /* @__PURE__ */ jsxs(
          Link,
          {
            to: item.to,
            className: cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/60 text-sidebar-foreground/85"
            ),
            children: [
              /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }),
              item.label
            ]
          },
          item.to
        );
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-3 border-t border-sidebar-border space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-2 text-xs", children: [
          /* @__PURE__ */ jsx("div", { className: "font-medium truncate", children: fullName ?? user.email }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-sidebar-foreground/70", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsx("span", { className: "capitalize", children: role ?? "viewer" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            className: "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
            onClick: async () => {
              await signOut();
              nav({ to: "/login" });
            },
            children: [
              /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4 mr-2" }),
              " Sign out"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("main", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxs("header", { className: "h-14 px-6 border-b flex items-center justify-between bg-card", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: NAV.find((n) => n.to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(n.to))?.label ?? "" }),
        /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "capitalize", children: role ?? "viewer" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-6", children })
    ] })
  ] });
}
const DEPARTMENTS = ["CSS", "Finance", "IT", "Facilities", "Tipp Con"];
const CONDITIONS = ["Good", "Fair", "Poor", "Damaged"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const STATUSES = ["Open", "In Progress", "On Hold", "Resolved", "Closed"];
const CATEGORIES = ["Hardware", "Software", "Network", "Access", "Other"];
export {
  AppLayout as A,
  Badge as B,
  CONDITIONS as C,
  DEPARTMENTS as D,
  PRIORITIES as P,
  STATUSES as S,
  CATEGORIES as a
};
