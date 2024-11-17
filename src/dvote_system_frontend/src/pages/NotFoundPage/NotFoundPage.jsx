import React from "react";
import { Link } from "react-router-dom";
import { BackButton } from "../../components";

export const NotFoundPage = () => {
  return (
    <section className="flex flex-col items-center">
      <p className="bg-gray-800 text-xl leading-7 font-extralight text-gray-200 w-1/4 py-10 ml-auto mr-auto rounded-md">
        Nie znaleziono
      </p>
      <Link to="/forms" className="flex w-min mt-4">
        <BackButton />
        <span className="w-max">Powrót do formularzy</span>
      </Link>
    </section>
  );
};
