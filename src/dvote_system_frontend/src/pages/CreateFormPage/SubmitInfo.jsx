import React from "react";
import { BackButton } from "../../components";
import { Link } from "react-router-dom";

export const SubmitInfo = ({ isSuccessfull, formId, onGoBack }) => {
  return (
    <section>
      <div>
        {isSuccessfull
          ? `Formularz o identyfikatorze ${formId}
          Został pomyślnie dodany`
          : "Formularz nie został utworzony"}
      </div>
      {isSuccessfull ? (
        <div>
          <Link onClick={() => onGoBack()} backLocation={"/manage/form/create"}>
            Stwórz kolejny
          </Link>

          <div>
            <Link to={`/form/${formId}`}>Przejdź do formularza</Link>
          </div>
        </div>
      ) : (
        <div>
          <Link onClick={() => onGoBack()} backLocation={"/manage/form/create"}>
            Stwórz kolejny
          </Link>
        </div>
      )}
    </section>
  );
};
