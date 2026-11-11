import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin-auth";
import { listEvents } from "@/lib/checkin";

export const metadata = { title: "Admin", robots: { index: false } };

async function Events() {
  if (!(await getAdmin())) redirect("/admin/login");
  const events = await listEvents();
  return (
    <main className="min-h-screen bg-[#3f3b2b] px-6 py-12 text-[#f3e9d9]">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-light">Pilih acara</h1>
        <ul className="mt-6 space-y-3">
          {events.map((e) => (
            <li key={e.slug}>
              <Link
                href={`/admin/${e.slug}`}
                className="block border border-[#f3e9d9]/40 px-5 py-4 transition hover:bg-[#f3e9d9] hover:text-[#3f3b2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f3e9d9]"
              >
                <span className="block text-lg">{e.title}</span>
                <span className="block text-sm font-light opacity-70">Buka check-in</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default function AdminHome() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#3f3b2b]" />}>
      <Events />
    </Suspense>
  );
}
