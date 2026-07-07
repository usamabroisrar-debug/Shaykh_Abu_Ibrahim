export type Statistic = {
  id: string;
  value: string;
  label: string;
  detail: string;
};

export const statistics: Statistic[] = [
  {
    id: "stat-1",
    value: "1,200+",
    label: "Active students",
    detail: "Across Quran, Hifz, Tajweed, and Islamic studies cohorts",
  },
  {
    id: "stat-2",
    value: "96%",
    label: "Retention rate",
    detail: "Driven by structured pathways, feedback, and flexible scheduling",
  },
  {
    id: "stat-3",
    value: "40+",
    label: "Weekly live sessions",
    detail: "Serving children, adults, sisters, and advanced learners",
  },
  {
    id: "stat-4",
    value: "8",
    label: "Signature programs",
    detail: "Built to support learners from first letters to deep study",
  },
];
