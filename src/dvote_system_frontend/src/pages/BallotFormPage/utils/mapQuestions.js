export const mapQuestions = (questionsData) => {
  const answersStructure = {};

  questionsData.forEach(({ id }) => {
    if (!answersStructure[id]) answersStructure[id] = false;
  });

  return answersStructure;
};
