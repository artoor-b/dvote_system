import React from "react";
import { Link } from "react-router-dom";
import { BackButton } from "../../components/BackButton/BackButton";

export const FormPage = ({
  formTitle,
  formDescription,
  duration,
  author,
  users,
}) => {
  return (
    <div className="flex flex-col">
      <BackButton backLocation="/forms" />
      <div className="flex gap-11 items-end">
        <div className="p-10 bg-gray-600 text-gray-50 text-3xl font-extralight w-96 min-h-96 flex flex-col items-start rounded">
          <h1 className="">{formTitle}</h1>
          <h2 className="mt-10">Opis formularza</h2>
          <p className="font-normal text-sm text-left mt-10">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in
            pretium nibh. Proin rhoncus accumsan ornare. Curabitur pretium
            pulvinar faucibus. Etiam rhoncus, erat non elementum tristique,
            felis mi accumsan augue, quis vestibulum elit arcu dapibus nisi.
            Vivamus vitae semper massa. Sed ac fermentum lacus. Mauris dictum
            massa tempus blandit imperdiet. Quisque porttitor lectus vel
            faucibus consequat. Nullam eu placerat enim, a malesuada est. Fusce
            at erat quis tellus egestas blandit. Vestibulum commodo turpis non
            nibh posuere eleifend.{" "}
          </p>
        </div>
        <div className="max-h-[345px] min-w-[600px] bg-gray-800 text-white p-10 text-xs leading-4 font-normal flex flex-col">
          <div className="flex flex-col items-start gap-3 mb-14">
            <p>
              <b className="font-extrabold">Uprawnieni do głosowania:</b> User1,
              User2, User3, User4...
            </p>
            <p>
              <b className="font-extrabold">Czas trwania: 20</b> {duration} min
            </p>
            <p>
              <b className="font-extrabold">Autor:</b> {author}
            </p>
          </div>
          <Link to={"/form/5/vote"}>
            <button className="px-10 py-5 bg-green-100 text-gray-800 w-[240px] rounded">
              Rozpocznij głosowanie
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
