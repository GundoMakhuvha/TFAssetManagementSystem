import { jsxs, jsx } from "react/jsx-runtime";
import { D as DEPARTMENTS, C as CONDITIONS, A as AppLayout } from "./types-Cb6AoSf3.js";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { s as supabase, C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./router-D4E3tyqy.js";
import { B as Button } from "./button-q-WgH9X2.js";
import { L as Label, I as Input } from "./label-B2FGngv_.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, T as Table, e as TableHeader, f as TableRow, g as TableHead, h as TableBody, i as TableCell, C as ConditionBadge } from "./badges-DJyUGFS9.js";
import { format } from "date-fns";
import { FileDown, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import "@tanstack/react-router";
import "class-variance-authority";
import "./tipp-focus-logo-DATZ4ULS.js";
import "@supabase/supabase-js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
const ALL = "__all__";
function ReportsPage() {
  const today = /* @__PURE__ */ new Date();
  const monthAgo = new Date(today.getTime() - 30 * 864e5);
  const [from, setFrom] = React.useState(monthAgo.toISOString().slice(0, 10));
  const [to, setTo] = React.useState(today.toISOString().slice(0, 10));
  const [dept, setDept] = React.useState(ALL);
  const [cond, setCond] = React.useState(ALL);
  const [verifier, setVerifier] = React.useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["report-data"],
    queryFn: async () => {
      const [v, a] = await Promise.all([
        supabase.from("verifications").select("*"),
        supabase.from("assets").select("*").eq("is_deleted", false)
      ]);
      return {
        vers: v.data ?? [],
        assets: a.data ?? []
      };
    }
  });
  const rows = React.useMemo(() => {
    if (!data) return [];
    const assetMap = new Map(data.assets.map((a) => [a.asset_id, a]));
    const fromTs = new Date(from).getTime();
    const toTs = new Date(to).getTime() + 864e5;
    return data.vers.filter((v) => {
      const t = new Date(v.verified_at).getTime();
      if (t < fromTs || t > toTs) return false;
      const a = assetMap.get(v.asset_id);
      if (dept !== ALL && a?.department !== dept) return false;
      if (cond !== ALL && v.condition_at_verification !== cond) return false;
      if (verifier && !v.verified_by.toLowerCase().includes(verifier.toLowerCase())) return false;
      return true;
    }).sort((x, y) => y.verified_at.localeCompare(x.verified_at)).map((v) => {
      const a = assetMap.get(v.asset_id);
      return {
        asset_id: v.asset_id,
        description: a?.asset_description ?? "",
        department: a?.department ?? "",
        condition: v.condition_at_verification ?? "",
        verified_by: v.verified_by,
        verified_at: format(new Date(v.verified_at), "yyyy-MM-dd HH:mm")
      };
    });
  }, [data, from, to, dept, cond, verifier]);
  const summary = React.useMemo(() => {
    const byDept = {};
    const byCond = {};
    rows.forEach((r) => {
      byDept[r.department || "—"] = (byDept[r.department || "—"] ?? 0) + 1;
      byCond[r.condition || "—"] = (byCond[r.condition || "—"] ?? 0) + 1;
    });
    return { total: rows.length, byDept, byCond };
  }, [rows]);
  const exportPdf = () => {
    if (rows.length === 0) return toast.error("No rows to export");
    const doc = new jsPDF();
    doc.setFillColor(20, 50, 110);
    doc.rect(0, 0, 210, 22, "F");
    doc.setTextColor(255);
    doc.setFontSize(16);
    doc.text("Tipp Focus — Asset Verification Report", 14, 14);
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text(`Range: ${from} to ${to}`, 14, 30);
    doc.text(`Total verified: ${summary.total}`, 14, 36);
    autoTable(doc, {
      startY: 42,
      head: [["Asset ID", "Description", "Department", "Condition", "Verified By", "Date & Time"]],
      body: rows.map((r) => [r.asset_id, r.description, r.department, r.condition, r.verified_by, r.verified_at]),
      headStyles: { fillColor: [20, 50, 110] },
      styles: { fontSize: 9 }
    });
    const finalY = doc.lastAutoTable.finalY + 8;
    doc.setFontSize(11);
    doc.text("Summary", 14, finalY);
    doc.setFontSize(9);
    let y = finalY + 6;
    doc.text("By department:", 14, y);
    y += 5;
    Object.entries(summary.byDept).forEach(([k, v]) => {
      doc.text(`  ${k}: ${v}`, 16, y);
      y += 4;
    });
    y += 2;
    doc.text("By condition:", 14, y);
    y += 5;
    Object.entries(summary.byCond).forEach(([k, v]) => {
      doc.text(`  ${k}: ${v}`, 16, y);
      y += 4;
    });
    doc.save(`tippfocus-report-${from}-to-${to}.pdf`);
  };
  const exportCsv = async () => {
    const { data: assets } = await supabase.from("assets").select("*").eq("is_deleted", false);
    const list = assets ?? [];
    if (list.length === 0) return toast.error("No assets to export");
    const headers = [
      "asset_id",
      "barcode",
      "serial_number",
      "asset_description",
      "assigned_to",
      "location",
      "department",
      "asset_condition",
      "last_verified_date",
      "verified_by",
      "returned_date",
      "created_at"
    ];
    const csv = [
      headers.join(","),
      ...list.map((a2) => headers.map((h) => {
        const v = a2[h];
        if (v == null) return "";
        const s = String(v).replace(/"/g, '""');
        return /[,"\n]/.test(s) ? `"${s}"` : s;
      }).join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tippfocus-assets-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between flex-wrap gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Reports" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Verified assets within range, exportable to PDF." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs(Button, { variant: "secondary", onClick: exportCsv, children: [
          /* @__PURE__ */ jsx(FileDown, { className: "h-4 w-4 mr-2" }),
          "CSV register"
        ] }),
        /* @__PURE__ */ jsxs(Button, { onClick: exportPdf, children: [
          /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 mr-2" }),
          "Export PDF"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Filters" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "From" }),
          /* @__PURE__ */ jsx(Input, { type: "date", value: from, onChange: (e) => setFrom(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "To" }),
          /* @__PURE__ */ jsx(Input, { type: "date", value: to, onChange: (e) => setTo(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "Department" }),
          /* @__PURE__ */ jsxs(Select, { value: dept, onValueChange: setDept, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: ALL, children: "All" }),
              DEPARTMENTS.map((d) => /* @__PURE__ */ jsx(SelectItem, { value: d, children: d }, d))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "Condition" }),
          /* @__PURE__ */ jsxs(Select, { value: cond, onValueChange: setCond, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: ALL, children: "All" }),
              CONDITIONS.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: c, children: c }, c))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "Verifier" }),
          /* @__PURE__ */ jsx(Input, { placeholder: "email contains…", value: verifier, onChange: (e) => setVerifier(e.target.value) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-3", children: [
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase text-muted-foreground", children: "Total" }),
        /* @__PURE__ */ jsx("div", { className: "text-3xl font-semibold", children: summary.total })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase text-muted-foreground", children: "By department" }),
        /* @__PURE__ */ jsx("div", { className: "text-sm mt-1", children: Object.entries(summary.byDept).map(([k, v]) => `${k}: ${v}`).join("  ·  ") || "—" })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase text-muted-foreground", children: "By condition" }),
        /* @__PURE__ */ jsx("div", { className: "text-sm mt-1", children: Object.entries(summary.byCond).map(([k, v]) => `${k}: ${v}`).join("  ·  ") || "—" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Preview" }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "overflow-x-auto", children: isLoading ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" }) : rows.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No verifications match your filters." }) : /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Asset ID" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Description" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Department" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Condition" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Verified by" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Date & time" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: rows.map((r, i) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: r.asset_id }),
          /* @__PURE__ */ jsx(TableCell, { children: r.description }),
          /* @__PURE__ */ jsx(TableCell, { children: r.department }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(ConditionBadge, { value: r.condition }) }),
          /* @__PURE__ */ jsx(TableCell, { children: r.verified_by }),
          /* @__PURE__ */ jsx(TableCell, { children: r.verified_at })
        ] }, i)) })
      ] }) })
    ] })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsx(AppLayout, { children: /* @__PURE__ */ jsx(ReportsPage, {}) });
export {
  SplitComponent as component
};
