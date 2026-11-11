import { Suspense } from "react";
import { notFound } from "next/navigation";
import Weeding from "@/component/weeding";
import { getEventInfo } from "@/lib/event-info";
import { slugify } from "@/lib/slug";

export const metadata = { title: "Undangan Pernikahan" };

async function Invitation({ params }) {
  const { slug } = await params;

  const info = getEventInfo(slug);
  if (!info) notFound();

  // slug di URL harus cocok dengan data undangan
  const expected = info.slug || slugify(`${info.groom}-and-${info.bride}`, 80);
  if (slug !== expected) notFound();

  return <Weeding data={{ ...info, slug: expected }} />;
}

export default function WeedingPage({ params }) {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#3f3b2b]" />}>
      <Invitation params={params} />
    </Suspense>
  );
}
