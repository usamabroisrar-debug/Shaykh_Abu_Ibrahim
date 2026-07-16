import { Hero } from "@/components/home/hero/Hero";
import { Statistics } from "@/components/home/statistics/Statistics";
import { CoursesSection } from "@/components/home/courses/CoursesSection";
import { WhyChooseUs } from "@/components/home/whyChooseUs/WhyChooseUs";
import { LearningJourney } from "@/components/home/learningJourney/LearningJourney";
import { Teachers } from "@/components/home/teachers/Teachers";
import { PricingPlans } from "@/components/home/pricingPlans/PricingPlans";
import { FAQ } from "@/components/home/faq/FAQ";
import { CTA } from "@/components/home/cta/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Statistics />
      <CoursesSection />
      <WhyChooseUs />
      <LearningJourney />
      <Teachers />
      <PricingPlans />
      <FAQ />
      <CTA />
    </>
  );
}
