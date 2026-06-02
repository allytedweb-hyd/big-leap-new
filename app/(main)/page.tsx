export const dynamic = "force-dynamic";
import Banner from '../components/home/Banner';
import Courses from '../components/courses/CoursesGrid';

import ToolsYouMaster from '../components/home/ToolsYouMaster';
import WhyStudentsFail from '../components/home/WhyStudentsFail';
import LearningJourney  from '../components/home/LearningJourney';

import WhyChooseUs from '../components/home/WhyChooseUs';
import Testimonials  from '../components/home/Testimonials';
import FAQ from '../components/home/Faq';
import GetInTouch from '../components/home/GetInTouch';


import  OurClients from '../components/home/OurClients';





export default function HomePage() {
  return (
    <>
  
      <Banner />
      <Courses />
      <ToolsYouMaster />
      <WhyStudentsFail />
      <LearningJourney/>
      <WhyChooseUs />     
      <OurClients />
      <Testimonials />
      <FAQ/>
       <GetInTouch />
      

    </>
  );
}