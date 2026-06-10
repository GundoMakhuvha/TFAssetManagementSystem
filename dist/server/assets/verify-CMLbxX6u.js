import { jsxs, jsx } from "react/jsx-runtime";
import { C as CONDITIONS, A as AppLayout } from "./types-Cb6AoSf3.js";
import * as React from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { u as useAuth, s as supabase, C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./router-D4E3tyqy.js";
import { B as Button } from "./button-q-WgH9X2.js";
import { L as Label, I as Input } from "./label-B2FGngv_.js";
import { C as ConditionBadge, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, T as Table, e as TableHeader, f as TableRow, g as TableHead, h as TableBody, i as TableCell, V as VerifiedBadge } from "./badges-DJyUGFS9.js";
import { T as Textarea } from "./textarea-BPxMoBDl.js";
import { toast } from "sonner";
import { CameraOff, Camera, Search } from "lucide-react";
import { format } from "date-fns";
import "@tanstack/react-router";
import "class-variance-authority";
import "./tipp-focus-logo-DATZ4ULS.js";
import "@supabase/supabase-js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
function VerificationPage() {
  const { user, role } = useAuth();
  const canVerify = role === "admin" || role === "technician";
  const qc = useQueryClient();
  const [scanning, setScanning] = React.useState(false);
  const [lookup, setLookup] = React.useState("");
  const [asset, setAsset] = React.useState(null);
  const [condition, setCondition] = React.useState("Good");
  const [notes, setNotes] = React.useState("");
  const [method, setMethod] = React.useState("manual");
  const scannerRef = React.useRef(null);
  const { data: recent } = useQuery({
    queryKey: ["recent-verifications"],
    queryFn: async () => {
      const { data } = await supabase.from("verifications").select("*").order("verified_at", { ascending: false }).limit(50);
      return data ?? [];
    }
  });
  const findAsset = React.useCallback(async (code) => {
    const { data, error } = await supabase.from("assets").select("*").or(`asset_id.eq.${code},barcode.eq.${code},serial_number.eq.${code}`).eq("is_deleted", false).maybeSingle();
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data) {
      toast.error(`No asset found for "${code}"`);
      return;
    }
    const a = data;
    setAsset(a);
    setCondition(a.asset_condition ?? "Good");
    toast.success(`Found ${a.asset_id}`);
  }, []);
  const startScan = async () => {
    setScanning(true);
    setMethod("barcode");
    await new Promise((r) => setTimeout(r, 30));
    try {
      const inst = new Html5Qrcode("scanner-region");
      scannerRef.current = inst;
      await inst.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 260, height: 160 } },
        async (decoded) => {
          await stopScan();
          await findAsset(decoded.trim());
        },
        () => void 0
      );
    } catch (e) {
      setScanning(false);
      toast.error("Camera unavailable. Use manual lookup.");
      console.error(e);
    }
  };
  const stopScan = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      }
    } catch {
    }
    scannerRef.current = null;
    setScanning(false);
  };
  React.useEffect(() => () => {
    void stopScan();
  }, []);
  const submitVerification = async () => {
    if (!asset || !user?.email) return;
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const { error: insErr } = await supabase.from("verifications").insert({
      asset_id: asset.asset_id,
      verified_by: user.email,
      verified_at: nowIso,
      method,
      condition_at_verification: condition,
      notes: notes || null
    });
    if (insErr) return toast.error(insErr.message);
    const { error: updErr } = await supabase.from("assets").update({
      last_verified_date: nowIso,
      verified_by: user.email,
      asset_condition: condition
    }).eq("asset_id", asset.asset_id);
    if (updErr) return toast.error(updErr.message);
    toast.success(`Verified ${asset.asset_id}`);
    setAsset(null);
    setNotes("");
    setLookup("");
    qc.invalidateQueries({ queryKey: ["recent-verifications"] });
    qc.invalidateQueries({ queryKey: ["assets"] });
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Asset Verification" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Scan a barcode or look up an asset to record verification." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Scanner" }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "aspect-video w-full bg-muted rounded-md overflow-hidden flex items-center justify-center", children: [
            /* @__PURE__ */ jsx("div", { id: "scanner-region", className: "w-full h-full" }),
            !scanning && /* @__PURE__ */ jsx("div", { className: "absolute text-sm text-muted-foreground", children: "Camera off" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: scanning ? /* @__PURE__ */ jsxs(Button, { variant: "secondary", onClick: stopScan, children: [
            /* @__PURE__ */ jsx(CameraOff, { className: "h-4 w-4 mr-2" }),
            "Stop"
          ] }) : /* @__PURE__ */ jsxs(Button, { onClick: startScan, disabled: !canVerify, children: [
            /* @__PURE__ */ jsx(Camera, { className: "h-4 w-4 mr-2" }),
            "Start camera"
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "border-t pt-4 space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Manual lookup" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Asset ID or serial number",
                  value: lookup,
                  onChange: (e) => setLookup(e.target.value),
                  onKeyDown: (e) => {
                    if (e.key === "Enter") {
                      setMethod("manual");
                      findAsset(lookup.trim());
                    }
                  }
                }
              ),
              /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => {
                setMethod("manual");
                findAsset(lookup.trim());
              }, children: /* @__PURE__ */ jsx(Search, { className: "h-4 w-4" }) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Asset details" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: !asset ? /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Scan or look up an asset to begin verification." }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 text-sm", children: [
            /* @__PURE__ */ jsx(Detail, { label: "Asset ID", value: asset.asset_id }),
            /* @__PURE__ */ jsx(Detail, { label: "Serial", value: asset.serial_number }),
            /* @__PURE__ */ jsx(Detail, { label: "Description", value: asset.asset_description }),
            /* @__PURE__ */ jsx(Detail, { label: "Department", value: asset.department }),
            /* @__PURE__ */ jsx(Detail, { label: "Assigned to", value: asset.assigned_to }),
            /* @__PURE__ */ jsx(Detail, { label: "Location", value: asset.location }),
            /* @__PURE__ */ jsx(Detail, { label: "Last verified", value: asset.last_verified_date ? format(new Date(asset.last_verified_date), "PPp") : "Never" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Current condition" }),
              /* @__PURE__ */ jsx(ConditionBadge, { value: asset.asset_condition })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 border-t pt-4", children: [
            /* @__PURE__ */ jsx(Label, { children: "Confirm condition" }),
            /* @__PURE__ */ jsxs(Select, { value: condition, onValueChange: (v) => setCondition(v), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsx(SelectContent, { children: CONDITIONS.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: c, children: c }, c)) })
            ] }),
            /* @__PURE__ */ jsx(Label, { children: "Notes (optional)" }),
            /* @__PURE__ */ jsx(Textarea, { value: notes, onChange: (e) => setNotes(e.target.value), rows: 2 }),
            /* @__PURE__ */ jsx(Button, { className: "w-full", onClick: submitVerification, disabled: !canVerify, children: "Confirm verification" })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Recent verifications" }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "overflow-x-auto", children: !recent || recent.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No verifications yet." }) : /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Asset" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Verified by" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Method" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Condition" }),
          /* @__PURE__ */ jsx(TableHead, { children: "When" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: recent.map((v) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: v.asset_id }),
          /* @__PURE__ */ jsx(TableCell, { children: v.verified_by }),
          /* @__PURE__ */ jsx(TableCell, { className: "capitalize", children: v.method }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(ConditionBadge, { value: v.condition_at_verification }) }),
          /* @__PURE__ */ jsx(TableCell, { children: format(new Date(v.verified_at), "PPp") }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(VerifiedBadge, { date: v.verified_at }) })
        ] }, v.id)) })
      ] }) })
    ] })
  ] });
}
function Detail({ label, value }) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("div", { className: "font-medium", children: value ?? "—" })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsx(AppLayout, { children: /* @__PURE__ */ jsx(VerificationPage, {}) });
export {
  SplitComponent as component
};
