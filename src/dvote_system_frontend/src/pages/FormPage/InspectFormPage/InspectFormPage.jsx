import React, { useEffect } from "react";

import { useParams } from "react-router-dom";
import { ResultsPage } from "../../ResultsPage";
import { useQueryCall } from "@ic-reactor/react";
import { Spinner } from "../../../components";

export const InspectFormPage = ({ formType }) => {
  let { id } = useParams();

  const {
    call: getPublicSubmittedList,
    data: publicList,
    loading: publicListLoading,
  } = useQueryCall({
    functionName: "getPublicSubmittedList",
    refetchOnMount: false,
    onError: (e) => toast(e.reject_message, { type: "error" }),
  });

  const {
    call: getSecretNumber,
    data: secretNumber,
    loading: secretNumberLoading,
  } = useQueryCall({
    functionName: "getSecretSubmitNumber",
    refetchOnMount: false,
    onError: (e) => toast(e.reject_message, { type: "error" }),
  });

  useEffect(() => {
    if (formType === "public") getPublicSubmittedList([id]);
    if (formType === "secret") getSecretNumber([id]);
  }, [id]);

  useEffect(() => {
    console.log("publicList", publicList);
  }, [publicList]);

  useEffect(() => {
    console.log("secretNumber", secretNumber);
  }, [secretNumber]);

  return (
    <section className="mt-8 flex flex-col">
      <div className="flex justify-center gap-4">
        <h2 className="text-3xl">Zarejestrowane głosy:</h2>
        <button
          className="bg-green-100 font-extralight text-xs px-3 rounded-sm"
          onClick={() =>
            formType === "public"
              ? getPublicSubmittedList([id])
              : getSecretNumber([id])
          }
        >
          aktualizuj
        </button>
      </div>
      {secretNumberLoading || publicListLoading ? (
        <Spinner />
      ) : (
        <div>
          {formType === "public" &&
            (publicList?.length
              ? publicList.map((principalId) => <p>{principalId}</p>)
              : "Brak")}
          {formType === "secret" && (secretNumber ? secretNumber : "Brak")}
        </div>
      )}
    </section>
  );
};
