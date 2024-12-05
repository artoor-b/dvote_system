import React from "react";
import ArrowBack from "../../assets/svg/arrowBack.svg?react";

import { Link } from "react-router-dom";

export const BackButton = ({
  backLocation,
  text,
  rotate = false,
  ...props
}) => {
  return (
    <Link to={backLocation} className="flex items-center mb-4 w-max" {...props}>
      {rotate ? (
        <>
          {text}
          <ArrowBack className={rotate && "transform rotate-180"} />
        </>
      ) : (
        <>
          <ArrowBack />
          {text}
        </>
      )}
    </Link>
  );
};
