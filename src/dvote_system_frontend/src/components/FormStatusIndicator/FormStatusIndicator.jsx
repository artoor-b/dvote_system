import React from "react";

export const FormStatusIndicator = ({ status }) => {
  console.log(status);
  const statusClassName = (() => {
    switch (status) {
      case "live":
        return "before:content-[''] before:w-2 before:h-2 before:bg-green-500 before:rounded-full before:absolute before:left-[-10px] before:top-1 before:transform before:-translate-y-1/";
      case "planned":
        return "before:content-[''] before:w-2 before:h-2 before:bg-blue-500 before:rounded-full before:absolute before:left-[-10px] before:top-1 before:transform before:-translate-y-1/";
      case "completed":
        return "before:content-[''] before:w-2 before:h-2 before:bg-white before:rounded-full before:absolute before:left-[-10px] before:top-1 before:transform before:-translate-y-1/";
      default:
        return "";
    }
  })();

  const isCompleted = status !== "live" && status !== "planned";

  return (
    <p className={`self-end relative ${statusClassName} text-xs`}>
      {status === "live" && "trwa"}
      {status === "planned" && "zaplanowano"}
      {isCompleted && "zakończono"}
    </p>
  );
};
