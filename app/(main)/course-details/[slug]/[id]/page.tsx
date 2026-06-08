
export const dynamic = "force-dynamic";
import CourseHero from "../../../../components/course-details/CourseHero";
import CourseVideo from "../../../../components/course-details/CourseVideo";
import CourseDescription from "../../../../components/course-details/CourseDescription";
import CourseLearning from "../../../../components/course-details/CourseLearning";
import CourseCurriculum from "@/app/components/course-details/CourseCurriculum";
import CoursePricing from "../../../../components/course-details/CoursePricing";
import CourseCertificate from "../../../../components/course-details/CourseCertificate";
import CourseReviews from "../../../../components/course-details/CourseReviews";
import Courses from "../../../../components/home/Courses";
import { BASE_API_URL, UPLOADS_URL } from "../../../../utils/api";
import CourseGrid from "../../../../components/courses/CoursesGrid";

interface Lesson {
  _id: string;
  title: string;
  videoUrl: string;
  duration: number;
}

interface Chapter {
  _id: string;
  title: string;
  lessons: Lesson[];
}

interface Course {
  _id: string;
  title: string;
  descriptionOne: string;
  descriptionTwo: string;
  courseThumbnailImage: string;
  demoUrl: string;
  learningOutcomesDescription: string;
  learningOutcomesPoints: string[];
  curriculum: Chapter[];
  coursePrice: number;
  hoursOfContent: number;
  modules: number;
  projects: number;
  keyHighlights: string[];
  technology?: { _id: string; name: string };
}

async function getCourse(id: string): Promise<Course | null> {
  try {
    const res = await fetch(`${BASE_API_URL}/courses/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.course;
  } catch {
    return null;
  }
}

// Next.js 15+: params is a Promise
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { id } = await params;
  const course = await getCourse(id);
  return {
    title: course
      ? `${course.title} | Big Leap Technologies`
      : "Course | Big Leap Technologies",
    description: course?.descriptionOne ?? "",
  };
}

export default async function IndividualCoursePage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { id } = await params;
  const course = await getCourse(id);

  if (!course) {
    return (
      <main style={{ padding: "4rem", textAlign: "center" }}>
        <h2>Course not found.</h2>
      </main>
    );
  }

  const thumbnailUrl = `${UPLOADS_URL}/courses/${course.courseThumbnailImage}`;

  return (
    <main>
      <CourseHero
        title={course.title}
        description={course.descriptionOne}
        category={course.technology?.name}
      />
{course.demoUrl?.trim() && (
  <CourseVideo
    demoUrl={course.demoUrl}
    thumbnailUrl={thumbnailUrl}
    title={course.title}
  />
)}
      <CourseDescription
        descriptionTwo={course.descriptionTwo}
        learningOutcomesPoints={course.learningOutcomesPoints}
      />
      <CourseLearning
        description={course.learningOutcomesDescription}
        outcomes={course.learningOutcomesPoints}
        hours={course.hoursOfContent}
        modules={course.modules}
        projects={course.projects}
      />
      <CourseCurriculum curriculum={course.curriculum} />
      <CoursePricing
        title={course.title}
        price={course.coursePrice}
        keyHighlights={course.keyHighlights}
        hours={course.hoursOfContent}
        category={course.technology?.name}
      />
      <CourseCertificate />
      {/* <CourseReviews /> */}
     <CourseGrid />
    </main>
  );
}