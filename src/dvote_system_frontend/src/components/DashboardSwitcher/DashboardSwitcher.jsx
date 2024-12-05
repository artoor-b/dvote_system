import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigation, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const DashboardSwitcher = ({ statusParam, setStatusParameter }) => {
  const navigate = useNavigate();

  const [idInput, setIdInput] = useState(null);

  const onGo = (e) => {
    e.preventDefault();
    console.log("click");

    idInput
      ? navigate(`/form/${idInput}`)
      : toast("Wpisz identyfikator formularza", { type: "warning" });
  };

  const isNotStartedStatus = statusParam === "notStarted";

  const onButtonClick = (e, status) => {
    e.preventDefault();
    status === "notStarted"
      ? setStatusParameter({ status: "notStarted" })
      : setStatusParameter({ status: "completed" });
  };

  return (
    <div className="flex mt-6 flex-wrap gap-2">
      <div className="flex gap-2">
        <button
          onClick={(e) => onButtonClick(e, "notStarted")}
          className={`${
            isNotStartedStatus ? "border-b-4 border-gray-800" : ""
          } focus:border-b-4 focus:border-gray-800 border-b border-gray-800 w-36 px-4 py-1.5`}
        >
          Nadchodzące
        </button>
        <button
          onClick={(e) => onButtonClick(e, "completed")}
          className={`${
            !isNotStartedStatus ? "border-b-4 border-gray-800" : ""
          } focus:border-b-4 focus:border-gray-80 border-b border-gray-800 w-36 px-4 py-1.5`}
        >
          Zakończone
        </button>
      </div>
      <div className="w-0.5 bg-gray-800 mx-6"></div>
      <div className="flex flex-wrap">
        <input
          type="text"
          placeholder="Znam identyfikator formularza"
          className="px-3 min-w-56 min-h-10 bg-gray-800 text-gray-50 text-sm leading-5 font-medium rounded"
          onChange={(e) => setIdInput(e.target.value)}
        />
        <button
          className="border-y border-r rounded-e-3xl font-extralight text-xs px-3"
          onClick={(e) => onGo(e)}
        >
          Otwórz
        </button>
      </div>
    </div>
  );
};
