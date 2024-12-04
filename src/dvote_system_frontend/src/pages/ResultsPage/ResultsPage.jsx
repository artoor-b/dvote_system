import React, { useEffect } from "react";
import {
  Link,
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useQueryCall } from "@ic-reactor/react";
import { BackButton } from "../../components";
import { Spinner } from "../../components";
import { NotFoundPage } from "../NotFoundPage";
import { PublicResults } from "./PublicResults";
import { SecretResults } from "./SecretResults";

export const ResultsPage = () => {
  let { id } = useParams();
  const location = useLocation();
  const { checkState } = location.state || {};

  console.log("checkState", checkState);

  const [searchParams] = useSearchParams();
  const resultsType = searchParams.get("type");

  console.log(id, resultsType);

  const {
    call: getPublicFormResults,
    data: formResults,
    loading: formResultsLoading,
  } = useQueryCall({
    functionName: "getPublicFormResults",
    args: [id],
    refetchOnMount: false,
    onSuccess: () => console.log("SUCCESS"),
    onError: () => console.log("cannot fetch public forms"),
  });

  const {
    call: getSecretFormResults,
    data: secretFormResults,
    loading: secretFormResultsLoading,
  } = useQueryCall({
    functionName: "getSecretFormResults",
    args: [id],
    refetchOnMount: false,
    onSuccess: () => console.log("SUCCESS"),
    onError: () => console.log("cannot fetch secret forms"),
  });

  const getPublicResults = async () => {
    try {
      await getPublicFormResults([id]);
    } catch {
      console.log("error during feetching public forms");
    }
  };

  const getSecretResults = async () => {
    try {
      await getSecretFormResults([id]);
    } catch {
      console.log("error during feetching public forms");
    }
  };

  useEffect(() => {
    if (resultsType !== "secret") {
      getPublicResults();
    } else {
      getSecretResults();
    }
    console.log(formResults || secretFormResults);
  }, []);

  useEffect(() => {
    console.log(formResults || secretFormResults);
  }, [formResults, secretFormResults]);

  if (formResults && !formResults.length)
    return <NotFoundPage customMessage="Nie zarejestrowano wyników" />;
  if (formResultsLoading || secretFormResultsLoading) return <Spinner />;

  return (
    <div className="p-4">
      <BackButton text="Powrót" backLocation={`/form/${id}`} />

      <h2 className="flex text-3xl font-extralight mb-4">
        {`Wyniki dla formularza ${id}`}
      </h2>
      {formResults && <PublicResults formResults={formResults} />}
      {secretFormResults && <SecretResults formResults={secretFormResults} />}
    </div>
  );
};
