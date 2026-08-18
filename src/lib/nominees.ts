export type Nominee = {
  id: string;
  name: string;
  description?: string;
};

// Shown on the QR/poster page (home page) and browser tab title.
export const shortTitle = "Member Trustee Elections";

// Step 1: intro message shown right after scanning the QR code.
export const pollTitle =
  "Free Standing Additional Voluntary Contribution Retirement Fund";
export const pollSubtitle = "Annual General Meeting — Member Trustee Elections";

// Step 2: instructions shown before the nominee list.
export const instructions =
  "The following page shows the 5 nominees together with their qualifications. Please select the most preferred candidate.";

// NOTE: names below are a best-effort transcription from a handwritten sketch — please
// confirm the spellings. Also add each candidate's qualifications in `description`
// (the sketch says qualifications should be shown alongside each nominee).
export const nominees: Nominee[] = [
  { id: "violet-malebogo", name: "Violet Malebogo" },
  { id: "kenoiri-japone", name: "Kenoiri Japone" },
  { id: "neelo-oburitse", name: "Neelo Oburitse" },
  { id: "salalema-sebinanyane", name: "Salalema Sebinanyane" },
  { id: "candidate-5", name: "Name Surname" },
];
