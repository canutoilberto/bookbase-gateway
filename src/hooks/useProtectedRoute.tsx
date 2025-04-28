import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function useProtectedRoute(
  redirectTo: string = "/validate-token",
  getToken: () => string | null = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }
): boolean {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate(redirectTo, { replace: true });
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
    console.log("isAuthenticated", isAuthenticated);
  }, [getToken, redirectTo, navigate]);

  // até sabermos, não renderiza nada (evita flash)
  return isAuthenticated === true;
}
