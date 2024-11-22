import React, { useEffect, useState } from "react";
import { FormTile } from "../FormTile";
import { Spinner } from "../Spinner";

import { transformIsoDateString } from "../../utils/transformIsoDateString";
import { translateFormType } from "../../utils/translateFormType";

import { useQueryCall } from "@ic-reactor/react";
import { NoForms } from "./components/NoForms";

export const FormGrid = ({ filterStatus }) => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const {
    call,
    data: formsData,
    loading,
  } = useQueryCall({
    functionName: "getAllForms",
    args: [filterStatus],
  });

  const fetchForms = async () => {
    console.log("FETCHING");
    if (filterStatus) await call([filterStatus]);
  };

  useEffect(() => {
    console.log(loading);
    fetchForms();
  }, [filterStatus]);

  useEffect(() => {
    if (!loading && formsData && formsData.length >= 0)
      setIsDataLoaded(() => true);
  }, [formsData, loading, filterStatus]);

  const renderFormTiles = () =>
    formsData?.length > 0 ? (
      formsData.map(
        ([id, { formType, formName, author, duration, formDate }]) => (
          <FormTile
            key={id}
            id={id}
            voteType={translateFormType(formType)}
            title={formName}
            author={author}
            duration={duration}
            startDate={transformIsoDateString(formDate)}
          />
        ),
      )
    ) : (
      <NoForms />
    );

  return (
    <div className="flex flex-wrap gap-6 mt-20">
      {isDataLoaded ? renderFormTiles() : <Spinner />}
    </div>
  );
};
