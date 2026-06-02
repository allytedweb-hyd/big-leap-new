export const dynamic = "force-dynamic";
import CoursesHero from "@/app/components/courses/CoursesHero";

import GetInTouch from '../../components/home/GetInTouch';
import CourseGrid from "../../components/courses/CoursesGrid";


export default function Courses() {
  return (
    <>
  
      
      <CoursesHero />
      <CourseGrid />

      <GetInTouch />

    </>
  );
}