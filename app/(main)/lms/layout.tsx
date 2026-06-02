
export const dynamic = "force-dynamic";
import LMSLayout from "../../components/lms/LMSLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LMSLayout>{children}</LMSLayout>;
}