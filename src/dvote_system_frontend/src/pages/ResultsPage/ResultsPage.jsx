import React, { useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useQueryCall } from "@ic-reactor/react";
import { BackButton } from "../../components";
import { Spinner } from "../../components";
import { NotFoundPage } from "../NotFoundPage";

export const ResultsPage = () => {
  let { id } = useParams();

  console.log(id);

  const {
    call: getPublicFormResults,
    data: formResults,
    loading,
  } = useQueryCall({
    functionName: "getPublicFormResults",
    args: [id],
    refetchOnMount: true,
    onSuccess: () => console.log("SUCCESS"),
  });

  useEffect(() => {
    console.log(formResults);
  }, [formResults]);

  const translateVote = {
    FOR: "za",
    AGAINST: "przeiciw",
    ABSTAIN: "wstrzymuje się",
  };

  // Extract unique question IDs
  const uniqueQuestionIds =
    formResults &&
    Array.from(
      new Set(
        formResults.flatMap(([, answers]) =>
          answers.map((answer) => answer.questionId),
        ),
      ),
    );

  // Calculate vote statistics
  const calculateVoteStats = () => {
    const stats = {};

    formResults &&
      uniqueQuestionIds.forEach((questionId) => {
        stats[questionId] = { for: 0, against: 0, abstain: 0, total: 0 };
      });

    formResults &&
      formResults.forEach(([, answers]) => {
        answers.forEach((answer) => {
          const questionId = answer.questionId;
          const vote = answer.answer;
          if (stats[questionId]) {
            stats[questionId][vote] = (stats[questionId][vote] || 0) + 1;
            stats[questionId].total += 1;
          }
        });
      });

    return stats;
  };

  const voteStats = calculateVoteStats();

  // Render combined table headers
  const renderHeaders = () => (
    <thead>
      <tr className="bg-gray-200">
        <th className="border px-4 py-2">Głosujący</th>
        {uniqueQuestionIds.map((id) => (
          <th key={id} className="border px-4 py-2">
            Pytanie: {Number(id)}
          </th>
        ))}
      </tr>
    </thead>
  );

  // Render main data rows
  const renderMainRows = () => {
    return formResults.map(([rowTitle, answers], rowIndex) => {
      const answersMap = answers.reduce(
        (acc, answer) => ({ ...acc, [answer.questionId]: answer.answer }),
        {},
      );

      return (
        <tr key={`main-${rowIndex}`}>
          <td className="border px-2 py-1">{rowTitle}</td>
          {uniqueQuestionIds.map((id) => {
            const cellValue = answersMap[id] || "N/A";
            const bgColor =
              cellValue === "for"
                ? "bg-green-100"
                : cellValue === "against"
                  ? "bg-red-100"
                  : "bg-white";
            return (
              <td key={id} className={`border px-4 py-2 ${bgColor}`}>
                {translateVote[cellValue.toUpperCase()] || cellValue}
              </td>
            );
          })}
        </tr>
      );
    });
  };

  // Render vote statistics rows
  const renderStatsRows = () => {
    const statsRows = [
      { rowTitle: "for", type: "stats" },
      { rowTitle: "against", type: "stats" },
      { rowTitle: "abstain", type: "stats" },
    ];

    return statsRows.map(({ rowTitle }, rowIndex) => {
      const answersMap = uniqueQuestionIds.reduce((acc, id) => {
        const stat = voteStats[id];
        const rowVotes = stat[rowTitle] || 0;
        const totalVotes = stat.total || 1; // Avoid division by zero
        const percentage = ((rowVotes / totalVotes) * 100).toFixed(2);
        acc[id] = `${rowVotes}/${totalVotes} (${percentage}%)`;
        return acc;
      }, {});

      return (
        <tr key={`stats-${rowIndex}`} className="bg-gray-50">
          <td className="border px-4 py-2">
            {translateVote[rowTitle.toUpperCase()] || rowTitle}
          </td>
          {uniqueQuestionIds.map((id) => {
            const cellValue = answersMap[id] || "N/A";
            const bgColor =
              rowTitle === "for"
                ? "bg-green-100"
                : rowTitle === "against"
                  ? "bg-red-100"
                  : "bg-white";
            return (
              <td key={id} className={`border px-4 py-2 ${bgColor}`}>
                {cellValue}
              </td>
            );
          })}
        </tr>
      );
    });
  };

  if (formResults && !formResults.length) return <NotFoundPage />;

  return formResults ? (
    <div className="p-4">
      <BackButton text="Powrót" backLocation={`/form/${id}`} />

      <h2 className="flex text-3xl font-extralight mb-4">
        {`Wyniki dla formularza ${id}`}
      </h2>
      <table className="table-auto border-collapse border border-gray-300 w-full text-xs">
        {formResults && renderHeaders()}
        <tbody>
          {formResults && renderMainRows()} {/* Main data rows */}
          <tr>
            <td
              colSpan={uniqueQuestionIds.length + 1}
              className="bg-gray-300 text-center font-bold px-4 py-2"
            >
              Statystyki
            </td>
          </tr>
          {formResults && renderStatsRows()} {/* Stats rows */}
        </tbody>
      </table>
    </div>
  ) : (
    <Spinner />
  );
};
