import React from "react";
import { useNavigate } from "react-router-dom";

export const FormTile = ({ id, voteType, title }) => {
  const navigate = useNavigate();
  const onTileClick = (e) => {
    e.preventDefault();
    console.log("click");
    navigate(`/form/${id}`, { search: id });
  };

  return (
    <button
      onClick={(e) => onTileClick(e)}
      className="bg-gray-600 flex flex-col justify-center w-36 h-36 text-gray-100 rounded p-3 relative"
    >
      <p className="text-3xl leading-9 font-extralight">{title}</p>
      <span className="text-xs leading-4 font-normal absolute bottom-3">
        {voteType}
      </span>
    </button>
  );
};
