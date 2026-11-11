
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { services } from "../services";

export function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    return { title: "Service Not Found | Aeterna" };
  }

  return {
    title: `${service.title} | Aeterna`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="bg-[#faf8f3] text-neutral-900">
      {/* HERO */}
      <section className="relative flex min-h-[580px] items-center overflow-hidden md:min-h-[680px]">
        <img
          src={service.image}
          alt={service.title}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-24 text-white md:px-12 lg:px-20">
          <Link
            href="/services"
            className="mb-12 inline-flex items-center gap-2 text-sm text-white/80 transition hover:text-white"
          >
            <ArrowRight className="rotate-180" size={16} />
            All Services
          </Link>

          <p className="mb-5 text-xs tracking-[0.3em] text-[#d6bc8b] md:text-sm">
            {service.eyebrow}
          </p>

          <h1 className="max-w-4xl font-heading text-5xl leading-[1.05] md:text-7xl">
            {service.headline}
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/80 md:text-base">
            {service.description}
          </p>

          <a
            href="https://wa.me/628512334223"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-3 bg-[#a48a5a] px-6 py-3 text-sm text-white transition hover:bg-[#806b46]"
          >
            Discuss Your Event
            <ArrowUpRight size={18} />
          </a>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-20 md:grid-cols-2 md:gap-16 md:px-12 md:py-28 lg:px-20">
        <div>
          <p className="mb-4 text-xs tracking-[0.25em] text-[#a48a5a]">
            THE EXPERIENCE
          </p>

          <h2 className="font-heading text-4xl leading-tight md:text-5xl">
            {service.introTitle}
          </h2>
        </div>

        <div className="flex items-center">
          <p className="text-sm leading-8 text-neutral-600 md:text-base">
            {service.intro}
          </p>
        </div>
      </section>

      {/* SERVICES INCLUDED */}
      <section className="bg-white px-6 py-20 md:px-12 md:py-28 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-4 text-xs tracking-[0.25em] text-[#a48a5a]">
              WHAT WE OFFER
            </p>

            <h2 className="font-heading text-4xl md:text-5xl">
              Every Detail, Considered.
            </h2>

            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Flexible services tailored to your event, priorities, and needs.
            </p>
          </div>

          <div className="grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">
            {service.offerings.map((offering, index) => (
              <article
                key={offering.title}
                className="border-t border-neutral-200 py-7"
              >
                <p className="mb-5 text-sm text-[#a48a5a]">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <h3 className="font-heading text-2xl">
                  {offering.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-neutral-600">
                  {offering.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* OUR PROCESS */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28 lg:px-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="mb-4 text-xs tracking-[0.25em] text-[#a48a5a]">
              HOW WE WORK
            </p>

            <h2 className="font-heading text-4xl leading-tight md:text-5xl">
              From First Conversation to Final Detail.
            </h2>

            <p className="mt-5 text-sm leading-7 text-neutral-600">
              A clear and collaborative process helps us keep your event
              aligned with your vision.
            </p>
          </div>

          <div>
            {service.process.map((step, index) => (
              <div
                key={step}
                className="flex gap-5 border-b border-neutral-200 py-5"
              >
                <span className="font-heading text-2xl text-[#a48a5a]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="flex flex-1 items-center justify-between gap-4">
                  <h3 className="text-sm font-medium md:text-base">
                    {step}
                  </h3>
                  <Check size={18} className="shrink-0 text-[#a48a5a]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO PLACEHOLDER */}
      <section className="bg-[#eee8dd] px-6 py-20 md:px-12 md:py-24 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs tracking-[0.25em] text-[#a48a5a]">
            SELECTED PROJECTS
          </p>

          <h2 className="font-heading text-4xl md:text-5xl">
            Moments Made Meaningful.
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-600">
            Explore selected events that showcase our approach to planning
            and creating experiences.
          </p>

          <div className="mt-8 border border-dashed border-neutral-400 p-8 text-sm leading-7 text-neutral-600">
            Tambahkan galeri portofolio untuk kategori {service.title} di sini.
            Gunakan dokumentasi acara yang benar-benar pernah dikerjakan.
            Jika belum ada, bagian ini bisa disembunyikan sementara atau diisi
            proyek konsep yang diberi label dengan jelas.
          </div>

          <Link
            href="/portfolio"
            className="mt-6 inline-flex items-center gap-2 text-sm text-[#806b46] hover:gap-3"
          >
            Explore All Projects
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-950 px-6 py-20 text-center text-white md:py-28">
        <p className="mb-4 text-xs tracking-[0.25em] text-[#d6bc8b]">
          LET&apos;S CREATE SOMETHING MEANINGFUL
        </p>

        <h2 className="mx-auto max-w-3xl font-heading text-4xl md:text-6xl">
          Let&apos;s Talk About Your Next Event.
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/65">
          Tell us about your ideas, goals, and plans. We&apos;d love to hear
          what you have in mind.
        </p>

        <a
          href="https://wa.me/628512334223"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-3 bg-[#a48a5a] px-6 py-3 text-sm transition hover:bg-[#806b46]"
        >
          Start a Conversation
          <ArrowUpRight size={18} />
        </a>
      </section>
    </main>
  );
}
