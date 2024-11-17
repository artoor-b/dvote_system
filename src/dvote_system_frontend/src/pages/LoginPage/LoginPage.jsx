import React, { useEffect } from "react";
import { useAuth } from "@ic-reactor/react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../components";
import { toast } from "react-toastify";

export const LoginPage = () => {
  const { login, authenticating, loginLoading } = useAuth({
    onLoginSuccess: () => toast("Zalogowano pomyślnie", { type: "success" }),
  });

  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (identity) {
  //     console.log("authenticated", identity.getPrincipal().toText());
  //     navigate("/forms");
  //   }
  // }, [identity]);

  return (
    <section className="flex flex-col items-center">
      {
        <button
          onClick={() => login()}
          className={`bg-gray-${!loginLoading ? "800" : "100"} text-gray-200 py-4 px-24 rounded-md`}
          disabled={loginLoading}
        >
          {authenticating ? "Logowanie..." : "Zaloguj"}
        </button>
      }

      {loginLoading ? (
        <Spinner />
      ) : (
        <span className="mt-4">
          Musisz się zalogować, aby korzystać z serwisu
        </span>
      )}
    </section>
  );
};
