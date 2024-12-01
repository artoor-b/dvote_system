import React from "react";
import { VotingSelect } from "../VotingSelect/VotingSelect";

export const QuestionBox = ({
  setQuestionAnswers,
  question,
  questionAnswers,
}) => {
  const { id, questionBody } = question;

  return (
    <section className="bg-gray-700 p-5">
      <p className="text-white flex justify-start">{`${id}. ${questionBody}`}</p>
      <VotingSelect
        setQuestionAnswers={setQuestionAnswers}
        questionId={id}
        questionAnswers={questionAnswers}
      />
      {/* <hr className="w-72 ml-auto border-gray-600 border-2" /> */}
    </section>
  );
};
