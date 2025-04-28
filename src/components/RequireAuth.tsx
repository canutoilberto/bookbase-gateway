import React from "react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";

export const RequireAuth: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const isAuth = useProtectedRoute("/validate-token");
  if (!isAuth) return null; // já foi feito o redirect
  return children;
};
