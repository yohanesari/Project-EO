import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin-auth";
import { getEvent } from "@/lib/checkin";
import CheckinConsole from "@/component/CheckinConsole";

export const metadata = { title: "Check-in Tamu", robots: { index: false } };

async function Console({ params }) {
  const { slug } = await params;
  const admin = await getAdmin();
  if (!admin) {
    redirect(`/admin/login?next=${encodeURIComponent(`/admin/${slug}`)}`);
  }
  const event = await getEvent(slug);
  if (!event) notFound();
  return <CheckinConsole slug={event.slug} title={event.title} adminName={admin.name} />;
}

export default function CheckinPage({ params }) {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#3f3b2b]" />}>
      <Console params={params} />
    </Suspense>
  );
}
