import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { BackButton } from "../../components/BackButton/BackButton";
import { useQueryCall } from "@ic-reactor/react";
import { Spinner } from "../../components";
import { toast } from "react-toastify";
import { principal } from "@ic-reactor/react/dist/utils";
import { transformIsoDateString } from "../../utils/transformIsoDateString";

export const FormPage = () => {
  let { id } = useParams();
  const navigate = useNavigate();

  const [isFormReady, setIsFormReady] = useState(false);

  const {
    call,
    data: formDetails,
    loading,
  } = useQueryCall({
    functionName: "getForm",
    args: [id],
    refetchOnMount: true,
    onSuccess: () => console.log("SUCCESS"),
  });

  const {
    call: startForm,
    data: votingFormData,
    loading: startFormLoading,
  } = useQueryCall({
    functionName: "startForm",
    args: [id],
    refetchOnMount: false,
    onSuccess: () => console.log("SUCCESS"),
    onError: (e) => toast(e.reject_message, { type: "error" }),
  });

  const startVoting = async () => {
    const [data] = await startForm();
    console.log(data);
    if (data && Object.keys(data).length) navigate(`/form/${id}/vote`);
  };

  useEffect(() => {
    console.log("votingFormData", votingFormData, startFormLoading);
    if (votingFormData && Object.keys(votingFormData).length)
      setIsFormReady(() => true);
  }, [votingFormData, startFormLoading]);

  const { formName, formDescription, voters, formDate, formEndDate } =
    (formDetails && formDetails[0]) || {};
  const { fullDate: startDateString, fullTime: startTimeString } =
    transformIsoDateString(formDate);
  const { fullDate: endDateString, fullTime: endTimeString } =
    transformIsoDateString(formEndDate);

  useEffect(() => console.log(loading), [loading]);

  useEffect(() => console.log(formDetails), [formDetails]);

  return !loading ? (
    <div className="flex flex-col">
      <BackButton backLocation="/forms" />
      <div className="flex gap-11 items-end">
        <div className="p-10 bg-gray-600 text-gray-50 text-3xl font-extralight w-96 min-h-96 flex flex-col items-start rounded">
          <h1 className="">{formName}</h1>
          <h2 className="mt-10">Opis Formularza</h2>
          <p className="font-normal text-sm text-left mt-10">
            {formDescription}
          </p>
        </div>
        <div className="max-h-[345px] min-w-[600px] bg-gray-800 text-white p-10 text-xs leading-4 font-normal flex flex-col">
          <div className="flex flex-col items-start gap-3 mb-14">
            <p>
              <b className="font-extrabold">Uprawnieni do głosowania:</b>{" "}
              {voters?.reduce((acc, curr) => acc + ` ${curr}`, "")}
            </p>
            <p>
              <b className="font-extrabold">Data rozpoczęcia: </b>{" "}
              {`${startDateString} - ${startTimeString}`}
            </p>
            <p>
              <b className="font-extrabold">Data zakończenia: </b>{" "}
              {`${endDateString} - ${endTimeString}`}
            </p>
          </div>

          <button
            className="px-10 py-5 bg-green-100 text-gray-800 w-[240px] rounded"
            onClick={() => startVoting()}
          >
            Rozpocznij głosowanie
          </button>
        </div>
      </div>
    </div>
  ) : (
    <Spinner />
  );
};
