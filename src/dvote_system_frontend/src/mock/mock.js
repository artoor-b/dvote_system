const forms = [
  {
    id: 1,
    voteType: "Open",
    title: "Form1",
    author: "Arnold Schwarzenneger",
    status: "open",
    ScheduledAt: "01.01.1900",
  },
  {
    id: 2,
    voteType: "Open",
    title: "Form2",
    author: "Jan Kowalski",
    duration: 10,
    status: "completed",
    ScheduledAt: "01.01.1900",
  },
  {
    id: 3,
    voteType: "Open",
    title: "Form3",
    author: "Jan Kowalski",
    duration: 10,
    status: "completed",
    ScheduledAt: "01.01.1900",
  },
  {
    id: 4,
    voteType: "Secret",
    title: "Form4",
    author: "Jan Kowalski",
    duration: 10,
    status: "completed",
    ScheduledAt: "01.01.1900",
  },
  {
    id: 5,
    voteType: "Open",
    title: "Form5",
    author: "Jan Kowalski",
    duration: 10,
    status: "open",
    ScheduledAt: "01.01.1900",
  },
  {
    id: 6,
    voteType: "Open",
    title: "Form6",
    author: "Jan Kowalski",
    duration: 10,
    status: "completed",
    ScheduledAt: "01.01.1900",
  },
  {
    id: 7,
    voteType: "Secret",
    title: "Form7",
    author: "Jan Kowalski",
    duration: 10,
    status: "open",
    ScheduledAt: "01.01.1900",
  },
  {
    id: 8,
    voteType: "Open",
    title: "Form8",
    author: "Jan Kowalski",
    duration: 10,
    status: "open",
    ScheduledAt: "01.01.1900",
  },
  {
    id: 9,
    voteType: "Open",
    title: "Form9",
    author: "Jan Kowalski",
    duration: 10,
    status: "completed",
    ScheduledAt: "01.01.1900",
  },
  {
    id: 10,
    voteType: "Secret",
    title: "Form10",
    author: "Jan Kowalski",
    duration: 10,
    status: "open",
    ScheduledAt: "01.01.1900",
  },
  {
    id: 11,
    voteType: "Open",
    title: "Form11",
    author: "Jan Kowalski",
    duration: 10,
    status: "open",
    ScheduledAt: "01.01.1900",
  },
];

const votingQuestions = [
  {
    id: 1,
    content:
      "Should the organization increase its budget for environmental initiatives?",
  },
  {
    id: 2,
    content: "Do you support implementing a four-day workweek pilot program?",
  },
  {
    id: 3,
    content:
      "Should we adopt a remote work policy as a permanent option for employees?",
  },
  {
    id: 4,
    content:
      "Do you approve the proposal for expanding employee health benefits?",
  },
  {
    id: 5,
    content:
      "Should the company proceed with its plan to open a new office location?",
  },
  {
    id: 6,
    content:
      "Are you in favor of adopting a diversity and inclusion training program for all staff?",
  },
];

export const fetchVotingFormsMock = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(forms), 1000);
  });
};

export const fetchVotingQuestionsMock = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(votingQuestions), 1000);
  });
};
