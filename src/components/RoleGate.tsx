import * as React from "react";
import { useAuth } from "@/lib/auth-context";

export function RoleGate({
  allow,
  children,
  fallback,
}: {
  allow: Array<"admin" | "technician" | "viewer">;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { role } = useAuth();
  if (!role || !allow.includes(role)) return <>{fallback ?? null}</>;
  return <>{children}</>;
}
