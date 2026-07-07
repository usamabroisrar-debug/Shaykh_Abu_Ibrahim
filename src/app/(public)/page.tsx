import { Hero } from "@/components/home/hero/Hero";
import { Statistics } from "@/components/home/statistics/Statistics";
import { CoursesSection } from "@/components/home/courses/CoursesSection";
import { WhyChooseUs } from "@/components/home/whyChooseUs/WhyChooseUs";
import { LearningJourney } from "@/components/home/learningJourney/LearningJourney";
import { Teachers } from "@/components/home/teachers/Teachers";
import { BooksSection } from "@/components/home/books/BooksSection";
import { PricingPlans } from "@/components/home/pricingPlans/PricingPlans";
import { Testimonials } from "@/components/home/testimonials/Testimonials";
import { LatestBlogs } from "@/components/home/latestBlogs/LatestBlogs";
import { QuizSection } from "@/components/home/quizSection/QuizSection";
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
      <BooksSection />
      <Testimonials />
      <LatestBlogs />
      <QuizSection />
      <FAQ />
      <CTA />
    </>
  );
}
