import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, s as supabase } from "./router-D4E3tyqy.js";
import { B as Button } from "./button-q-WgH9X2.js";
import { L as Label, I as Input } from "./label-B2FGngv_.js";
import { toast } from "sonner";
import "@tanstack/react-query";
import "@supabase/supabase-js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
function ResetPasswordPage() {
  const [pwd, setPwd] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const nav = useNavigate();
  const handle = async (e) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    nav({ to: "/" });
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center p-6 bg-background", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Set a new password" }) }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handle, className: "space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx(Label, { children: "New password" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "password",
            minLength: 6,
            required: true,
            value: pwd,
            onChange: (e) => setPwd(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", disabled: busy, children: busy ? "Updating…" : "Update password" })
    ] }) })
  ] }) });
}
const SplitComponent = ResetPasswordPage;
export {
  SplitComponent as component
};
