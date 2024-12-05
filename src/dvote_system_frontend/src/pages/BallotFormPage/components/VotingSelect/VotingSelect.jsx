import React from "react";

export const VotingSelect = ({
  questionId,
  setQuestionAnswers,
  questionAnswers,
}) => {
  return (
    <div className="flex flex-col gap-3 mt-3 sm:mt-3 sm:flex-row sm:gap-10 sm:justify-end">
      <div className="flex gap-2">
        <input
          type="radio"
          name={`vote-${questionId}`}
          id={`for-${questionId}`}
          onChange={() =>
            setQuestionAnswers((prev) => ({ ...prev, [questionId]: "for" }))
          }
          className="w-6 accent-blue-600"
          checked={questionAnswers[questionId] === "for"}
        />
        <label htmlFor={`for-${questionId}`} className="text-green-400">
          Za
        </label>
      </div>
      <div className="flex gap-2">
        <input
          type="radio"
          name={`vote-${questionId}`}
          id={`against-${questionId}`}
          onChange={() =>
            setQuestionAnswers((prev) => ({ ...prev, [questionId]: "against" }))
          }
          className="w-6 accent-blue-600"
          checked={questionAnswers[questionId] === "against"}
        />
        <label htmlFor={`against-${questionId}`} className="text-red-400">
          Przeciw
        </label>
      </div>
      <div className="flex gap-2">
        <input
          type="radio"
          name={`vote-${questionId}`}
          id={`abstain-${questionId}`}
          onChange={() =>
            setQuestionAnswers((prev) => ({ ...prev, [questionId]: "abstain" }))
          }
          className="w-6 accent-blue-600"
          checked={questionAnswers[questionId] === "abstain"}
        />
        <label htmlFor={`abstain-${questionId}`} className="text-white">
          Wstrzymuję się
        </label>
      </div>
    </div>
  );
};
