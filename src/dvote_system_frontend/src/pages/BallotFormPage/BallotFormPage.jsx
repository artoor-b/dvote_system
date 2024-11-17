import React, { useEffect, useState } from "react";
import { QuestionBox } from "./components";

import { fetchVotingQuestionsMock } from "../../mock/mock";
import { mapQuestions } from "./utils/mapQuestions";
import { Spinner } from "../../components";

import { useSearchParams } from "react-router-dom";
import { SuccessBox } from "./components/SuccessBox/SuccessBox";

export const BallotFormPage = () => {
  const [questionsData, setQuestionsData] = useState(null);
  const [questionAnswers, setQuestionAnswers] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const isBallotValid = Object.values(questionAnswers).every(
    (answer) => answer,
  );

  const getQuestions = async () => {
    try {
      const data = await fetchVotingQuestionsMock();
      console.log(data);
      setQuestionsData(() => data);

      const answersBox = mapQuestions(data);

      setQuestionAnswers(() => answersBox);
    } catch (error) {
      console.log(error);
    }
  };

  // URL search params status=success
  const onSubmitForm = async () => {
    setIsLoading(() => true);

    setTimeout(() => {
      // assume STATUS 200
      searchParams.set("status", "success"); // e.g., ?key=value
      setSearchParams(searchParams);
      setIsLoading(() => false);
    }, 1000);
  };

  useEffect(() => {
    getQuestions();
  }, []);

  useEffect(() => console.log(questionAnswers), [questionAnswers]);

  return (
    <section className="flex justify-center">
      {searchParams.get("status") === "success" ? (
        <SuccessBox />
      ) : (
        <form className="bg-gray-600 flex flex-col gap-5 p-10 m-10 w-screen">
          {questionsData && !isLoading ? (
            questionsData.map((question) => (
              <QuestionBox
                setQuestionAnswers={setQuestionAnswers}
                key={question.id}
                question={question}
              />
            ))
          ) : (
            <Spinner />
          )}
          <button
            onClick={() => onSubmitForm()}
            type="button"
            className="w-96 h-12 bg-gray-200 self-center m-10 disabled:bg-gray-500 disabled:blur-sm"
            disabled={!isBallotValid || isLoading}
          >
            {!isLoading && "GŁOSUJĘ"}
          </button>
        </form>
      )}
    </section>
  );
};
