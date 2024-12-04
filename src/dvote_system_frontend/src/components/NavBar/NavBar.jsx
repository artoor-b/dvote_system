import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@ic-reactor/react";
import { toast } from "react-toastify";

export const NavBar = ({ logout, identity, authenticated, userRole }) => {
  const userIdentity = identity?.getPrincipal()?.toText();
  const isAnonymous = identity?.getPrincipal()?.isAnonymous();

  return (
    <nav className="flex flex-col justify-between w-full mb-10">
      <div className="flex justify-between w-full border-b-2 border-b-gray-800 p-4">
        <p className="text-3xl leading-9 font-extralight flex items-center">
          <Link to={"/forms"}>Voting Form</Link>
        </p>
        <div className="flex gap-10 items-center">
          {!isAnonymous && authenticated && (
            <>
              {userRole !== "voter" && (
                <Link to={"/manage"}>
                  <button className="rounded-md bg-gray-100 flex items-center px-5 text-xs leading-4 font-normal border border-gray-800 h-10">
                    Zarządzaj
                  </button>
                </Link>
              )}
              {/* <div className="bg-gray-50 flex justify-center items-center w-12 h-12 rounded-full text-sm leading-5 font-medium">
                JD
              </div>
              <p className="text-base leading-6 font-semibold text-gray-900">
                John Doe
              </p> */}
              <button
                onClick={() => logout()}
                className="bg-gray-800 text-gray-200 px-4 rounded text-xs leading-4 font-normal h-full"
              >
                Wyloguj
              </button>
            </>
          )}
        </div>
      </div>
      <p className="text-right">
        {isAnonymous
          ? "Użytkownik anonimowy"
          : `Zalogowano jako: ${userIdentity} ${userRole ?? ""}`}
      </p>
    </nav>
  );
};
