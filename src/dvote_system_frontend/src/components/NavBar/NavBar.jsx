import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@ic-reactor/react";
import { toast } from "react-toastify";
import { ROLES_PL } from "../../auth/roles";

export const NavBar = ({ logout, identity, authenticated, userRole }) => {
  const userIdentity = identity?.getPrincipal()?.toText();
  const isAnonymous = identity?.getPrincipal()?.isAnonymous();

  return (
    <nav className="flex flex-col justify-between w-full mb-10">
      <div className="flex justify-center lg:justify-between w-full border-b-2 border-b-gray-800 p-4 flex-wrap gap-9">
        <p className="text-3xl leading-9 font-extralight flex items-center">
          <Link to={"/forms"}>System Głosowań Online</Link>
        </p>
        <div className="flex gap-9 items-center min-h-9 flex-col sm:flex-row">
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
              </div> */}
              <div className="flex justify-self-end items-center gap-2 ml-auto">
                <p className="text-base leading-6 font-semibold text-gray-900">
                  Zalogowano jako <b>{ROLES_PL[userRole] ?? ""}</b>
                </p>
                <button
                  onClick={() => logout()}
                  className="bg-gray-800 text-gray-200 px-4 rounded text-xs leading-4 font-normal min-h-9"
                >
                  Wyloguj
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <p className="text-right">
        {isAnonymous ? (
          "Użytkownik anonimowy"
        ) : (
          <>
            <b>Twój identyfikator</b>: {userIdentity}
          </>
        )}
      </p>
    </nav>
  );
};
