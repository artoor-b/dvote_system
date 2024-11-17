import { useEffect } from "react";
import { DashboardSwitcher, FormGrid } from "../../components";

import { useQueryCall, useUserPrincipal, useAuth } from "@ic-reactor/react";

import { useSearchParams } from "react-router-dom";

export const FormDashboardPage = () => {
  const userPrincipal = useUserPrincipal();
  const [searchParams, setSearchParams] = useSearchParams();
  console.log("userPrincipal", userPrincipal?.toText());

  const { data, call } = useQueryCall({
    functionName: "restrictedFunction",
  });

  console.log(data);

  useEffect(() => {
    if (!searchParams.get("status")) setSearchParams({ status: "open" });
    console.log("call call");
    call();
  }, []);

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
