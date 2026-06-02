export const dynamic = "force-dynamic";
import PlacementsHero from "../../components/placements/PlacementsHero";
import PlacementsJourney from "../../components/placements/PlacementsJourney";
import PlacementsCompanies from "../../components/placements/PlacementsCompanies";
import PlacementsHowWeHelp from "../../components/placements/PlacementsHowWeHelp";
import Testimonials  from '../../components/home/Testimonials';
import FAQ from '../../components/home/Faq';
import GetInTouch from '../../components/home/GetInTouch';

export const metadata = {
  title: "Placements | Big Leap Technologies",
  description:
    "Get industry-ready while still learning. Build real projects, crack interviews, and enter the hiring pipeline before your course even ends.",
};

export default function PlacementsPage() {
  return (
    <main>
      <PlacementsHero />
      {/* <PlacementsJourney /> */}
      <PlacementsHowWeHelp />
      <PlacementsCompanies />
      
      <Testimonials />
      <FAQ />
      <GetInTouch />

    </main>
  );
}