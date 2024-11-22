import React from "react";
import { useNavigate } from "react-router-dom";

export const FormTile = ({ id, voteType, title, startDate }) => {
  const navigate = useNavigate();
  const onTileClick = (e) => {
    e.preventDefault();
    console.log("click");
    navigate(`/form/${id}`, { search: id });
  };

  return (
    <button
      onClick={(e) => onTileClick(e)}
      className="bg-gray-600 flex flex-col justify-between w-60 h-36 text-gray-100 rounded p-3"
    >
      <p className="font-extralight flex text-left">{title}</p>
      <div>
        <p className="flex text-xs leading-4 font-normal">
          {startDate.fullDate}
        </p>
        <p className="flex text-xs leading-4 font-normal">
          {startDate.fullTime}
        </p>
        <p className="flex text-xs leading-4 font-normal">{voteType}</p>
      </div>
    </button>
  );
};
