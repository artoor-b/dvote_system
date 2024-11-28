import { useEffect } from "react";
import { DashboardSwitcher, FormGrid } from "../../components";

import { useUserPrincipal, useAuth } from "@ic-reactor/react";

import { useSearchParams } from "react-router-dom";

export const FormDashboardPage = ({ userRole }) => {
  useEffect(() => {
    console.log("sdfsdfg", userRole);
  }, [userRole]);

  const userPrincipal = useUserPrincipal();
  const [searchParams, setSearchParams] = useSearchParams();
  console.log("userPrincipal", userPrincipal?.toText());

  useEffect(() => {
    if (!searchParams.get("status")) setSearchParams({ status: "notStarted" });
  }, [searchParams]);

  const setStatusParameter = (paramObject) => {
    setSearchParams(paramObject);
  };

  return (
    <>
      <DashboardSwitcher
        statusParam={searchParams.get("status")}
        setStatusParameter={setStatusParameter}
      />
      <FormGrid filterStatus={searchParams.get("status")} />
    </>
  );
};
