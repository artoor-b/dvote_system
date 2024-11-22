export const translateFormType = (formType) => {
  switch (formType) {
    case "public":
      return "Jawne";
    case "secret":
      return "Tajne";
  }
};
