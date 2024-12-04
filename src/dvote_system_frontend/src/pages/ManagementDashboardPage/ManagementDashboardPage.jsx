import React from "react";
import { BackButton } from "../../components/BackButton/BackButton";
import { Link } from "react-router-dom";
import { Spinner } from "../../components";

export const ManagementDashboardPage = ({ userRole }) => {
  return userRole ? (
    <section>
      <BackButton backLocation="/forms" text="Formularze" />
      <div className="flex flex-wrap gap-6 justify-center p-6 mt-44 mb-44">
        {userRole !== "voter" && (
          <Link
            to="/manage/form/create"
            className="flex items-center justify-center w-[150px] h-[150px] bg-blue-500 text-white font-semibold text-center rounded-sm cursor-pointer hover:bg-blue-600"
          >
            <span>Utwórz nowy formularz</span>
          </Link>
        )}

        <Link
          to="/manage/forms"
          className="flex items-center justify-center w-[150px] h-[150px] bg-yellow-500 text-white font-semibold text-center rounded-sm  cursor-pointer hover:bg-yellow-600"
        >
          <span>Zarządzaj formularzami</span>
        </Link>

        <Link
          to="/manage/users"
          className="flex items-center justify-center w-[150px] h-[150px] bg-red-500 text-white font-semibold text-center rounded-sm cursor-pointer hover:bg-red-600"
        >
          <span>Zarządzaj użytkownikami</span>
        </Link>
      </div>
    </section>
  ) : (
    <Spinner />
  );
};
