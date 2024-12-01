import React from "react";

export const SecretResults = ({ formResults }) => {
  const translateVote = {
    FOR: "za",
    AGAINST: "przeiciw",
    ABSTAIN: "wstrzymuje się",
  };

  // Group votes by questionId
  const groupedData = formResults.reduce((acc, curr) => {
    if (!acc[curr.questionId]) {
      acc[curr.questionId] = { for: 0, against: 0, abstain: 0, total: 0 };
    }
    acc[curr.questionId][curr.answer] += 1;
    acc[curr.questionId].total += 1;
    return acc;
  }, {});

  const questionIds = Object.keys(groupedData);

  return (
    <div className="overflow-x-auto p-4">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Answer
            </th>
            {questionIds.map((questionId) => (
              <th
                key={questionId}
                className="border border-gray-300 px-4 py-2 text-left"
              >
                Question {questionId}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {["for", "against", "abstain"].map((answer) => (
            <tr key={answer} className="odd:bg-gray-100 even:bg-white">
              <td className="border border-gray-300 px-4 py-2 font-medium">
                {answer}
              </td>
              {questionIds.map((questionId) => {
                const totalVotes = groupedData[questionId].total;
                const answerVotes = groupedData[questionId][answer] || 0;
                const percentage = ((answerVotes / totalVotes) * 100).toFixed(
                  2,
                );
                return (
                  <td
                    key={questionId}
                    className="border border-gray-300 px-4 py-2 text-center"
                  >
                    {answerVotes}/{totalVotes} ({percentage}%)
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
