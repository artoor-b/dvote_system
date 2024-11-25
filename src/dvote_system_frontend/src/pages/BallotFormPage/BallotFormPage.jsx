import React, { useEffect, useState } from "react";
import { QuestionBox } from "./components";

import { fetchVotingQuestionsMock } from "../../mock/mock";
import { mapQuestions } from "./utils/mapQuestions";
import { Spinner } from "../../components";

import { Link, useParams, useNavigate } from "react-router-dom";

import { useSearchParams } from "react-router-dom";
import { SuccessBox } from "./components/SuccessBox/SuccessBox";

import { useQueryCall } from "@ic-reactor/react";

export const BallotFormPage = () => {
  let { id } = useParams();

  const [questionsData, setQuestionsData] = useState(null);
  const [questionAnswers, setQuestionAnswers] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const isBallotValid =
    Object.values(questionAnswers).every((answer) => answer) || false;

  console.log("isBallotValid", isBallotValid);

  const {
    call: startForm,
    data: votingFormData,
    loading: startFormLoading,
  } = useQueryCall({
    functionName: "startForm",
    args: [id],
    refetchOnMount: false,
    onSuccess: () => console.log("SUCCESS"),
  });

  const {
    call: storePublicFormResult,
    data: formResult,
    loading: formResultLoading,
  } = useQueryCall({
    functionName: "storePublicVoteResult",
    refetchOnMount: false,
    onSuccess: () => console.log("Submitted"),
  });

  const getQuestions = async () => {
    try {
      const [data] = await startForm();
      if (data && Object.keys(data).length) {
        setQuestionsData(() => data.questions);
        console.log(data.questions);

        const answersBox = mapQuestions(data.questions);
        setQuestionAnswers(() => answersBox);
      }
    } catch {
      toast("something went wrong", { type: "error" });
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
      const data = await storePublicFormResult([id, mappedAnswers]);
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
    getQuestions();
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
                  key={question.id}
                  question={question}
                />
              ))}
              <button
                onClick={() => onSubmitForm()}
                type="button"
                className="w-96 h-12 bg-gray-200 self-center m-10 disabled:bg-gray-500 disabled:blur-sm"
                disabled={!isBallotValid}
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
