import React, { useState } from "react";
import { toast } from "react-toastify";

export const CreateFormPage = () => {
  const [formName, setFormName] = useState({
    value: "",
    error: false,
    errorMessage: "To pole jest wymagane.",
  });
  const [formDescription, setFormDescription] = useState({
    value: "",
    error: false,
    errorMessage: "To pole jest wymagane.",
  });
  const [formDate, setFormDate] = useState({
    value: "",
    error: false,
    errorMessage: "To pole jest wymagane.",
  });
  const [formType, setFormType] = useState({
    value: "",
    error: false,
    errorMessage: "To pole jest wymagane.",
  });
  const [voters, setVoters] = useState([
    { value: "", error: false, errorMessage: "To pole jest wymagane." },
  ]);
  const [questions, setQuestions] = useState([
    { value: "", error: false, errorMessage: "To pole jest wymagane." },
  ]);

  const today = new Date().toISOString().split("T")[0];

  const errorPushMessage = () =>
    toast("Wszystkie wymagane pola nie mogą być puste!", { type: "error" });
  const successPushMessage = () => {
    toast("Zweryfikowano pomyślnie!", { type: "success" });
  };

  const addVoterInput = () => {
    // setVoters([
    //   ...voters,
    //   { value: "", error: false, errorMessage: "To pole jest wymagane." },
    // ]);

    const updatedVoters = voters.map((voter) => ({
      ...voter,
      error: voter.value.trim() === "",
    }));

    if (updatedVoters.every((voter) => !voter.error)) {
      setVoters([
        ...voters,
        { value: "", error: false, errorMessage: "To pole jest wymagane." },
      ]);
    } else {
      setVoters(updatedVoters);
    }
  };

  const addQuestionInput = () => {
    // setQuestions([
    //   ...questions,
    //   { value: "", error: false, errorMessage: "To pole jest wymagane." },
    // ]);

    const updatedQuestions = questions.map((question) => ({
      ...question,
      error: question.value.trim() === "",
    }));

    if (updatedQuestions.every((question) => !question.error)) {
      setQuestions([
        ...questions,
        { value: "", error: false, errorMessage: "To pole jest wymagane." },
      ]);
    } else {
      setQuestions(updatedQuestions);
    }
  };

  const handleVoterChange = (index, value) => {
    const newVoters = [...voters];
    newVoters[index] = {
      value,
      error: false,
      errorMessage: "To pole jest wymagane.",
    };
    setVoters(newVoters);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = {
      value,
      error: false,
      errorMessage: "To pole jest wymagane.",
    };
    setQuestions(newQuestions);
  };

  const removeVoterInput = (index) => {
    if (voters.length > 1) {
      const newVoters = voters.filter((_, i) => i !== index);
      setVoters(newVoters);
    }
  };

  const removeQuestionInput = (index) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    }
  };

  const handleGenerateForm = () => {
    let isValid = true;
    let allFieldsFilled = true;

    // Initial check for empty fields
    if (formName.value.trim() === "") {
      setFormName((prev) => ({
        ...prev,
        error: true,
        errorMessage: "To pole jest wymagane.",
      }));
      isValid = false;
      allFieldsFilled = false;
    }

    if (formDescription.value.trim() === "") {
      setFormDescription((prev) => ({
        ...prev,
        error: true,
        errorMessage: "To pole jest wymagane.",
      }));
      isValid = false;
      allFieldsFilled = false;
    }

    if (!formDate.value) {
      setFormDate((prev) => ({
        ...prev,
        error: true,
        errorMessage: "To pole jest wymagane.",
      }));
      isValid = false;
      allFieldsFilled = false;
    }

    if (formType.value === "") {
      setFormType((prev) => ({
        ...prev,
        error: true,
        errorMessage: "To pole jest wymagane.",
      }));
      isValid = false;
      allFieldsFilled = false;
    }

    if (voters.some((voter) => voter.value.trim() === "")) {
      setVoters((prev) =>
        prev.map((voter) =>
          voter.value.trim() === ""
            ? { ...voter, error: true, errorMessage: "To pole jest wymagane." }
            : voter,
        ),
      );
      isValid = false;
      allFieldsFilled = false;
    }

    if (questions.some((question) => question.value.trim() === "")) {
      setQuestions((prev) =>
        prev.map((question) =>
          question.value.trim() === ""
            ? {
                ...question,
                error: true,
                errorMessage: "To pole jest wymagane.",
              }
            : question,
        ),
      );
      isValid = false;
      allFieldsFilled = false;
    }

    // If all fields are filled, check for specific validations
    if (allFieldsFilled) {
      // Custom validation: Date should be today or in the future
      if (formDate.value < today) {
        setFormDate((prev) => ({
          ...prev,
          error: true,
          errorMessage: "Please select today or a future date.",
        }));
        isValid = false;
      }

      // Example custom error for form type
      if (formType.value !== "open" && formType.value !== "secret") {
        setFormType((prev) => ({
          ...prev,
          error: true,
          errorMessage: "Form type must be either 'open' or 'secret'.",
        }));
        isValid = false;
      }

      // Additional custom validations for voters and questions if needed
    }

    if (isValid) {
      alert("Form generated successfully!");
    }
  };

  return (
    <div className="flex flex-col p-6 min-h-min">
      <section className="flex">
        {/* Left Column */}
        <div className="w-1/2 p-6 bg-white rounded-lg">
          <h2 className="text-3xl font-extralight leading-9 mb-6 justify-self-start">
            Nowy formularz
          </h2>

          {/* Form name input */}
          <div className="mb-6">
            <label
              className="block text-sm font-normal leading-4 mb-2 justify-self-start"
              htmlFor="formName"
            >
              Nazwa formularza
            </label>
            <input
              type="text"
              id="formName"
              value={formName.value}
              onChange={(e) =>
                setFormName({
                  value: e.target.value,
                  error: false,
                  errorMessage: "To pole jest wymagane.",
                })
              }
              placeholder="Wprowadź nazwę formularza"
              className={`w-full border p-2 rounded-md ${formName.error ? "border-red-500" : "border-gray-300"}`}
            />
            {formName.error && (
              <p className="text-red-500 text-xs mt-1 justify-self-start">
                {formName.errorMessage}
              </p>
            )}
          </div>

          {/* Form description input */}
          <div className="mb-6">
            <label
              className="block text-sm font-normal leading-4 mb-2 justify-self-start"
              htmlFor="formName"
            >
              Opis formularza
            </label>
            <textarea
              type="text"
              id="formName"
              value={formDescription.value}
              onChange={(e) =>
                setFormDescription({
                  value: e.target.value,
                  error: false,
                  errorMessage: "To pole jest wymagane.",
                })
              }
              placeholder="Wprowadź opis formularza"
              className={`min-h-10 max-h-64 w-full border p-2 rounded-md ${formDescription.error ? "border-red-500" : "border-gray-300"}`}
            />
            {formDescription.error && (
              <p className="text-red-500 text-xs mt-1 justify-self-start">
                {formDescription.errorMessage}
              </p>
            )}
          </div>

          {/* Date input */}
          <div className="mb-6">
            <label
              className="block text-sm font-normal leading-4 mb-2 justify-self-start"
              htmlFor="formDate"
            >
              Wybierz datę rozpoczęcia
            </label>
            <input
              type="date"
              id="formDate"
              value={formDate.value}
              onChange={(e) =>
                setFormDate({
                  value: e.target.value,
                  error: false,
                  errorMessage: "To pole jest wymagane.",
                })
              }
              min={today}
              className={`w-full border p-2 rounded-md ${formDate.error ? "border-red-500" : "border-gray-300"}`}
            />
            {formDate.error && (
              <p className="text-red-500 text-xs mt-1 justify-self-start">
                {formDate.errorMessage}
              </p>
            )}
          </div>

          {/* Dropdown for form type */}
          <div className="mb-6">
            <label
              className="block text-sm font-normal leading-4 mb-2 justify-self-start"
              htmlFor="formType"
            >
              Wybierz typ formularza
            </label>
            <select
              id="formType"
              value={formType.value}
              onChange={(e) =>
                setFormType({
                  value: e.target.value,
                  error: false,
                  errorMessage: "To pole jest wymagane.",
                })
              }
              className={`w-full border p-2 rounded-md ${formType.error ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Wybierz Typ</option>
              <option value="open">Jawne</option>
              <option value="secret">Tajne</option>
            </select>
            {formType.error && (
              <p className="text-red-500 text-xs mt-1 justify-self-start">
                {formType.errorMessage}
              </p>
            )}
          </div>

          {/* Voters assignment input */}
          <div className="mb-6 flex flex-col">
            <label className="flex text-sm font-normal leading-4 mb-2 justify-self-start">
              Przypisz głosujących
            </label>
            {voters.map((voter, index) => (
              <div key={index} className="mb-2">
                <div className="flex">
                  <input
                    type="text"
                    value={voter.value}
                    onChange={(e) => handleVoterChange(index, e.target.value)}
                    className={`border p-2 rounded-md ${voter.error ? "border-red-500" : "border-gray-300"} flex-1`}
                    placeholder="Wprowadź identyfikator użytkownika"
                  />
                  {voters.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVoterInput(index)}
                      className="text-red-500 hover:text-red-700 text-2xl ml-2 font-bold"
                    >
                      &times;
                    </button>
                  )}
                </div>
                {voter.error && (
                  <p className="text-red-500 text-xs mt-1 justify-self-start">
                    {voter.errorMessage}
                  </p>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addVoterInput}
              className="bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Dodaj głosującego
            </button>
            <button
              type="button"
              onClick={() => {}}
              className="bg-gray-400 text-white px-4 py-2 rounded-md mt-2 w-32 self-end"
            >
              Importuj
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-1/2 p-6 bg-white ml-4">
          <section className="flex flex-col">
            <h2 className="text-3xl font-extralight leading-9 mb-6 self-start">
              Wprowadź pytania
            </h2>
            {questions.map((question, index) => (
              <div key={index} className="mb-2">
                <div className="flex">
                  <span className="mr-2 self-center">{index + 1}.</span>
                  <input
                    type="text"
                    value={question.value}
                    onChange={(e) =>
                      handleQuestionChange(index, e.target.value)
                    }
                    className={`w-full border p-2 rounded-md ${question.error ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Wprowadź pytanie"
                  />
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestionInput(index)}
                      className="text-red-500 hover:text-red-700 text-2xl ml-2 font-bold"
                    >
                      &times;
                    </button>
                  )}
                </div>
                {question.error && (
                  <p className="text-red-500 text-xs mt-1 justify-self-start">
                    {question.errorMessage}
                  </p>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addQuestionInput}
              className="bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Dodaj pytanie
            </button>
          </section>
        </div>
      </section>
      {/* Generate Form Button */}
      <button
        type="button"
        onClick={handleGenerateForm}
        className="bg-green-100 text-black px-14 py-5 rounded-md text-sm leading-5 font-bold w-60 self-end"
      >
        Generuj Formularz
      </button>
    </div>
  );
};