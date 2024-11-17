import { useEffect } from "react";
import { useNavigation, useSearchParams } from "react-router-dom";

export const DashboardSwitcher = ({ statusParam, setStatusParameter }) => {
  // const navigation = useNavigation();

  const isOpenStatus = statusParam === "open";

  const onButtonClick = (e, status) => {
    e.preventDefault();
    status === "open"
      ? setStatusParameter({ status: "open" })
      : setStatusParameter({ status: "completed" });
  };

  return (
    <div className="flex mt-6">
      <div className="flex gap-2">
        <button
          onClick={(e) => onButtonClick(e, "open")}
          className={`${
            isOpenStatus ? "border-b-4 border-gray-800" : ""
          } focus:border-b-4 focus:border-gray-800 border-b border-gray-800 w-36 px-4 py-1.5`}
        >
          Nadchodzące
        </button>
        <button
          onClick={(e) => onButtonClick(e, "completed")}
          className={`${
            !isOpenStatus ? "border-b-4 border-gray-800" : ""
          } focus:border-b-4 focus:border-gray-80 border-b border-gray-800 w-36 px-4 py-1.5`}
        >
          Zakończone
        </button>
      </div>
      <div className="w-0.5 bg-gray-800 mx-6"></div>
      <button className="px-14 bg-gray-800 text-gray-50 text-sm leading-5 font-medium rounded">
        Posiadam klucz
      </button>
    </div>
  );
};
