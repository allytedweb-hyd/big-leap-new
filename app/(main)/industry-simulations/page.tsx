
export const dynamic = "force-dynamic";
import IndustryHero from "../../components/industry-simulations/IndustryHero";
import WorkLikeEngineer from "../../components/industry-simulations/WorkLikeEngineer";
import BuiltForYou from "../../components/industry-simulations/BuiltForYou";
import CoreExperiences from "../../components/industry-simulations/CoreExperiences";
import VSComparison from "../../components/industry-simulations/VSComparison";
import GetInTouch from "../../components/home/GetInTouch";

export default function IndustrySimulationPage() {
  return (
    <>
      <IndustryHero />
      <WorkLikeEngineer />
      <BuiltForYou />
      <CoreExperiences />
      <VSComparison />
      <GetInTouch />
    </>
  );
}