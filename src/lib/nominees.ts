export type Nominee = {
  id: string;
  name: string;
  description?: string;
};

// Shown on the QR/poster page (home page) and browser tab title.
export const shortTitle = "Member Trustee Elections";

// Step 1: intro message shown right after scanning the QR code.
export const welcomeMessage = "Welcome";
export const pollTitle =
  "Free Standing Additional Voluntary Contribution Retirement Fund";
export const pollSubtitle = "Annual General Meeting — Member Trustee Elections";

// Step 2: instructions shown before the nominee list.
export const instructions =
  "The following page shows the 5 nominees together with their qualifications. Please select the most preferred candidate.";

// Source: Candidate Qualification Summary document.
export const nominees: Nominee[] = [
  {
    id: "violet-malebogo-motlhatso",
    name: "Violet Malebogo Motlhatso",
    description:
      "Bachelor of Accountancy graduate and BICA Accounting Technician with professional training in taxation and financial management.",
  },
  {
    id: "kenosi-japane",
    name: "Kenosi Japane, Pr. Eng.",
    description:
      "Professional Mining Engineer with a Mining Engineering degree from Queen's University and Management Development Programme qualification from Stellenbosch Business School.",
  },
  {
    id: "neelo-lebogang-obusitse",
    name: "Neelo Lebogang Obusitse",
    description:
      "Qualified Attorney with postgraduate qualifications in Enterprise Risk Management, Compliance Management, and Business Sustainability Management.",
  },
  {
    id: "salalenna-kgomotso-sebinanyane",
    name: "Salalenna Kgomotso Sebinanyane",
    description:
      "Accounting professional holding ACCA (Part 1), AAT qualifications, and BICA membership.",
  },
  {
    id: "gorata-koboyatshwene",
    name: "Gorata Koboyatshwene",
    description:
      "Bachelor of Accountancy graduate and BICA Accounting Technician currently pursuing a Postgraduate Diploma in Taxation.",
  },
];
