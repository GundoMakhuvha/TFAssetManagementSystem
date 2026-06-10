import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { u as useAuth, C as Card, a as CardHeader, b as CardTitle, c as CardContent, s as supabase } from "./router-D4E3tyqy.js";
import { B as Button } from "./button-q-WgH9X2.js";
import { L as Label, I as Input } from "./label-B2FGngv_.js";
import { T as Tabs, c as TabsContent } from "./tabs-DEENpb5a.js";
import { toast } from "sonner";
import { l as logoUrl } from "./tipp-focus-logo-DATZ4ULS.js";
import "@tanstack/react-query";
import "@supabase/supabase-js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "@radix-ui/react-tabs";
function LoginPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = React.useState("signin");
  React.useEffect(() => {
    if (!loading && user) nav({ to: "/" });
  }, [user, loading, nav]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen grid lg:grid-cols-2 bg-background", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "hidden lg:flex flex-col justify-between p-12 text-white",
        style: { background: "var(--gradient-primary)" },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-lg bg-white p-1.5 shadow-md flex items-center justify-center", children: /* @__PURE__ */ jsx("img", { src: logoUrl, alt: "Tipp Focus", className: "h-full w-full object-contain" }) }),
            /* @__PURE__ */ jsx("div", { className: "font-semibold", children: "Tipp Focus" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold leading-tight max-w-md", children: "Asset Management & Help Desk System" }),
            /* @__PURE__ */ jsx("p", { className: "mt-3 text-white/80 max-w-md", children: "Developed By: Gundo Makhuvha" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-white/60", children: "© Tipp Focus" })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-6", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md shadow-[var(--shadow-elegant)]", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Welcome Back!" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Tabs, { value: tab, onValueChange: setTab, children: [
        /* @__PURE__ */ jsx(TabsContent, { value: "signin", children: /* @__PURE__ */ jsx(SignInForm, {}) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "signup", children: /* @__PURE__ */ jsx(SignUpForm, { onDone: () => setTab("signin") }) })
      ] }) })
    ] }) })
  ] });
}
function SignInForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const nav = useNavigate();
  const handle = async (e) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Signed in");
    nav({ to: "/" });
  };
  const reset = async () => {
    if (!email) return toast.error("Enter your email first");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) return toast.error(error.message);
    toast.success("Password reset email sent");
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handle, className: "space-y-3 mt-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(Label, { children: "Email" }),
      /* @__PURE__ */ jsx(Input, { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(Label, { children: "Password" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          type: "password",
          required: true,
          value: password,
          onChange: (e) => setPassword(e.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", disabled: busy, children: busy ? "Signing in…" : "Sign in" }),
    /* @__PURE__ */ jsx("button", { type: "button", onClick: reset, className: "text-xs text-muted-foreground hover:underline", children: "Forgot password?" })
  ] });
}
function SignUpForm({ onDone }) {
  const [email, setEmail] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const handle = async (e) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName }
      }
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created. Check your email to confirm (if required).");
    onDone();
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handle, className: "space-y-3 mt-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(Label, { children: "Full name" }),
      /* @__PURE__ */ jsx(Input, { value: fullName, onChange: (e) => setFullName(e.target.value), required: true })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(Label, { children: "Email" }),
      /* @__PURE__ */ jsx(Input, { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(Label, { children: "Password" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          type: "password",
          required: true,
          minLength: 6,
          value: password,
          onChange: (e) => setPassword(e.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", disabled: busy, children: busy ? "Creating…" : "Create account" }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "The first account created automatically becomes admin." })
  ] });
}
const SplitComponent = LoginPage;
export {
  SplitComponent as component
};
