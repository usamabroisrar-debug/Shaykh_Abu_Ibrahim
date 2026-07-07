export type PricingPlan = {
  id: string;
  name: string;
  price: string;
  cadence: string;
  description: string;
  isPopular?: boolean;
  features: string[];
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic Plan",
    price: "$26",
    cadence: "Monthly",
    description:
      "Ideal for students beginning a steady Quran routine with teacher support and flexible scheduling.",
    features: [
      "2 classes per week",
      "8 classes per month",
      "One-on-one online sessions",
      "Flexible timings",
      "Zoom or Google Meet support",
    ],
  },
  {
    id: "standard",
    name: "Standard Plan",
    price: "$52",
    cadence: "Monthly",
    description:
      "A balanced plan for learners wanting stronger continuity, feedback, and measurable progress.",
    isPopular: true,
    features: [
      "4 classes per week",
      "16 classes per month",
      "Personalized learning plan",
      "Progress monitoring",
      "Priority rescheduling support",
    ],
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: "$78",
    cadence: "Monthly",
    description:
      "Best for committed students who want a higher-touch learning rhythm and deeper ongoing guidance.",
    features: [
      "6 classes per week",
      "24 classes per month",
      "Dedicated instructor pathway",
      "Priority scheduling",
      "Detailed progress reports",
    ],
  },
];
