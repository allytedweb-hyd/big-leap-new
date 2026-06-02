
export const dynamic = "force-dynamic";
import AboutHero from "../../components/aboutus/AboutHero";
import AboutMission from "../../components/aboutus/AboutMission";
import AboutMissiontwo from "../../components/aboutus/AboutMissiontwo";
import FAQ from '../../components/home/Faq';
import Testimonials from '../../components/home/Testimonials';
import GetInTouch from '../../components/home/GetInTouch';

export const metadata = {
  title: "About Us | Big Leap Technologies",
  description:
    "BigLeap is India's most outcome-focused tech training institute. We bridge the gap between academic learning and real industry demands.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <AboutMission />
      {/* <AboutMissiontwo /> */}
      <FAQ />
          <Testimonials />
          <GetInTouch />
    </main>
  );
}
