import { Navbar } from "@/components/layout/navbar/Navbar";
import { Footer } from "@/components/layout/footer/Footer";
import { Hero } from "@/components/home/hero/Hero";
import { CoursesSection } from "@/components/home/courses/CoursesSection";
import { WhyChooseUs } from "@/components/home/whyChooseUs/WhyChooseUs";
import { LearningJourney } from "@/components/home/learningJourney/LearningJourney";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CoursesSection />
        <WhyChooseUs />
        <LearningJourney />
      </main>
      <Footer />
    </>
  );
}
