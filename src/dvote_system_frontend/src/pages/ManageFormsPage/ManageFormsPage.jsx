import React, { useEffect } from "react";

import { useQueryCall } from "@ic-reactor/react";

import { NoForms } from "../../components/FormGrid/components/NoForms";
import { BackButton, Spinner } from "../../components";
import { FormTile } from "../../components";
import { translateFormType } from "../../utils/translateFormType";
import { transformIsoDateString } from "../../utils/transformIsoDateString";

export const ManageFormsPage = () => {
  const {
    call,
    data: formsData,
    loading,
  } = useQueryCall({
    functionName: "getAllForms",
    args: ["notStarted"],
    refetchOnMount: true,
  });

  useEffect(() => console.log(formsData), [formsData]);

  const renderFormTiles = () =>
    formsData?.length > 0 ? (
      formsData.map(
        ([
          id,
          {
            formType,
            formName,
            author,
            duration,
            formDate,
            formEndDate,
            status,
          },
        ]) => (
          <FormTile
            key={id}
            id={id}
            voteType={translateFormType(formType)}
            title={formName}
            author={author}
            duration={duration}
            startDate={transformIsoDateString(formDate)}
            rawStartDate={formDate}
            rawEndDate={formEndDate}
            formStatus={status}
            inspect
          />
        ),
      )
    ) : (
      <NoForms />
    );

  return (
    <section>
      <BackButton text="Zarządzaj" backLocation="/manage" />
      <h1 className="flex font-extralight text-3xl">Niekompletne formularze</h1>

      <div className="flex flex-wrap gap-6 mt-20">
        {!loading ? renderFormTiles() : <Spinner />}
      </div>
    </section>
  );
};
