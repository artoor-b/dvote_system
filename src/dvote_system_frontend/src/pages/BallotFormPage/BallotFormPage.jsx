import React, { useEffect, useState } from "react";
import { QuestionBox } from "./components";
import { mapQuestions } from "./utils/mapQuestions";
import { Spinner } from "../../components";
import { useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { SuccessBox } from "./components/SuccessBox/SuccessBox";
import { useQueryCall } from "@ic-reactor/react";
import { toast } from "react-toastify";

export const BallotFormPage = () => {
  let { id } = useParams();

  const [questionsData, setQuestionsData] = useState(null);
  const [questionAnswers, setQuestionAnswers] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenInput, setTokenInput] = useState(null);

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

  const { formType, status } = (votingFormData && votingFormData[0]) || {};

  const {
    call: storePublicFormResult,
    data: formResult,
    loading: formResultLoading,
  } = useQueryCall({
    functionName: "storePublicVoteResult",
    refetchOnMount: false,
    onSuccess: () => toast("Głos oddany pomyślnie", { type: "success" }),
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
    onSuccess: () => toast("Głos oddany pomyślnie", { type: "success" }),
    onError: (e) => {
      toast(e.reject_message, { type: "error" });
      setIsLoading(() => false);
      console.log(questionAnswers);
    },
    throwOnError: true,
  });

  const getQuestions = async () => {
    try {
      const [data] = await startForm();
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
      const tokenData = await getVoteToken();
      console.log(tokenData);
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
        setSearchParams(searchParams);
        setIsLoading(() => false);
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

  return (
    <section className="flex justify-center">
      {searchParams.get("status") === "success" ? (
        <SuccessBox />
      ) : (
        <form className="bg-gray-600 flex flex-col gap-5 p-10 m-10 w-screen">
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
                    (voteToken && voteToken.token) ||
                    voteTokenLoading
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    getToken();
                  }}
                >
                  Pobierz token
                </button>
              )}
              {voteTokenLoading && <Spinner />}
              {voteToken && voteToken.token && (
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
              )}
              {voteToken && voteToken.token && (
                <>
                  <input
                    type="text"
                    placeholder="Wprowadź uzyskany token"
                    onChange={(e) => setTokenInput(e.target.value)}
                    className={`w-full border p-2 rounded-md border-gray-300`}
                  />
                </>
              )}
              <button
                onClick={() => onSubmitForm()}
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
