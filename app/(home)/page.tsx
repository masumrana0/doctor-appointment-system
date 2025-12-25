import AboutSection from "./components/about-section";
import AppointmentSection from "./components/appointment-section";
import HeroSection from "./components/hero-section";
import NoticeSection from "./components/notice-section";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />

      <NoticeSection />
      <AppointmentSection />
    </>
  );
};

export default HomePage;
