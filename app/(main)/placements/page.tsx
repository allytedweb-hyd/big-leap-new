export const dynamic = "force-dynamic";
import PlacementsHero from "../../components/placements/PlacementsHero";
import PlacementsHowWeHelp from "../../components/placements/PlacementsHowWeHelp";
import PlacementsCompanies from "../../components/placements/PlacementsCompanies";
import PlacementsSystem from "@/app/components/placements/PlacementsSystem";
import PlacementsTransformation from "../../components/placements/PlacementsTransformation";
import Testimonials from '../../components/home/Testimonials';
import FAQ from '../../components/home/Faq';
import GetInTouch from '../../components/home/GetInTouch';
import PlacementsWhyItWorks from "@/app/components/placements/PlacementsWhyItWorks";

export const metadata = {
  title: "Placements | Big Leap Technologies",
  description:
    "Get industry-ready while still learning. Build real projects, crack interviews, and enter the hiring pipeline before your course even ends.",
};

export default function PlacementsPage() {
  return (
    <main>
      <PlacementsHero />
      <PlacementsHowWeHelp />
      <PlacementsCompanies />
      <PlacementsSystem />
      <PlacementsTransformation />
      <Testimonials />
      {/* <PlacementsWhyItWorks /> */}
      <FAQ />
      <GetInTouch />
    </main>
  );
}