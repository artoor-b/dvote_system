import React from "react";
import { FormTile } from "../FormTile";
import { Spinner } from "../Spinner";

import { useQueryCall } from "@ic-reactor/react";

export const FormGrid = ({ filterStatus }) => {
  const { data: formsData } = useQueryCall({
    functionName: "getOpenForms",
    refetchOnMount: true,
  });

  return (
    <div className="flex relative flex-wrap gap-6 mt-20">
      {formsData ? (
        formsData.map(
          ({ id, voteType, title, author, duration, status }) =>
            status === filterStatus && (
              <FormTile
                key={id}
                id={id}
                voteType={voteType}
                title={title}
                author={author}
                duration={duration}
              />
            ),
        )
      ) : (
        <Spinner />
      )}
    </div>
  );
};
