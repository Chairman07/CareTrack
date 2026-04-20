export type Sex = "Female" | "Male" | "Other";

export interface Visit {
  id: string;
  date: string; // ISO
  reason: string;
  diagnosis: string;
  notes: string;
  clinician: string;
  vitals?: { bp?: string; hr?: number; temp?: number };
}

export interface Patient {
  id: string;            // CT-2024-0142
  firstName: string;
  lastName: string;
  dob: string;           // ISO
  sex: Sex;
  phone: string;
  village: string;
  allergies: string[];
  conditions: string[];
  bloodType?: string;
  registeredAt: string;
  lastVisit?: string;
  visits: Visit[];
}

const today = new Date();
const d = (daysAgo: number) =>
  new Date(today.getTime() - daysAgo * 86400000).toISOString();

export const patients: Patient[] = [
  {
    id: "CT-2024-0142",
    firstName: "Amara",
    lastName: "Okafor",
    dob: "1987-03-12",
    sex: "Female",
    phone: "+234 803 555 0142",
    village: "Nsukka",
    allergies: ["Penicillin"],
    conditions: ["Hypertension"],
    bloodType: "O+",
    registeredAt: d(420),
    lastVisit: d(6),
    visits: [
      { id: "v1", date: d(6), reason: "Follow-up: BP", diagnosis: "Stable hypertension", notes: "Continue amlodipine 5mg. Encourage low-sodium diet.", clinician: "Dr. N. Adeyemi", vitals: { bp: "132/84", hr: 72, temp: 36.6 } },
      { id: "v2", date: d(94), reason: "Headache, dizziness", diagnosis: "Hypertension stage 1", notes: "Started amlodipine. Lifestyle counseling.", clinician: "Dr. N. Adeyemi", vitals: { bp: "148/92", hr: 80, temp: 36.7 } },
      { id: "v3", date: d(380), reason: "Annual check-up", diagnosis: "Healthy", notes: "Routine labs ordered.", clinician: "Dr. K. Mensah" },
    ],
  },
  {
    id: "CT-2024-0138",
    firstName: "Joseph",
    lastName: "Banda",
    dob: "2015-08-04",
    sex: "Male",
    phone: "+260 977 555 0138",
    village: "Kafue",
    allergies: [],
    conditions: ["Asthma"],
    bloodType: "A+",
    registeredAt: d(310),
    lastVisit: d(2),
    visits: [
      { id: "v1", date: d(2), reason: "Wheezing episode", diagnosis: "Mild asthma exacerbation", notes: "Salbutamol inhaler. Spacer training given to caregiver.", clinician: "Dr. K. Mensah", vitals: { hr: 102, temp: 37.1 } },
    ],
  },
  {
    id: "CT-2024-0131",
    firstName: "Fatima",
    lastName: "Diallo",
    dob: "1962-11-21",
    sex: "Female",
    phone: "+221 77 555 0131",
    village: "Thiès",
    allergies: ["Sulfa drugs"],
    conditions: ["Type 2 Diabetes", "Osteoarthritis"],
    bloodType: "B+",
    registeredAt: d(720),
    lastVisit: d(18),
    visits: [
      { id: "v1", date: d(18), reason: "Glucose review", diagnosis: "T2DM — controlled", notes: "HbA1c 6.9%. Continue metformin 500mg BID.", clinician: "Dr. N. Adeyemi", vitals: { bp: "128/78", hr: 70 } },
    ],
  },
  {
    id: "CT-2024-0127",
    firstName: "Tendai",
    lastName: "Moyo",
    dob: "1995-01-30",
    sex: "Male",
    phone: "+263 71 555 0127",
    village: "Bulawayo",
    allergies: [],
    conditions: [],
    bloodType: "O-",
    registeredAt: d(60),
    lastVisit: d(60),
    visits: [
      { id: "v1", date: d(60), reason: "New registration", diagnosis: "Healthy adult", notes: "Baseline vitals recorded.", clinician: "Dr. K. Mensah", vitals: { bp: "118/76", hr: 64, temp: 36.5 } },
    ],
  },
  {
    id: "CT-2024-0119",
    firstName: "Aisha",
    lastName: "Hassan",
    dob: "1990-07-17",
    sex: "Female",
    phone: "+254 712 555 0119",
    village: "Kisumu",
    allergies: [],
    conditions: ["Pregnancy — 2nd trimester"],
    bloodType: "AB+",
    registeredAt: d(140),
    lastVisit: d(11),
    visits: [
      { id: "v1", date: d(11), reason: "Antenatal visit", diagnosis: "Normal pregnancy 22w", notes: "Fundal height appropriate. Iron supplementation continued.", clinician: "Dr. N. Adeyemi", vitals: { bp: "112/70", hr: 84 } },
    ],
  },
  {
    id: "CT-2024-0103",
    firstName: "Samuel",
    lastName: "Kamau",
    dob: "1978-05-09",
    sex: "Male",
    phone: "+254 720 555 0103",
    village: "Nakuru",
    allergies: ["Aspirin"],
    conditions: ["Migraine"],
    bloodType: "A-",
    registeredAt: d(900),
    lastVisit: d(45),
    visits: [
      { id: "v1", date: d(45), reason: "Recurrent migraine", diagnosis: "Episodic migraine", notes: "Trial of propranolol prophylaxis.", clinician: "Dr. K. Mensah" },
    ],
  },
];

export const ageFromDob = (dob: string) => {
  const b = new Date(dob);
  const now = new Date();
  let a = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) a--;
  return a;
};

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

export const formatRelative = (iso: string) => {
  const days = Math.round((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.round(days / 30)} mo ago`;
  return `${Math.round(days / 365)} yr ago`;
};
