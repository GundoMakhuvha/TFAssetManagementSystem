import { jsx, jsxs } from "react/jsx-runtime";
import { S as STATUSES, P as PRIORITIES, a as CATEGORIES, D as DEPARTMENTS, A as AppLayout } from "./types-Cb6AoSf3.js";
import * as React from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { d as cn, u as useAuth, s as supabase, C as Card, c as CardContent, a as CardHeader, b as CardTitle } from "./router-D4E3tyqy.js";
import { B as Button } from "./button-q-WgH9X2.js";
import { I as Input, L as Label } from "./label-B2FGngv_.js";
import { T as Textarea } from "./textarea-BPxMoBDl.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-DEENpb5a.js";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-BZ67F7Tp.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, T as Table, e as TableHeader, f as TableRow, g as TableHead, h as TableBody, i as TableCell, P as PriorityBadge, j as StatusBadge } from "./badges-DJyUGFS9.js";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { LifeBuoy, Plus, Clock, AlertOctagon, CheckCircle2, Search, Paperclip } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import "@tanstack/react-router";
import "class-variance-authority";
import "./tipp-focus-logo-DATZ4ULS.js";
import "@supabase/supabase-js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
import "@radix-ui/react-tabs";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
const Switch = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SwitchPrimitives.Root,
  {
    className: cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsx(
      SwitchPrimitives.Thumb,
      {
        className: cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = SwitchPrimitives.Root.displayName;
function TicketsPage() {
  const { user, role } = useAuth();
  const isStaff = role === "admin" || role === "technician";
  const qc = useQueryClient();
  const [tab, setTab] = React.useState("queue");
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [fStatus, setFStatus] = React.useState("all");
  const [fPriority, setFPriority] = React.useState("all");
  const [fCategory, setFCategory] = React.useState("all");
  const { data: profiles } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => (await supabase.from("profiles").select("*")).data
  });
  const { data: tickets } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const { data } = await supabase.from("tickets").select("*").order("updated_at", { ascending: false });
      return data ?? [];
    }
  });
  const all = tickets ?? [];
  const stats = React.useMemo(() => {
    const open2 = all.filter((t) => t.status !== "Resolved" && t.status !== "Closed").length;
    const urgent = all.filter((t) => (t.priority === "Critical" || t.priority === "High") && t.status !== "Resolved" && t.status !== "Closed").length;
    const inProgress = all.filter((t) => t.status === "In Progress").length;
    const resolved = all.filter((t) => t.status === "Resolved" || t.status === "Closed").length;
    return { open: open2, urgent, inProgress, resolved };
  }, [all]);
  const visible = all.filter((t) => tab === "mine" ? t.submitted_by === user?.id : true).filter((t) => fStatus === "all" ? true : t.status === fStatus).filter((t) => fPriority === "all" ? true : t.priority === fPriority).filter((t) => fCategory === "all" ? true : t.category === fCategory).filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return t.title.toLowerCase().includes(q) || (t.description ?? "").toLowerCase().includes(q);
  });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "rounded-xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-lg bg-primary/15 text-primary flex items-center justify-center", children: /* @__PURE__ */ jsx(LifeBuoy, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Help Desk" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground max-w-xl", children: "Submit, triage and resolve internal IT requests. Track SLAs, assign technicians, and keep a full conversation history per ticket." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { size: "lg", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-2" }),
          "New ticket"
        ] }) }),
        /* @__PURE__ */ jsx(NewTicketDialog, { onSaved: () => {
          setOpen(false);
          qc.invalidateQueries({ queryKey: ["tickets"] });
        } })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsx(StatCard, { label: "Open", value: stats.open, icon: /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }), tone: "text-primary" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Urgent", value: stats.urgent, icon: /* @__PURE__ */ jsx(AlertOctagon, { className: "h-4 w-4" }), tone: "text-destructive" }),
      /* @__PURE__ */ jsx(StatCard, { label: "In progress", value: stats.inProgress, icon: /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }), tone: "text-warning" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Resolved", value: stats.resolved, icon: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }), tone: "text-success" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search tickets…",
            className: "pl-8"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: fStatus, onValueChange: setFStatus, children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[150px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Status" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All statuses" }),
          STATUSES.map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s, children: s }, s))
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: fPriority, onValueChange: setFPriority, children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[150px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Priority" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All priorities" }),
          PRIORITIES.map((p) => /* @__PURE__ */ jsx(SelectItem, { value: p, children: p }, p))
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: fCategory, onValueChange: setFCategory, children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[160px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Category" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All categories" }),
          CATEGORIES.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: c, children: c }, c))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { value: tab, onValueChange: setTab, children: [
      /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "queue", children: [
          "Ticket queue (",
          visible.length,
          ")"
        ] }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "mine", children: "My tickets" })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "queue", children: /* @__PURE__ */ jsx(TicketTable, { tickets: visible, onSelect: setActive, profiles: profiles ?? [] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "mine", children: /* @__PURE__ */ jsx(TicketTable, { tickets: visible, onSelect: setActive, profiles: profiles ?? [] }) })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: !!active, onOpenChange: (o) => !o && setActive(null), children: active && /* @__PURE__ */ jsx(
      TicketDetail,
      {
        ticket: active,
        profiles: profiles ?? [],
        isStaff,
        onChanged: () => {
          qc.invalidateQueries({ queryKey: ["tickets"] });
        }
      }
    ) })
  ] });
}
function StatCard({ label, value, icon, tone }) {
  return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-5 pb-4", children: [
    /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 text-xs font-medium ${tone}`, children: [
      icon,
      label
    ] }),
    /* @__PURE__ */ jsx("div", { className: "text-2xl font-semibold mt-1", children: value })
  ] }) });
}
function TicketTable({
  tickets,
  onSelect,
  profiles
}) {
  const nameOf = (id) => profiles.find((p) => p.id === id)?.full_name ?? "—";
  if (tickets.length === 0) return /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground p-4", children: "No tickets." });
  return /* @__PURE__ */ jsx("div", { className: "bg-card border rounded-lg overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
    /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
      /* @__PURE__ */ jsx(TableHead, { children: "Title" }),
      /* @__PURE__ */ jsx(TableHead, { children: "Category" }),
      /* @__PURE__ */ jsx(TableHead, { children: "Priority" }),
      /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
      /* @__PURE__ */ jsx(TableHead, { children: "Department" }),
      /* @__PURE__ */ jsx(TableHead, { children: "Assigned" }),
      /* @__PURE__ */ jsx(TableHead, { children: "Updated" })
    ] }) }),
    /* @__PURE__ */ jsx(TableBody, { children: tickets.map((t) => /* @__PURE__ */ jsxs(TableRow, { onClick: () => onSelect(t), className: "cursor-pointer", children: [
      /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: t.title }),
      /* @__PURE__ */ jsx(TableCell, { children: t.category }),
      /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(PriorityBadge, { value: t.priority }) }),
      /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(StatusBadge, { value: t.status }) }),
      /* @__PURE__ */ jsx(TableCell, { children: t.department ?? "—" }),
      /* @__PURE__ */ jsx(TableCell, { children: nameOf(t.assigned_to) }),
      /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground text-xs", children: format(new Date(t.updated_at), "PPp") })
    ] }, t.id)) })
  ] }) });
}
function NewTicketDialog({ onSaved }) {
  const { user } = useAuth();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("Other");
  const [priority, setPriority] = React.useState("Medium");
  const [department, setDepartment] = React.useState("IT");
  const [file, setFile] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    let attachment_url = null;
    if (file) {
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const up = await supabase.storage.from("ticket-attachments").upload(path, file);
      if (up.error) {
        setBusy(false);
        return toast.error(up.error.message);
      }
      const pub = supabase.storage.from("ticket-attachments").getPublicUrl(path);
      attachment_url = pub.data.publicUrl;
    }
    const { error } = await supabase.from("tickets").insert({
      title,
      description,
      category,
      priority,
      department,
      submitted_by: user.id,
      attachment_url
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Ticket created");
    onSaved();
  };
  return /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-xl", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "New ticket" }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { children: "Title" }),
        /* @__PURE__ */ jsx(Input, { required: true, value: title, onChange: (e) => setTitle(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { children: "Description" }),
        /* @__PURE__ */ jsx(Textarea, { rows: 4, value: description, onChange: (e) => setDescription(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Category" }),
          /* @__PURE__ */ jsxs(Select, { value: category, onValueChange: (v) => setCategory(v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsx(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: c, children: c }, c)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Priority" }),
          /* @__PURE__ */ jsxs(Select, { value: priority, onValueChange: (v) => setPriority(v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsx(SelectContent, { children: PRIORITIES.map((p) => /* @__PURE__ */ jsx(SelectItem, { value: p, children: p }, p)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Department" }),
          /* @__PURE__ */ jsxs(Select, { value: department, onValueChange: (v) => setDepartment(v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsx(SelectContent, { children: DEPARTMENTS.map((d) => /* @__PURE__ */ jsx(SelectItem, { value: d, children: d }, d)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { children: "Attachment (optional)" }),
        /* @__PURE__ */ jsx(Input, { type: "file", onChange: (e) => setFile(e.target.files?.[0] ?? null) })
      ] }),
      /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { type: "submit", disabled: busy, children: busy ? "Creating…" : "Create ticket" }) })
    ] })
  ] });
}
function TicketDetail({
  ticket,
  profiles,
  isStaff,
  onChanged
}) {
  const { user } = useAuth();
  const [status, setStatus] = React.useState(ticket.status);
  const [assignee, setAssignee] = React.useState(ticket.assigned_to ?? "__none__");
  const [body, setBody] = React.useState("");
  const [internal, setInternal] = React.useState(false);
  const { data: comments, refetch } = useQuery({
    queryKey: ["comments", ticket.id],
    queryFn: async () => {
      const { data } = await supabase.from("ticket_comments").select("*").eq("ticket_id", ticket.id).order("created_at", { ascending: true });
      return data ?? [];
    }
  });
  const updateMeta = async () => {
    const patch = { status, assigned_to: assignee === "__none__" ? null : assignee };
    if (status === "Resolved" && !ticket.resolved_at) patch.resolved_at = (/* @__PURE__ */ new Date()).toISOString();
    const { error } = await supabase.from("tickets").update(patch).eq("id", ticket.id);
    if (error) return toast.error(error.message);
    toast.success("Ticket updated");
    onChanged();
  };
  const addComment = async () => {
    if (!body.trim() || !user) return;
    const { error } = await supabase.from("ticket_comments").insert({
      ticket_id: ticket.id,
      author_id: user.id,
      body,
      is_internal: internal
    });
    if (error) return toast.error(error.message);
    setBody("");
    setInternal(false);
    refetch();
  };
  const visibleComments = (comments ?? []).filter((c) => isStaff || !c.is_internal);
  const nameOf = (id) => profiles.find((p) => p.id === id)?.full_name ?? profiles.find((p) => p.id === id)?.email ?? "—";
  return /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl max-h-[85vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: ticket.title }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
        /* @__PURE__ */ jsx(PriorityBadge, { value: ticket.priority }),
        /* @__PURE__ */ jsx(StatusBadge, { value: ticket.status }),
        /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
          "· ",
          ticket.category,
          " · ",
          ticket.department ?? "—"
        ] })
      ] }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6 text-sm whitespace-pre-wrap", children: ticket.description || "—" }) }),
      ticket.attachment_url && /* @__PURE__ */ jsxs(
        "a",
        {
          href: ticket.attachment_url,
          target: "_blank",
          rel: "noreferrer",
          className: "inline-flex items-center text-sm text-primary hover:underline",
          children: [
            /* @__PURE__ */ jsx(Paperclip, { className: "h-4 w-4 mr-1" }),
            " Attachment"
          ]
        }
      ),
      isStaff && /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Manage" }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Status" }),
            /* @__PURE__ */ jsxs(Select, { value: status, onValueChange: (v) => setStatus(v), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsx(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s, children: s }, s)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Assign to" }),
            /* @__PURE__ */ jsxs(Select, { value: assignee, onValueChange: setAssignee, children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Unassigned" }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "__none__", children: "Unassigned" }),
                profiles.map((p) => /* @__PURE__ */ jsx(SelectItem, { value: p.id, children: p.full_name ?? p.email }, p.id))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "col-span-2 flex justify-end", children: /* @__PURE__ */ jsx(Button, { size: "sm", onClick: updateMeta, children: "Save changes" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Conversation" }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
          visibleComments.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No comments yet." }),
          visibleComments.map((c) => /* @__PURE__ */ jsxs("div", { className: `p-3 rounded-md text-sm ${c.is_internal ? "bg-warning/10 border border-warning/30" : "bg-muted"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mb-1", children: [
              /* @__PURE__ */ jsxs("span", { children: [
                nameOf(c.author_id),
                " ",
                c.is_internal && "· internal"
              ] }),
              /* @__PURE__ */ jsx("span", { children: format(new Date(c.created_at), "PPp") })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "whitespace-pre-wrap", children: c.body })
          ] }, c.id)),
          /* @__PURE__ */ jsx(Textarea, { value: body, onChange: (e) => setBody(e.target.value), placeholder: "Add a comment…", rows: 3 }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            isStaff ? /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-xs", children: [
              /* @__PURE__ */ jsx(Switch, { checked: internal, onCheckedChange: setInternal }),
              " Internal note"
            ] }) : /* @__PURE__ */ jsx("span", {}),
            /* @__PURE__ */ jsx(Button, { onClick: addComment, disabled: !body.trim(), children: "Post comment" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsx(AppLayout, { children: /* @__PURE__ */ jsx(TicketsPage, {}) });
export {
  SplitComponent as component
};
