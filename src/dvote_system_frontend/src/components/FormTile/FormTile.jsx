import React from "react";
import { useNavigate } from "react-router-dom";
import { FormStatusIndicator } from "../FormStatusIndicator";

export const FormTile = ({
  id,
  voteType,
  title,
  startDate,
  rawStartDate,
  rawEndDate,
  formStatus,
  inspect = false,
}) => {
  const navigate = useNavigate();
  const onTileClick = (e) => {
    e.preventDefault();
    console.log("click");
    navigate(!inspect ? `/form/${id}` : `/manage/form/${id}`, { search: id });
  };

  const currentDate = new Date();
  let statusValue = "";

  if (formStatus === "completed") {
    statusValue = "completed";
  } else if (
    new Date(rawStartDate) <= currentDate &&
    new Date(rawEndDate) >= currentDate
  ) {
    statusValue = "live";
  } else if (
    new Date(rawStartDate) > currentDate &&
    new Date(rawEndDate) > currentDate
  ) {
    statusValue = "planned";
  } else {
    statusValue = "closed";
  }

  return (
    <button
      onClick={(e) => onTileClick(e)}
      className="bg-gray-600 flex flex-col justify-between w-60 h-36 text-gray-100 rounded p-3"
    >
      <p className="font-extralight flex text-left">{title}</p>
      <div className="flex justify-between w-full">
        <div>
          <p className="flex text-xs leading-4 font-normal">
            {startDate.fullDate}
          </p>
          <p className="flex text-xs leading-4 font-normal">
            {startDate.fullTime}
          </p>
          <p className="flex text-xs leading-4 font-normal">{voteType}</p>
        </div>
        <FormStatusIndicator status={statusValue} />
      </div>
    </button>
  );
};
