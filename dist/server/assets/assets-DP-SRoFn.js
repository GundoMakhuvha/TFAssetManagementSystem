import { jsxs, jsx } from "react/jsx-runtime";
import { D as DEPARTMENTS, C as CONDITIONS, A as AppLayout } from "./types-Cb6AoSf3.js";
import * as React from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { u as useAuth, s as supabase } from "./router-D4E3tyqy.js";
import { B as Button } from "./button-q-WgH9X2.js";
import { I as Input, L as Label } from "./label-B2FGngv_.js";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-BZ67F7Tp.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, T as Table, e as TableHeader, f as TableRow, g as TableHead, h as TableBody, i as TableCell, C as ConditionBadge, V as VerifiedBadge } from "./badges-DJyUGFS9.js";
import { S as Skeleton } from "./skeleton-BF3obMgU.js";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import "@tanstack/react-router";
import "class-variance-authority";
import "./tipp-focus-logo-DATZ4ULS.js";
import "@supabase/supabase-js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
const ALL = "__all__";
function AssetRegister() {
  const { role } = useAuth();
  const canWrite = role === "admin" || role === "technician";
  const qc = useQueryClient();
  const [search, setSearch] = React.useState("");
  const [dept, setDept] = React.useState(ALL);
  const [cond, setCond] = React.useState(ALL);
  const [editing, setEditing] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const { data: assets, isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const { data, error } = await supabase.from("assets").select("*").eq("is_deleted", false).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    }
  });
  const { data: profiles } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("id, full_name, email, department");
      return data ?? [];
    }
  });
  const filtered = (assets ?? []).filter((a) => {
    if (dept !== ALL && a.department !== dept) return false;
    if (cond !== ALL && a.asset_condition !== cond) return false;
    if (search) {
      const s = search.toLowerCase();
      return [a.asset_id, a.barcode, a.serial_number, a.asset_description, a.assigned_to, a.location].some((v) => (v ?? "").toString().toLowerCase().includes(s));
    }
    return true;
  });
  const onDelete = async (id) => {
    if (!confirm(`Soft-delete asset ${id}?`)) return;
    const { error } = await supabase.from("assets").update({ is_deleted: true }).eq("asset_id", id);
    if (error) return toast.error(error.message);
    toast.success("Asset deleted");
    qc.invalidateQueries({ queryKey: ["assets"] });
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Asset Register" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          filtered.length,
          " of ",
          assets?.length ?? 0,
          " assets"
        ] })
      ] }),
      canWrite && /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: (o) => {
        setOpen(o);
        if (!o) setEditing(null);
      }, children: [
        /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { onClick: () => setEditing(null), children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
          " New asset"
        ] }) }),
        /* @__PURE__ */ jsx(
          AssetFormDialog,
          {
            editing,
            profiles: profiles ?? [],
            onSaved: () => {
              setOpen(false);
              setEditing(null);
              qc.invalidateQueries({ queryKey: ["assets"] });
            }
          },
          editing?.asset_id ?? "new"
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3 flex-wrap items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1 min-w-[220px]", children: [
        /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Search asset id, serial, description, user, location",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "pl-9"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: dept, onValueChange: setDept, children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "w-44", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Department" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: ALL, children: "All departments" }),
          DEPARTMENTS.map((d) => /* @__PURE__ */ jsx(SelectItem, { value: d, children: d }, d))
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: cond, onValueChange: setCond, children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "w-40", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Condition" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: ALL, children: "All conditions" }),
          CONDITIONS.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: c, children: c }, c))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-card rounded-lg border overflow-x-auto", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "p-4 space-y-2", children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-10" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-12 text-center text-muted-foreground", children: [
      "No assets match your filters. ",
      canWrite && "Click “New asset” to add one."
    ] }) : /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Asset ID" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Description" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Department" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Assigned to" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Location" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Condition" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Last verified" }),
        canWrite && /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: filtered.map((a) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: a.asset_id }),
        /* @__PURE__ */ jsx(TableCell, { children: a.asset_description ?? /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "—" }) }),
        /* @__PURE__ */ jsx(TableCell, { children: a.department ?? "—" }),
        /* @__PURE__ */ jsx(TableCell, { children: a.assigned_to ?? "—" }),
        /* @__PURE__ */ jsx(TableCell, { children: a.location ?? "—" }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(ConditionBadge, { value: a.asset_condition }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(VerifiedBadge, { date: a.last_verified_date }) }),
        canWrite && /* @__PURE__ */ jsxs(TableCell, { className: "text-right", children: [
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => {
            setEditing(a);
            setOpen(true);
          }, children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => onDelete(a.asset_id), children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
        ] })
      ] }, a.asset_id)) })
    ] }) })
  ] });
}
function AssetFormDialog({
  editing,
  profiles,
  onSaved
}) {
  const [form, setForm] = React.useState(() => ({
    asset_id: editing?.asset_id ?? "",
    serial_number: editing?.serial_number ?? "",
    asset_description: editing?.asset_description ?? "",
    assigned_to: editing?.assigned_to ?? "",
    location: editing?.location ?? "",
    department: editing?.department ?? "IT",
    asset_condition: editing?.asset_condition ?? "Good",
    reallocated_to: editing?.reallocated_to ?? "",
    returned_date: editing?.returned_date?.slice(0, 10) ?? ""
  }));
  const [busy, setBusy] = React.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!form.asset_id) return toast.error("Asset ID is required");
    setBusy(true);
    const payload = {
      asset_id: form.asset_id,
      barcode: form.asset_id,
      serial_number: form.serial_number || null,
      asset_description: form.asset_description || null,
      assigned_to: form.assigned_to || null,
      location: form.location || null,
      department: form.department,
      asset_condition: form.asset_condition,
      reallocated_to: form.reallocated_to || null,
      returned_date: form.returned_date ? new Date(form.returned_date).toISOString() : null,
      is_deleted: false
    };
    const { error } = editing ? await supabase.from("assets").update(payload).eq("asset_id", editing.asset_id) : await supabase.from("assets").insert(payload);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Asset updated" : "Asset created");
    onSaved();
  };
  return /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: editing ? "Edit asset" : "New asset" }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "grid gap-4 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsx(Field, { label: "Asset ID (barcode)", children: /* @__PURE__ */ jsx(Input, { value: form.asset_id, onChange: (e) => setForm({ ...form, asset_id: e.target.value }), disabled: !!editing, required: true }) }),
      /* @__PURE__ */ jsx(Field, { label: "Serial number", children: /* @__PURE__ */ jsx(Input, { value: form.serial_number, onChange: (e) => setForm({ ...form, serial_number: e.target.value }) }) }),
      /* @__PURE__ */ jsx(Field, { label: "Description", className: "sm:col-span-2", children: /* @__PURE__ */ jsx(Input, { value: form.asset_description, onChange: (e) => setForm({ ...form, asset_description: e.target.value }) }) }),
      /* @__PURE__ */ jsx(Field, { label: "Assigned to", children: /* @__PURE__ */ jsx(Input, { value: form.assigned_to, onChange: (e) => setForm({ ...form, assigned_to: e.target.value }), placeholder: "Name or email" }) }),
      /* @__PURE__ */ jsx(Field, { label: "Location", children: /* @__PURE__ */ jsx(Input, { value: form.location, onChange: (e) => setForm({ ...form, location: e.target.value }) }) }),
      /* @__PURE__ */ jsx(Field, { label: "Department", children: /* @__PURE__ */ jsxs(Select, { value: form.department, onValueChange: (v) => setForm({ ...form, department: v }), children: [
        /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsx(SelectContent, { children: DEPARTMENTS.map((d) => /* @__PURE__ */ jsx(SelectItem, { value: d, children: d }, d)) })
      ] }) }),
      /* @__PURE__ */ jsx(Field, { label: "Condition", children: /* @__PURE__ */ jsxs(Select, { value: form.asset_condition, onValueChange: (v) => setForm({ ...form, asset_condition: v }), children: [
        /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsx(SelectContent, { children: CONDITIONS.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: c, children: c }, c)) })
      ] }) }),
      /* @__PURE__ */ jsx(Field, { label: "Reallocated to", children: /* @__PURE__ */ jsxs(Select, { value: form.reallocated_to || ALL, onValueChange: (v) => setForm({ ...form, reallocated_to: v === ALL ? "" : v }), children: [
        /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select user" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: ALL, children: "None" }),
          profiles.map((p) => /* @__PURE__ */ jsx(SelectItem, { value: p.id, children: p.full_name ?? p.email }, p.id))
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Field, { label: "Returned date", children: /* @__PURE__ */ jsx(Input, { type: "date", value: form.returned_date, onChange: (e) => setForm({ ...form, returned_date: e.target.value }) }) }),
      /* @__PURE__ */ jsx(DialogFooter, { className: "sm:col-span-2", children: /* @__PURE__ */ jsx(Button, { type: "submit", disabled: busy, children: busy ? "Saving…" : editing ? "Save changes" : "Create asset" }) })
    ] })
  ] });
}
function Field({ label, children, className = "" }) {
  return /* @__PURE__ */ jsxs("div", { className: `space-y-1 ${className}`, children: [
    /* @__PURE__ */ jsx(Label, { children: label }),
    children
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsx(AppLayout, { children: /* @__PURE__ */ jsx(AssetRegister, {}) });
export {
  SplitComponent as component
};
