import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useUserPrincipal } from "@ic-reactor/react";

export const ProtectedRoute = () => {
  const userId = useUserPrincipal();
  const isUserAnonymous = userId.isAnonymous();
  console.log(isUserAnonymous);
  const navigate = useNavigate();

  useEffect(() => {
    if (isUserAnonymous) {
      console.log(userId.toText());
      console.log(location.pathname);
      navigate("/login");
    }
  }, [isUserAnonymous]);

  return (
    <>
      <Outlet />
    </>
  );
};
