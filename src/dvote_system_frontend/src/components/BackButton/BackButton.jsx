import React from "react";
import ArrowBack from "../../assets/svg/arrowBack.svg?react";

import { Link } from "react-router-dom";

export const BackButton = ({ backLocation, text }) => {
  return (
    <Link to={backLocation}>
      <ArrowBack className="mb-4" />
      {text}
    </Link>
  );
};
