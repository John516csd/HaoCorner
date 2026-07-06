import { notFound } from "next/navigation";
import { ContentManager } from "./ContentManager";

export const dynamic = "force-dynamic";

export default function AdminContentPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ContentManager />;
}
