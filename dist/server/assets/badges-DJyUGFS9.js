import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, Check, ChevronUp } from "lucide-react";
import { d as cn } from "./router-D4E3tyqy.js";
import { B as Badge } from "./types-Cb6AoSf3.js";
const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
const Table = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsx("table", { ref, className: cn("w-full caption-bottom text-sm", className), ...props }) })
);
Table.displayName = "Table";
const TableHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("thead", { ref, className: cn("[&_tr]:border-b", className), ...props }));
TableHeader.displayName = "TableHeader";
const TableBody = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("tbody", { ref, className: cn("[&_tr:last-child]:border-0", className), ...props }));
TableBody.displayName = "TableBody";
const TableFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tfoot",
  {
    ref,
    className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
    ...props
  }
));
TableFooter.displayName = "TableFooter";
const TableRow = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "tr",
    {
      ref,
      className: cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      ),
      ...props
    }
  )
);
TableRow.displayName = "TableRow";
const TableHead = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "th",
  {
    ref,
    className: cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableHead.displayName = "TableHead";
const TableCell = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "td",
  {
    ref,
    className: cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableCell.displayName = "TableCell";
const TableCaption = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("caption", { ref, className: cn("mt-4 text-sm text-muted-foreground", className), ...props }));
TableCaption.displayName = "TableCaption";
function ConditionBadge({ value }) {
  if (!value) return /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "—" });
  const map = {
    Good: "bg-success text-success-foreground",
    Fair: "bg-info text-info-foreground",
    Poor: "bg-warning text-warning-foreground",
    Damaged: "bg-destructive text-destructive-foreground"
  };
  return /* @__PURE__ */ jsx("span", { className: cn("px-2 py-0.5 rounded-md text-xs font-medium", map[value]), children: value });
}
function PriorityBadge({ value }) {
  const map = {
    Low: "bg-muted text-muted-foreground",
    Medium: "bg-info text-info-foreground",
    High: "bg-warning text-warning-foreground",
    Critical: "bg-destructive text-destructive-foreground"
  };
  return /* @__PURE__ */ jsx("span", { className: cn("px-2 py-0.5 rounded-md text-xs font-medium", map[value]), children: value });
}
function StatusBadge({ value }) {
  const map = {
    Open: "bg-info text-info-foreground",
    "In Progress": "bg-primary text-primary-foreground",
    "On Hold": "bg-warning text-warning-foreground",
    Resolved: "bg-success text-success-foreground",
    Closed: "bg-muted text-muted-foreground"
  };
  return /* @__PURE__ */ jsx("span", { className: cn("px-2 py-0.5 rounded-md text-xs font-medium", map[value]), children: value });
}
function VerifiedBadge({ date }) {
  if (!date) return /* @__PURE__ */ jsx(Badge, { variant: "destructive", children: "Never" });
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 864e5);
  if (days <= 1) return /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 rounded-md text-xs bg-success text-success-foreground", children: "Today" });
  if (days <= 30) return /* @__PURE__ */ jsxs("span", { className: "px-2 py-0.5 rounded-md text-xs bg-info text-info-foreground", children: [
    days,
    "d ago"
  ] });
  if (days <= 90) return /* @__PURE__ */ jsxs("span", { className: "px-2 py-0.5 rounded-md text-xs bg-warning text-warning-foreground", children: [
    days,
    "d ago"
  ] });
  return /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 rounded-md text-xs bg-destructive text-destructive-foreground", children: "Overdue" });
}
export {
  ConditionBadge as C,
  PriorityBadge as P,
  Select as S,
  Table as T,
  VerifiedBadge as V,
  SelectTrigger as a,
  SelectValue as b,
  SelectContent as c,
  SelectItem as d,
  TableHeader as e,
  TableRow as f,
  TableHead as g,
  TableBody as h,
  TableCell as i,
  StatusBadge as j
};
