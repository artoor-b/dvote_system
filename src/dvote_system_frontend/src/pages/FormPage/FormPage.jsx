import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { BackButton } from "../../components/BackButton/BackButton";
import { useQueryCall, useAuthState } from "@ic-reactor/react";
import { Spinner } from "../../components";
import { toast } from "react-toastify";
import { principal } from "@ic-reactor/react/dist/utils";
import { transformIsoDateString } from "../../utils/transformIsoDateString";
import { Principal } from "@dfinity/principal";
import { InspectFormPage } from "./InspectFormPage";

export const FormPage = ({ inspect = false }) => {
  const { identity } = useAuthState();
  let { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // This gives you the current URL path

  const goToResults = () => {
    navigate(`${location.pathname}/results?type=${formType}`, {
      state: { checkState: id },
    });
  };

  const {
    call,
    data: formDetails,
    loading,
  } = useQueryCall({
    functionName: "getForm",
    args: [id],
    refetchOnMount: true,
  });

  const {
    call: startForm,
    data: votingFormData,
    loading: startFormLoading,
  } = useQueryCall({
    functionName: "startForm",
    args: [id],
    refetchOnMount: false,
    onSuccess: () => console.log("SUCCESS"),
    onError: (e) => toast(e.reject_message, { type: "error" }),
  });

  // startFormByAuthorization
  const {
    call: startFormByAuthorization,
    data: startFormByAuthorizationData,
    loading: startFormByAuthorizationLoading,
  } = useQueryCall({
    functionName: "startFormByAuthorization",
    refetchOnMount: false,
    onSuccess: () => console.log("SUCCESS"),
    onError: (e) => toast(e.reject_message, { type: "error" }),
  });

  // close form call
  const {
    call: closeForm,
    data: closeFromFlag,
    loading: closeFormLoading,
  } = useQueryCall({
    functionName: "closePublicForm",
    args: [id],
    refetchOnMount: false,
    onError: (e) => toast(e.reject_message, { type: "error" }),
  });

  //grantAuthorization
  const {
    call: grantAuthorization,
    data: grantAuthorizationFlag,
    loading: grantAuthorizationLoading,
  } = useQueryCall({
    functionName: "grantAuthorization",
    args: [id],
    refetchOnMount: false,
    onError: (e) => toast(e.reject_message, { type: "error" }),
    onSuccess: () => call(),
  });

  // uzyskabe autoryzacje do głosowania
  // getAuthorizations
  const {
    call: getAuthorizations,
    data: getAuthorizationsData,
    loading: getAuthorizationsLoading,
  } = useQueryCall({
    functionName: "getAuthorizations",
    args: [id],
    refetchOnMount: true,
    onError: (e) => toast(e.reject_message, { type: "error" }),
  });

  // cancelAuthorization
  const {
    call: cancelAuthorization,
    data: cancelAuthorizationData,
    loading: cancelAuthorizationLoading,
  } = useQueryCall({
    functionName: "cancelAuthorization",
    args: [id],
    refetchOnMount: false,
    onError: (e) => toast(e.reject_message, { type: "error" }),
    onSuccess: () => call(),
  });

  const fetchAuthorizations = async () => {
    try {
      await getAuthorizations([id]);
    } catch {
      console.log("err");
    }
  };

  useEffect(
    () => console.log("cancelAuthorizationData", cancelAuthorizationData),
    [cancelAuthorizationData],
  );

  useEffect(
    () => console.log("getAuthorizationsData", getAuthorizationsData),
    [getAuthorizationsData],
  );

  useEffect(
    () => console.log("grantAuthorizationFlag", grantAuthorizationFlag),
    [grantAuthorizationFlag],
  );

  const startVoting = async () => {
    const [data] = await startForm();
    console.log(data);
    if (data && Object.keys(data).length)
      navigate(`/form/${id}/vote`, {
        state: { checkState: true },
      });
  };

  const startAuthorizedVoting = async (authorizedPrincipal) => {
    if (authorizedPrincipal && authorizedPrincipal._arr) {
      console.log(authorizedPrincipal);
      const authorized = Principal.fromUint8Array(
        authorizedPrincipal._arr,
      ).toText();
      const [authorizedData] = await startFormByAuthorization([
        id,
        authorizedPrincipal,
      ]);
      console.log("authorized data", authorizedData);

      if (authorizedData && Object.keys(authorizedData).length)
        navigate(`/form/${id}/authorizedVote?voteBy=${authorized}`, {
          state: { authorizedVoteFlag: true },
        });
      s;
    }
  };

  useEffect(
    () =>
      console.log("startFormByAuthorizationData", startFormByAuthorizationData),
    [startFormByAuthorizationData],
  );

  const completeVotingForm = async () => {
    const closeFlag = await closeForm();
    console.log("closeFlag", closeFlag);

    closeFlag
      ? toast("Głosowanie zakończone", { type: "success" }) &&
        (await call([id]))
      : toast("Nie zamknięto głosowania", { type: "warning" });
  };

  const {
    formName,
    formDescription,
    voters,
    formDate,
    formEndDate,
    formType,
    status,
    author,
    formAuthorized,
  } = (formDetails && formDetails[0]) || {};
  const { fullDate: startDateString, fullTime: startTimeString } =
    transformIsoDateString(formDate);
  const { fullDate: endDateString, fullTime: endTimeString } =
    transformIsoDateString(formEndDate);

  useEffect(() => console.log(loading), [loading]);

  useEffect(() => {
    console.log(formDetails);
    if (formDetails && formDetails[0]) {
      const principal = Principal.fromUint8Array(
        formDetails[0].author._arr,
      ).toText();
      console.log(principal);
    }
  }, [formDetails]);

  const isPlanned = new Date(formDate) >= new Date();

  return !loading ? (
    <section>
      <div className="flex flex-col">
        <BackButton backLocation="/forms" />
        <div className="flex gap-11 items-start">
          <div>
            <div className="p-10 bg-gray-600 text-gray-50 text-3xl font-extralight w-96 min-h-96 flex flex-col items-start rounded">
              <h1 className="flex text-left">{formName}</h1>
              <h2 className="text-lg mt-10">Opis Formularza:</h2>
              <p className="flex font-normal text-sm mt-10">
                {formDescription}
              </p>
            </div>
          </div>
          <div className="h-max min-w-[600px] bg-gray-800 text-white p-10 text-xs leading-4 font-normal flex flex-col">
            <div className="flex flex-col items-start gap-3 mb-14 justify-start">
              <div>
                <b className="font-extrabold flex">Uprawnieni do głosowania:</b>{" "}
                <ul className="list-disc list-inside">
                  {voters?.map((voterId) => (
                    <li className="justify-self-start" key={voterId}>
                      {voterId}
                    </li>
                  ))}
                </ul>
              </div>
              <p>
                <b>Typ głosowania: </b>
                {formType}
              </p>
              <p>
                <b className="font-extrabold">Data rozpoczęcia: </b>{" "}
                {`${startDateString} - ${startTimeString}`}
              </p>
              <p>
                <b className="font-extrabold">Data zakończenia: </b>{" "}
                {`${endDateString} - ${endTimeString}`}
              </p>
              <p className="">
                <b className="font-extrabold flex">Przewodniczący komisji: </b>
                {formDetails &&
                  formDetails[0] &&
                  Principal.fromUint8Array(formDetails[0].author._arr).toText()}
              </p>
              <p className="">
                <b className="font-extrabold">Czy nadano upoważnienie: </b>
                {formAuthorized ? "Tak" : "Nie"}
              </p>
            </div>

            {!inspect && (
              <section className="flex flex-col">
                <div className="flex flex-col gap-8">
                  <button
                    className={`px-10 py-5 ${status !== "completed" ? "bg-green-100" : "bg-green-200"} text-gray-800 w-[240px] rounded disabled:bg-gray-500`}
                    onClick={() => {
                      status !== "completed" && startVoting();
                      status === "completed" && goToResults();
                    }}
                    disabled={formAuthorized && status !== "completed"}
                  >
                    {status !== "completed"
                      ? "Rozpocznij głosowanie"
                      : "Przejdź do wyników"}
                  </button>

                  {status === "notStarted" &&
                    isPlanned &&
                    identity.getPrincipal().compareTo(author) !== "eq" && (
                      <>
                        {!formAuthorized ? (
                          <>
                            lub
                            <button
                              id="grantAuthorization"
                              className={`px-10 py-5 bg-violet-300 font-black text-gray-800 w-[240px] rounded justify-self-end`}
                              onClick={() => {
                                grantAuthorization([id]);
                              }}
                            >
                              Nadaj upoważnienie<b>*</b>
                            </button>
                          </>
                        ) : (
                          <button
                            id="grantAuthorization"
                            className={`px-10 py-5 bg-red-300 font-black text-gray-800 w-[240px] rounded justify-self-end`}
                            onClick={() => {
                              cancelAuthorization([id]);
                            }}
                          >
                            Cofnij upoważnienie<b>*</b>
                          </button>
                        )}
                      </>
                    )}
                </div>
                {status === "notStarted" && isPlanned && (
                  <label htmlFor="grantAuthorization" className="mt-9">
                    <i>
                      <b>*</b>Nadając upoważnienie, wyrażasz zgodę na oddanie
                      głosu w twoim imieniu przez przewodniczącego komisji.
                    </i>
                  </label>
                )}
              </section>
            )}
            {inspect && (
              <button
                className={`px-10 py-5 ${status !== "completed" ? "bg-red-100 text-gray-800" : "bg-gray-200 text-gray-400"} w-[240px] rounded`}
                onClick={() => completeVotingForm()}
                disabled={status === "completed"}
              >
                {status !== "completed"
                  ? "Zakończ formularz"
                  : "Głosowanie zakończono"}
              </button>
            )}

            {author && identity.getPrincipal().compareTo(author) === "eq" && (
              <section>
                <h2 className="text-2xl font-extralight flex mt-8 mb-5">
                  Uzyskane upoważnienia
                </h2>
                <div className="flex flex-col items-start p-4 font-extralight text-sm bg-gray-600 gap-2">
                  {getAuthorizationsData &&
                    getAuthorizationsData.map(([principal, _]) => (
                      <AuthorizationItem
                        key={Principal.fromUint8Array(principal._arr).toText()}
                        principal={principal}
                        startAuthorizedVoting={startAuthorizedVoting}
                        status={status}
                      />
                    ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
      {inspect && <InspectFormPage />}
    </section>
  ) : (
    <Spinner />
  );
};

const AuthorizationItem = ({ principal, startAuthorizedVoting, status }) => (
  <div
    className="flex gap-2 justify-between items-center w-full"
    key={Principal.fromUint8Array(principal._arr).toText()}
  >
    <p>{Principal.fromUint8Array(principal._arr).toText()}</p>
    {status !== "completed" && (
      <button
        className="bg-green-700 rounded-sm w-20 py-1 text-xs"
        onClick={() => principal._arr && startAuthorizedVoting(principal)}
      >
        Głosuj
      </button>
    )}
  </div>
);
