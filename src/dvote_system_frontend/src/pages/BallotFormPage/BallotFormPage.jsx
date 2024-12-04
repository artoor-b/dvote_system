import React, { useEffect, useState } from "react";
import { QuestionBox } from "./components";
import { mapQuestions } from "./utils/mapQuestions";
import { Spinner } from "../../components";
import {
  useNavigate,
  useParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { SuccessBox } from "./components/SuccessBox/SuccessBox";
import { useQueryCall } from "@ic-reactor/react";
import { toast } from "react-toastify";
import { Principal } from "@dfinity/principal";

export const BallotFormPage = ({ authorizedVoting = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authorizedVoteFlag } = location.state || {};
  let { id } = useParams();

  const isAuthorizedVoting = authorizedVoting && authorizedVoteFlag;

  const [questionsData, setQuestionsData] = useState(null);
  const [questionAnswers, setQuestionAnswers] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenInput, setTokenInput] = useState(null);

  const [localVoteToken, setLocalVoteToken] = useState(null);

  const resetState = () => {
    // setQuestionAnswers(() => {});
    setIsLoading(() => false);
    setTokenInput(() => null);
    setLocalVoteToken(() => null);
  };

  useEffect(() => resetState(), [location]);

  console.log("authorizedVoting", authorizedVoting);
  console.log("authorizedVoteFlag", authorizedVoteFlag);
  console.log(searchParams.get("voteBy"));

  const isBallotValid =
    Object.values(questionAnswers).every((answer) => answer) || false;

  const {
    call: startForm,
    data: votingFormData,
    loading: startFormLoading,
  } = useQueryCall({
    functionName: "startForm",
    args: [id],
    refetchOnMount: false,
    onError: (e) => toast(e.reject_message, { type: "error" }),
    throwOnError: true,
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

  const {
    call: getVoteToken,
    data: voteToken,
    loading: voteTokenLoading,
  } = useQueryCall({
    functionName: "getSecretVoteToken",
    args: [id],
    refetchOnMount: false,
    onSuccess: () => toast("Pobrano token", { type: "success" }),
    onError: (e) => toast(e.reject_message, { type: "error" }),
    throwOnError: true,
  });

  // getSecretAuthorizedVoteToken
  const {
    call: getSecretAuthorizedVoteToken,
    data: getSecretAuthorizedVoteTokenData,
    loading: getSecretAuthorizedVoteTokenLoading,
  } = useQueryCall({
    functionName: "getSecretAuthorizedVoteToken",
    refetchOnMount: false,
    onSuccess: () => toast("Pobrano token upowazniajacy", { type: "success" }),
    onError: (e) => toast(e.reject_message, { type: "error" }),
    throwOnError: true,
  });

  const { formType, status } =
    (votingFormData && votingFormData[0]) ||
    (startFormByAuthorizationData && startFormByAuthorizationData[0]) ||
    {};

  const {
    call: storePublicFormResult,
    data: formResult,
    loading: formResultLoading,
  } = useQueryCall({
    functionName: "storePublicVoteResult",
    refetchOnMount: false,
    // onSuccess: () => toast("Głos oddany pomyślnie", { type: "success" }),
    onError: (e) => {
      toast(e.reject_message, { type: "error" });
      setIsLoading(() => false);
    },
    throwOnError: true,
  });

  // voteInBehalf public vote
  const {
    call: voteInBehalf,
    data: voteInBehalfData,
    loading: voteInBehalfLoading,
  } = useQueryCall({
    functionName: "voteInBehalf",
    refetchOnMount: false,
    // onSuccess: () => toast("Głos oddany pomyślnie", { type: "success" }),
    onError: (e) => {
      toast(e.reject_message, { type: "error" });
      setIsLoading(() => false);
    },
    throwOnError: true,
  });

  // voteInBehalfSecret
  const {
    call: voteInBehalfSecret,
    data: voteInBehalfSecretData,
    loading: voteInBehalfSecretLoading,
  } = useQueryCall({
    functionName: "voteInBehalfSecret",
    refetchOnMount: false,
    // onSuccess: () => toast("Głos oddany pomyślnie", { type: "success" }),
    onError: (e) => {
      toast(e.reject_message, { type: "error" });
      setIsLoading(() => false);
    },
    throwOnError: true,
  });

  const {
    call: storeSecretFormResult,
    data: secretFormResult,
    loading: secretFormResultLoading,
  } = useQueryCall({
    functionName: "storeSecretVoteResult",
    refetchOnMount: false,
    // onSuccess: () => toast("Głos oddany pomyślnie", { type: "success" }),
    onError: (e) => {
      toast(e.reject_message, { type: "error" });
      setIsLoading(() => false);
      console.log(questionAnswers);
    },
    throwOnError: true,
  });

  const getQuestions = async () => {
    try {
      const [data] =
        authorizedVoting && authorizedVoteFlag
          ? await startFormByAuthorization([
              id,
              Principal.fromText(searchParams.get("voteBy")),
            ])
          : await startForm();
      if (data && Object.keys(data).length) {
        setQuestionsData(() => data.questions);
        console.log(data);

        const answersBox = mapQuestions(data.questions);
        setQuestionAnswers(() => answersBox);
      }
    } catch {
      toast("Błąd w trakcie pobierania pytań", { type: "error" });
    }
  };

  const getToken = async () => {
    try {
      const tokenData = isAuthorizedVoting
        ? await getSecretAuthorizedVoteToken([id, searchParams.get("voteBy")])
        : await getVoteToken();
      console.log("tokenData", tokenData);
      setLocalVoteToken(() => tokenData);
    } catch {
      toast("Błąd podczas uzyskiwania tokenu", { type: "error" });
    }
  };

  // URL search params status=success
  const onSubmitForm = async () => {
    setIsLoading(() => true);

    try {
      const mappedAnswers = Object.entries(questionAnswers).map(
        ([questionId, answer]) => ({
          questionId: +questionId,
          answer,
        }),
      );
      const data =
        formType === "public"
          ? await storePublicFormResult([id, mappedAnswers]).catch(() =>
              toast("Nie zatwierdzono głosowania", { type: "error" }),
            )
          : await storeSecretFormResult([id, mappedAnswers, tokenInput]).catch(
              () => toast("Nie zatwierdzono głosowania", { type: "error" }),
            );
      console.log("data", data);

      if (data) {
        // assume STATUS 200
        searchParams.set("status", "success"); // e.g., ?key=value
        toast("Głos oddany pomyślnie", { type: "success" });
        setSearchParams(searchParams);
        setIsLoading(() => false);
      } else {
        setIsLoading(() => false);
        toast("Błąd podczas oddawania głosu, spróbuj ponownie", {
          type: "error",
        });
      }
    } catch {
      console.log("ERROR");
    }
  };

  // on authorized submit form
  const onAuthorizedSubmit = async () => {
    setIsLoading(() => true);

    try {
      const mappedAnswers = Object.entries(questionAnswers).map(
        ([questionId, answer]) => ({
          questionId: +questionId,
          answer,
        }),
      );
      const data =
        formType === "public"
          ? await voteInBehalf([
              id,
              searchParams.get("voteBy"),
              mappedAnswers,
            ]).catch(() =>
              toast("Nie zatwierdzono autoryzowanego głosowania", {
                type: "error",
              }),
            )
          : await voteInBehalfSecret([
              id,
              searchParams.get("voteBy"),
              mappedAnswers,
              tokenInput,
            ]).catch(() =>
              toast("Nie zatwierdzono autoryzowanego głosowania", {
                type: "error",
              }),
            );
      console.log("authorized data", data);

      if (data) {
        // assume STATUS 200
        searchParams.set("status", "success"); // e.g., ?key=value
        toast("Głos z upowaznieniem oddany pomyślnie", { type: "success" });
        setSearchParams(searchParams);
        setIsLoading(() => false);
      } else {
        setIsLoading(() => false);
        toast(
          "Błąd podczas oddawania głosu z upowaznieniem, spróbuj ponownie",
          {
            type: "error",
          },
        );
      }
    } catch {
      console.log("ERROR");
    }
  };

  useEffect(() => {
    console.log("rerend");
    getQuestions();

    return () => {
      setTokenInput(() => null);
    };
  }, []);

  useEffect(() => {
    console.log(questionAnswers);
    console.log(
      Object.entries(questionAnswers).map(([questionId, answer]) => ({
        questionId: +questionId,
        answer,
      })),
    );
  }, [questionAnswers]);

  useEffect(() => {
    isAuthorizedVoting &&
      console.log(Principal.fromText(searchParams.get("voteBy")));
  }, [searchParams.get("voteBy")]);

  try {
    isAuthorizedVoting && Principal.fromText(searchParams.get("voteBy"));
  } catch {
    toast("Nieprawidłowy identyfikator uytkownika", { type: "error" });
    navigate("/forms");
  }

  return (
    <section className="flex justify-center">
      {searchParams.get("status") === "success" ? (
        <SuccessBox />
      ) : (
        <form className="bg-gray-600 flex flex-col gap-5 p-10 m-10 w-screen">
          {isAuthorizedVoting && (
            <h1>Głosujesz w imieniu {searchParams.get("voteBy")}</h1>
          )}
          {questionsData && !isLoading ? (
            <>
              {questionsData.map((question) => (
                <QuestionBox
                  setQuestionAnswers={setQuestionAnswers}
                  questionAnswers={questionAnswers}
                  key={question.id}
                  question={question}
                />
              ))}
              {formType === "secret" && (
                <button
                  className="w-96 h-12 bg-gray-200 self-center m-10 disabled:bg-gray-500 disabled:blur-sm rounded-md"
                  disabled={
                    !isBallotValid ||
                    formType !== "secret" ||
                    localVoteToken ||
                    (isAuthorizedVoting
                      ? getSecretAuthorizedVoteTokenLoading
                      : voteTokenLoading)
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    getToken();
                  }}
                >
                  Pobierz token
                </button>
              )}
              {(voteTokenLoading || getSecretAuthorizedVoteTokenLoading) && (
                <Spinner />
              )}
              {localVoteToken && (
                <div className="flex text-white items-center">
                  {localVoteToken.token}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigator.clipboard.writeText(localVoteToken.token);
                    }}
                    className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Kopiuj
                  </button>
                </div>
              )}
              {/* {voteToken && voteToken.token && (
                <div className="flex text-white items-center">
                  {voteToken.token}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigator.clipboard.writeText(voteToken.token);
                    }}
                    className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Kopiuj
                  </button>
                </div>
              )} */}
              {localVoteToken && (
                <>
                  <input
                    type="text"
                    placeholder="Wprowadź uzyskany token"
                    onChange={(e) => setTokenInput(e.target.value)}
                    className={`w-full border p-2 rounded-md border-gray-300`}
                  />
                </>
              )}
              {/* {getSecretAuthorizedVoteTokenData &&
                getSecretAuthorizedVoteTokenData.token && (
                  <>
                    <input
                      type="text"
                      placeholder="Wprowadź uzyskany token"
                      onChange={(e) => setTokenInput(e.target.value)}
                      className={`w-full border p-2 rounded-md border-gray-300`}
                    />
                  </>
                )} */}
              <button
                onClick={() =>
                  isAuthorizedVoting ? onAuthorizedSubmit() : onSubmitForm()
                }
                type="button"
                className="w-96 h-12 bg-gray-200 self-center m-10 disabled:bg-gray-500 disabled:blur-sm rounded-md"
                disabled={
                  !isBallotValid || (formType === "secret" && !tokenInput)
                }
              >
                {!isLoading && "GŁOSUJĘ"}
              </button>
            </>
          ) : (
            <Spinner />
          )}
        </form>
      )}
    </section>
  );
};
