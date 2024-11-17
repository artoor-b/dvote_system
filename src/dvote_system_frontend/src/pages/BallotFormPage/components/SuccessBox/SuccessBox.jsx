import React from "react";
import TickCircle from "../../../../assets/svg/tickCircle.svg?react";
import ArrowBack from "../../../../assets/svg/arrowBack.svg?react";

import { Link } from "react-router-dom";

export const SuccessBox = () => (
  <section className="flex flex-col items-center mt-24 w-96">
    <div className="bg-green-400 w-96 h-44 rounded-md flex items-center justify-center gap-4">
      <div className="flex-col">
        <p className="font-extralight">Formularz głosowania</p>
        <p className="text-green-900 text-xl leading-7 font-black mt-1">
          ZATWIERDZONY
        </p>
      </div>
      <TickCircle className="w-24 h-24" />
    </div>
    <Link
      className="flex items-center text-xl font-extralight self-start mt-6"
      to="/forms"
    >
      <ArrowBack className="mr-3" />
      Powrót do listy
    </Link>
  </section>
);
