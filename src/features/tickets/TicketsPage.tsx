import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { PriorityBadge, StatusBadge } from "../shared/badges";
import {
  CATEGORIES, DEPARTMENTS, PRIORITIES, STATUSES,
  type Department, type Profile, type Ticket, type TicketCategory, type TicketComment,
  type TicketPriority, type TicketStatus,
} from "@/lib/types";
import { Plus, Paperclip, Search, LifeBuoy, AlertOctagon, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export function TicketsPage() {
  const { user, role } = useAuth();
  const isStaff = role === "admin" || role === "technician";
  const qc = useQueryClient();
  const [tab, setTab] = React.useState("queue");
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<Ticket | null>(null);
  const [search, setSearch] = React.useState("");
  const [fStatus, setFStatus] = React.useState<string>("all");
  const [fPriority, setFPriority] = React.useState<string>("all");
  const [fCategory, setFCategory] = React.useState<string>("all");

  const { data: profiles } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => (await supabase.from("profiles").select("*")).data as Profile[] | null,
  });

  const { data: tickets } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const { data } = await supabase.from("tickets").select("*").order("updated_at", { ascending: false });
      return (data ?? []) as Ticket[];
    },
  });

  const all = tickets ?? [];
  const stats = React.useMemo(() => {
    const open = all.filter((t) => t.status !== "Resolved" && t.status !== "Closed").length;
    const urgent = all.filter((t) => (t.priority === "Critical" || t.priority === "High") && t.status !== "Resolved" && t.status !== "Closed").length;
    const inProgress = all.filter((t) => t.status === "In Progress").length;
    const resolved = all.filter((t) => t.status === "Resolved" || t.status === "Closed").length;
    return { open, urgent, inProgress, resolved };
  }, [all]);

  const visible = all
    .filter((t) => (tab === "mine" ? t.submitted_by === user?.id : true))
    .filter((t) => (fStatus === "all" ? true : t.status === fStatus))
    .filter((t) => (fPriority === "all" ? true : t.priority === fPriority))
    .filter((t) => (fCategory === "all" ? true : t.category === fCategory))
    .filter((t) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return t.title.toLowerCase().includes(q) || (t.description ?? "").toLowerCase().includes(q);
    });

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
              <LifeBuoy className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Help Desk</h1>
              <p className="text-sm text-muted-foreground max-w-xl">
                Submit, triage and resolve internal IT requests. Track SLAs, assign technicians, and keep a full conversation history per ticket.
              </p>
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="lg"><Plus className="h-4 w-4 mr-2" />New ticket</Button></DialogTrigger>
            <NewTicketDialog onSaved={() => { setOpen(false); qc.invalidateQueries({ queryKey: ["tickets"] }); }} />
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Open" value={stats.open} icon={<Clock className="h-4 w-4" />} tone="text-primary" />
        <StatCard label="Urgent" value={stats.urgent} icon={<AlertOctagon className="h-4 w-4" />} tone="text-destructive" />
        <StatCard label="In progress" value={stats.inProgress} icon={<Clock className="h-4 w-4" />} tone="text-warning" />
        <StatCard label="Resolved" value={stats.resolved} icon={<CheckCircle2 className="h-4 w-4" />} tone="text-success" />
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets…"
            className="pl-8"
          />
        </div>
        <Select value={fStatus} onValueChange={setFStatus}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={fPriority} onValueChange={setFPriority}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={fCategory} onValueChange={setFCategory}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="queue">Ticket queue ({visible.length})</TabsTrigger>
          <TabsTrigger value="mine">My tickets</TabsTrigger>
        </TabsList>
        <TabsContent value="queue"><TicketTable tickets={visible} onSelect={setActive} profiles={profiles ?? []} /></TabsContent>
        <TabsContent value="mine"><TicketTable tickets={visible} onSelect={setActive} profiles={profiles ?? []} /></TabsContent>
      </Tabs>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        {active && (
          <TicketDetail
            ticket={active}
            profiles={profiles ?? []}
            isStaff={isStaff}
            onChanged={() => { qc.invalidateQueries({ queryKey: ["tickets"] }); }}
          />
        )}
      </Dialog>
    </div>
  );
}

function StatCard({ label, value, icon, tone }: { label: string; value: number; icon: React.ReactNode; tone: string }) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <div className={`flex items-center gap-2 text-xs font-medium ${tone}`}>{icon}{label}</div>
        <div className="text-2xl font-semibold mt-1">{value}</div>
      </CardContent>
    </Card>
  );
}

