import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppSelector } from "../utils/hooks";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const user = useAppSelector((store) => store.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
