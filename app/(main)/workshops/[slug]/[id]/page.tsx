// app/(main)/workshops/[slug]/[id]/page.tsx

export const dynamic = "force-dynamic";
import WorkshopHero from "../../../../components/workshop/WorkshopHero";
import WorkshopWhyJoin from "../../../../components/workshop/WorkshopWhyJoin";
import { BASE_API_URL } from "../../../../utils/api";

interface Workshop {
  _id: string;
  workshopHeading: string;
  date: string;
  time: string;
  platform: string;
  whatYouWillLearn: string[];
  createdAt: string;
  updatedAt: string;
}

async function getWorkshop(id: string): Promise<Workshop | null> {
  try {
    const res = await fetch(`${BASE_API_URL}/workshops/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.workshop;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { id } = await params;
  const workshop = await getWorkshop(id);
  return {
    title: workshop
      ? `${workshop.workshopHeading} | Big Leap Technologies`
      : "Workshop | Big Leap Technologies",
    description: workshop?.whatYouWillLearn?.join(", ") ?? "",
  };
}

export default async function IndividualWorkshopPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { id } = await params;
  const workshop = await getWorkshop(id);

  if (!workshop) {
    return (
      <main style={{ padding: "4rem", textAlign: "center" }}>
        <h2>Workshop not found.</h2>
      </main>
    );
  }

  return (
    <main>
      <WorkshopHero workshop={workshop} />
      <WorkshopWhyJoin />
    </main>
  );
}