function TicketTable({
  tickets, onSelect, profiles,
}: { tickets: Ticket[]; onSelect: (t: Ticket) => void; profiles: Profile[] }) {
  const nameOf = (id: string | null) => profiles.find((p) => p.id === id)?.full_name ?? "—";
  if (tickets.length === 0) return <p className="text-sm text-muted-foreground p-4">No tickets.</p>;
  return (
    <div className="bg-card border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead><TableHead>Category</TableHead>
            <TableHead>Priority</TableHead><TableHead>Status</TableHead>
            <TableHead>Department</TableHead><TableHead>Assigned</TableHead>
            <TableHead>Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((t) => (
            <TableRow key={t.id} onClick={() => onSelect(t)} className="cursor-pointer">
              <TableCell className="font-medium">{t.title}</TableCell>
              <TableCell>{t.category}</TableCell>
              <TableCell><PriorityBadge value={t.priority} /></TableCell>
              <TableCell><StatusBadge value={t.status} /></TableCell>
              <TableCell>{t.department ?? "—"}</TableCell>
              <TableCell>{nameOf(t.assigned_to)}</TableCell>
              <TableCell className="text-muted-foreground text-xs">{format(new Date(t.updated_at), "PPp")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function NewTicketDialog({ onSaved }: { onSaved: () => void }) {
  const { user } = useAuth();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState<TicketCategory>("Other");
  const [priority, setPriority] = React.useState<TicketPriority>("Medium");
  const [department, setDepartment] = React.useState<Department>("IT");
  const [file, setFile] = React.useState<File | null>(null);
  const [busy, setBusy] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    let attachment_url: string | null = null;
    if (file) {
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const up = await supabase.storage.from("ticket-attachments").upload(path, file);
      if (up.error) { setBusy(false); return toast.error(up.error.message); }
      const pub = supabase.storage.from("ticket-attachments").getPublicUrl(path);
      attachment_url = pub.data.publicUrl;
    }
    const { error } = await supabase.from("tickets").insert({
      title, description, category, priority, department,
      submitted_by: user.id, attachment_url,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Ticket created");
    onSaved();
  };

  return (
    <DialogContent className="max-w-xl">
      <DialogHeader><DialogTitle>New ticket</DialogTitle></DialogHeader>
      <form onSubmit={submit} className="space-y-3">
        <div><Label>Title</Label><Input required value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label>Description</Label><Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as TicketCategory)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as TicketPriority)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Department</Label>
            <Select value={department} onValueChange={(v) => setDepartment(v as Department)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>Attachment (optional)</Label>
          <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </div>
        <DialogFooter><Button type="submit" disabled={busy}>{busy ? "Creating…" : "Create ticket"}</Button></DialogFooter>
      </form>
    </DialogContent>
  );
}

function TicketDetail({
  ticket, profiles, isStaff, onChanged,
}: { ticket: Ticket; profiles: Profile[]; isStaff: boolean; onChanged: () => void }) {
  const { user } = useAuth();
  const [status, setStatus] = React.useState<TicketStatus>(ticket.status);
  const [assignee, setAssignee] = React.useState<string>(ticket.assigned_to ?? "__none__");
  const [body, setBody] = React.useState("");
  const [internal, setInternal] = React.useState(false);

  const { data: comments, refetch } = useQuery({
    queryKey: ["comments", ticket.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("ticket_comments").select("*")
        .eq("ticket_id", ticket.id).order("created_at", { ascending: true });
      return (data ?? []) as TicketComment[];
    },
  });

  const updateMeta = async () => {
    const patch: Record<string, unknown> = { status, assigned_to: assignee === "__none__" ? null : assignee };
    if (status === "Resolved" && !ticket.resolved_at) patch.resolved_at = new Date().toISOString();
    const { error } = await supabase.from("tickets").update(patch).eq("id", ticket.id);
    if (error) return toast.error(error.message);
    toast.success("Ticket updated");
    onChanged();
  };

  const addComment = async () => {
    if (!body.trim() || !user) return;
    const { error } = await supabase.from("ticket_comments").insert({
      ticket_id: ticket.id, author_id: user.id, body, is_internal: internal,
    });
    if (error) return toast.error(error.message);
    setBody(""); setInternal(false); refetch();
  };

  const visibleComments = (comments ?? []).filter((c) => isStaff || !c.is_internal);
  const nameOf = (id: string) => profiles.find((p) => p.id === id)?.full_name ?? profiles.find((p) => p.id === id)?.email ?? "—";

  return (
    <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
      <DialogHeader><DialogTitle>{ticket.title}</DialogTitle></DialogHeader>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs">
          <PriorityBadge value={ticket.priority} />
          <StatusBadge value={ticket.status} />
          <span className="text-muted-foreground">· {ticket.category} · {ticket.department ?? "—"}</span>
        </div>
        <Card><CardContent className="pt-6 text-sm whitespace-pre-wrap">{ticket.description || "—"}</CardContent></Card>

        {ticket.attachment_url && (
          <a href={ticket.attachment_url} target="_blank" rel="noreferrer"
             className="inline-flex items-center text-sm text-primary hover:underline">
            <Paperclip className="h-4 w-4 mr-1" /> Attachment
          </a>
        )}

        {isStaff && (
          <Card>
            <CardHeader><CardTitle className="text-base">Manage</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as TicketStatus)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Assign to</Label>
                <Select value={assignee} onValueChange={setAssignee}>
                  <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Unassigned</SelectItem>
                    {profiles.map((p) => <SelectItem key={p.id} value={p.id}>{p.full_name ?? p.email}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 flex justify-end">
                <Button size="sm" onClick={updateMeta}>Save changes</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle className="text-base">Conversation</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {visibleComments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet.</p>}
            {visibleComments.map((c) => (
              <div key={c.id} className={`p-3 rounded-md text-sm ${c.is_internal ? "bg-warning/10 border border-warning/30" : "bg-muted"}`}>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{nameOf(c.author_id)} {c.is_internal && "· internal"}</span>
                  <span>{format(new Date(c.created_at), "PPp")}</span>
                </div>
                <div className="whitespace-pre-wrap">{c.body}</div>
              </div>
            ))}
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Add a comment…" rows={3} />
            <div className="flex items-center justify-between">
              {isStaff ? (
                <label className="flex items-center gap-2 text-xs">
                  <Switch checked={internal} onCheckedChange={setInternal} /> Internal note
                </label>
              ) : <span />}
              <Button onClick={addComment} disabled={!body.trim()}>Post comment</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DialogContent>
  );
}
