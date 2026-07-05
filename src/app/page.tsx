import { Navbar } from "@/components/navbar/Navbar";
import { Hero } from "@/components/hero/Hero";
import { CoursesSection } from "@/components/courses/CoursesSection";
import { WhyChooseUs } from "@/components/whyChooseUs/WhyChooseUs";
import { LearningJourney } from "@/components/learningJourney/LearningJourney";
import { Footer } from "@/components/footer/Footer";

export default function Home() {
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