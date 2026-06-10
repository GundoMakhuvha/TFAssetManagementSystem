import { jsx, jsxs } from "react/jsx-runtime";
import { D as DEPARTMENTS, C as CONDITIONS, A as AppLayout } from "./types-Cb6AoSf3.js";
import { useQuery } from "@tanstack/react-query";
import { s as supabase, C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./router-D4E3tyqy.js";
import { S as Skeleton } from "./skeleton-BF3obMgU.js";
import { Boxes, ShieldCheck, AlertTriangle, LifeBuoy } from "lucide-react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";
import { subDays, format } from "date-fns";
import "react";
import "@tanstack/react-router";
import "./button-q-WgH9X2.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./tipp-focus-logo-DATZ4ULS.js";
import "sonner";
import "@supabase/supabase-js";
import "clsx";
import "tailwind-merge";
function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const [assetsRes, versRes, ticketsRes] = await Promise.all([
        supabase.from("assets").select("*").eq("is_deleted", false),
        supabase.from("verifications").select("*").order("verified_at", { ascending: false }).limit(500),
        supabase.from("tickets").select("*")
      ]);
      return {
        assets: assetsRes.data ?? [],
        verifications: versRes.data ?? [],
        tickets: ticketsRes.data ?? []
      };
    }
  });
  if (isLoading || !data) return /* @__PURE__ */ jsx(DashboardSkeleton, {});
  const total = data.assets.length;
  const monthAgo = subDays(/* @__PURE__ */ new Date(), 30).toISOString();
  const verifiedThisMonth = new Set(
    data.verifications.filter((v) => v.verified_at >= monthAgo).map((v) => v.asset_id)
  ).size;
  const everVerified = new Set(data.assets.filter((a) => a.last_verified_date).map((a) => a.asset_id));
  const unverified = total - everVerified.size;
  data.assets.filter((a) => a.asset_condition === "Damaged" || a.asset_condition === "Poor").length;
  const byDept = DEPARTMENTS.map((d) => ({
    dept: d,
    count: data.assets.filter((a) => a.department === d).length
  }));
  const byCondition = CONDITIONS.map((c) => ({
    name: c,
    value: data.assets.filter((a) => a.asset_condition === c).length
  }));
  const days = Array.from({ length: 14 }, (_, i) => subDays(/* @__PURE__ */ new Date(), 13 - i));
  const trend = days.map((day) => {
    const key = format(day, "yyyy-MM-dd");
    const count = data.verifications.filter((v) => v.verified_at.startsWith(key)).length;
    return { date: format(day, "MMM d"), count };
  });
  const STATUSES = ["Open", "In Progress", "On Hold", "Resolved", "Closed"];
  const ticketStack = STATUSES.map((s) => ({
    status: s,
    Low: data.tickets.filter((t) => t.status === s && t.priority === "Low").length,
    Medium: data.tickets.filter((t) => t.status === s && t.priority === "Medium").length,
    High: data.tickets.filter((t) => t.status === s && t.priority === "High").length,
    Critical: data.tickets.filter((t) => t.status === s && t.priority === "Critical").length
  }));
  const recentVer = data.verifications.slice(0, 5);
  const recentTickets = [...data.tickets].sort((a, b) => b.updated_at.localeCompare(a.updated_at)).slice(0, 5);
  const PIE_COLORS = ["var(--color-success)", "var(--color-info)", "var(--color-warning)", "var(--color-destructive)"];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Dashboard" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Overview of assets, verifications and help desk activity." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsx(Kpi, { icon: Boxes, label: "Total assets", value: total }),
      /* @__PURE__ */ jsx(Kpi, { icon: ShieldCheck, label: "Verified (30d)", value: verifiedThisMonth, accent: "success" }),
      /* @__PURE__ */ jsx(Kpi, { icon: AlertTriangle, label: "Unverified", value: unverified, accent: "warning" }),
      /* @__PURE__ */ jsx(Kpi, { icon: LifeBuoy, label: "Open tickets", value: data.tickets.filter((t) => t.status !== "Closed" && t.status !== "Resolved").length, accent: "info" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Assets by department" }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "h-72", children: /* @__PURE__ */ jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxs(BarChart, { data: byDept, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--color-border)" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "dept", stroke: "var(--color-muted-foreground)", fontSize: 12 }),
          /* @__PURE__ */ jsx(YAxis, { stroke: "var(--color-muted-foreground)", fontSize: 12 }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: { background: "var(--color-card)", border: "1px solid var(--color-border)" } }),
          /* @__PURE__ */ jsx(Bar, { dataKey: "count", fill: "var(--color-primary)", radius: [6, 6, 0, 0] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Asset condition" }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "h-72", children: /* @__PURE__ */ jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxs(PieChart, { children: [
          /* @__PURE__ */ jsx(Pie, { data: byCondition, dataKey: "value", nameKey: "name", innerRadius: 50, outerRadius: 90, children: byCondition.map((_, i) => /* @__PURE__ */ jsx(Cell, { fill: PIE_COLORS[i] }, i)) }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: { background: "var(--color-card)", border: "1px solid var(--color-border)" } }),
          /* @__PURE__ */ jsx(Legend, {})
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Verifications (14 days)" }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "h-72", children: /* @__PURE__ */ jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxs(LineChart, { data: trend, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--color-border)" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "date", stroke: "var(--color-muted-foreground)", fontSize: 12 }),
          /* @__PURE__ */ jsx(YAxis, { stroke: "var(--color-muted-foreground)", fontSize: 12, allowDecimals: false }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: { background: "var(--color-card)", border: "1px solid var(--color-border)" } }),
          /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "count", stroke: "var(--color-primary)", strokeWidth: 2, dot: false })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Tickets by status & priority" }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "h-72", children: /* @__PURE__ */ jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxs(BarChart, { data: ticketStack, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--color-border)" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "status", stroke: "var(--color-muted-foreground)", fontSize: 12 }),
          /* @__PURE__ */ jsx(YAxis, { stroke: "var(--color-muted-foreground)", fontSize: 12, allowDecimals: false }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: { background: "var(--color-card)", border: "1px solid var(--color-border)" } }),
          /* @__PURE__ */ jsx(Legend, {}),
          /* @__PURE__ */ jsx(Bar, { dataKey: "Low", stackId: "a", fill: "var(--color-muted-foreground)" }),
          /* @__PURE__ */ jsx(Bar, { dataKey: "Medium", stackId: "a", fill: "var(--color-info)" }),
          /* @__PURE__ */ jsx(Bar, { dataKey: "High", stackId: "a", fill: "var(--color-warning)" }),
          /* @__PURE__ */ jsx(Bar, { dataKey: "Critical", stackId: "a", fill: "var(--color-destructive)" })
        ] }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Recent verifications" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: recentVer.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No verifications yet." }) : /* @__PURE__ */ jsx("ul", { className: "divide-y", children: recentVer.map((v) => /* @__PURE__ */ jsxs("li", { className: "py-2 flex justify-between text-sm", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsx("strong", { children: v.asset_id }),
            " — ",
            v.verified_by
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: format(new Date(v.verified_at), "PPp") })
        ] }, v.id)) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Recent ticket activity" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: recentTickets.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No tickets yet." }) : /* @__PURE__ */ jsx("ul", { className: "divide-y", children: recentTickets.map((t) => /* @__PURE__ */ jsxs("li", { className: "py-2 flex justify-between text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "truncate max-w-[60%]", children: t.title }),
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: t.status })
        ] }, t.id)) }) })
      ] })
    ] })
  ] });
}
function Kpi({
  icon: Icon,
  label,
  value,
  accent
}) {
  const accentBg = accent === "success" ? "bg-success/10 text-success" : accent === "warning" ? "bg-warning/15 text-warning-foreground" : accent === "info" ? "bg-info/10 text-info" : "bg-primary/10 text-primary";
  return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: label }),
      /* @__PURE__ */ jsx("div", { className: "text-3xl font-semibold mt-1", children: value })
    ] }),
    /* @__PURE__ */ jsx("div", { className: `h-10 w-10 rounded-lg flex items-center justify-center ${accentBg}`, children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }) })
  ] }) }) });
}
function DashboardSkeleton() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-48" }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-4", children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-24" }, i)) }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 lg:grid-cols-2", children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-72" }, i)) })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsx(AppLayout, { children: /* @__PURE__ */ jsx(Dashboard, {}) });
export {
  SplitComponent as component
};
