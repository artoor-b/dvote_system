import React from "react";
import { BackButton } from "../../components";
import { Link } from "react-router-dom";

import TickCircle from "../../assets/svg/tickCircle.svg?react";

export const SubmitInfo = ({ isSuccessfull, formId, onGoBack }) => {
  return (
    <section className="flex flex-col items-center mt-24 p-9">
      <div className="bg-green-400 w-full h-44 rounded-md flex items-center justify-center gap-4">
        {isSuccessfull ? (
          <div>
            <p className="font-medium text-gray-800 text-xl">
              Formularz o identyfikatorze:
            </p>
            <p className="font-extralight text-gray-800 mt-2 mb-2">{formId}</p>
            <p className="font-black text-green-900">Został pomyślnie dodany</p>
          </div>
        ) : (
          "Formularz nie został utworzony"
        )}
        <TickCircle className="w-24 h-24" />
      </div>
      {isSuccessfull ? (
        <div className="flex gap-24 mt-7 font-extralight">
          <BackButton
            text="Stwórz kolejny"
            backLocation="/manage/form/create"
            onClick={() => onGoBack()}
          />
          <BackButton
            text="Przejdź do formularza"
            backLocation={`/form/${formId}`}
            rotate
          />
        </div>
      ) : (
        <div>
          <Link onClick={() => onGoBack()} to={"/manage/form/create"}>
            Stwórz kolejny
          </Link>
        </div>
      )}
    </section>
  );
};
