import AboutSection from "./components/about-section";
import AppointmentSection from "./components/appointment-section";
import HeroSection from "./components/hero-section";
import NoticeSection from "./components/notice-section";
import WhyChooseSection from "./components/whychoose-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <NoticeSection />
      <AppointmentSection />
      <WhyChooseSection />
    </>
  );
};

export default HomePage;
