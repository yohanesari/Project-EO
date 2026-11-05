import { notFound } from "next/navigation";
import Weeding from "@/component/weeding";
import { getEventInfo } from "@/lib/event-info";
import { slugify } from "@/lib/slug";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const info = getEventInfo(slug);
  return {
    title: info ? `Undangan ${info.groom} & ${info.bride}` : "Undangan Pernikahan",
  };
}

export default async function WeedingPage({ params }) {
  const { slug } = await params;

  const info = getEventInfo(slug);
  if (!info) notFound();

  // slug di URL harus cocok dengan data undangan
  const expected = info.slug || slugify(`${info.groom}-and-${info.bride}`, 80);
  if (slug !== expected) notFound();

  return <Weeding data={{ ...info, slug: expected }} />;
}