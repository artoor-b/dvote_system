import React from "react";

export const VotingSelect = ({ questionId, setQuestionAnswers }) => {
  return (
    <div className="flex gap-10 justify-end">
      <div className="flex gap-2">
        <input
          type="radio"
          name={`vote-${questionId}`}
          id={`for-${questionId}`}
          onChange={() =>
            setQuestionAnswers((prev) => ({ ...prev, [questionId]: true }))
          }
          className="w-6 accent-blue-600"
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
            setQuestionAnswers((prev) => ({ ...prev, [questionId]: true }))
          }
          className="w-6 accent-blue-600"
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
            setQuestionAnswers((prev) => ({ ...prev, [questionId]: true }))
          }
          className="w-6 accent-blue-600"
        />
        <label htmlFor={`abstain-${questionId}`} className="text-white">
          Wstrzymuję się
        </label>
      </div>
    </div>
  );
};
