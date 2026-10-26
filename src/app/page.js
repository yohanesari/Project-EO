import Image from "next/image";
import {
  ArrowRight,
  Menu,
  CalendarDays,
  Phone,
  SquareArrowOutUpRightIcon,
  ArrowUpRight,
  Users,
  Heart,
  Presentation,
  Star,
} from "lucide-react";

const services = [
  {
    title: "Corporate Events",
    description: "Inspire teams. Drive growth.",
    image: "/corporate.webp",
    icon: Users,
  },
  {
    title: "Weddings",
    description: "Unforgettable celebrations.",
    image: "/weeding.jpg",
    icon: Heart,
  },
  {
    title: "Conferences & Seminars",
    description: "Ideas that inspire an impact.",
    image: "/seminar.jpeg",
    icon: Presentation,
  },
  {
    title: "Brand Activation & Product Launch",
    description: "Bring your brand to life.",
    image: "/brand.jpg",
    icon: Star,
  },
];

export default function Home() {
  return (
    <div className="w-full mx-auto">
      <section className="relative min-h-screen">
        <img
          src="/hero.jpg"
          alt="Wedding Event"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute max-w-xl mx-auto inset-0 flex flex-col items-center justify-center text-center text-white gap-5 p-4">
          <h1 className="font-heading text-4xl font-bold md:text-6xl">
            Wujudkan Momen Impian Tanpa Beban & Khawatir
          </h1>
          <p className="mt-4 text-lg">
            Dari pernikahan intim hingga acara perusahaan berskala besar, kami merancang dan mengeksekusi setiap detail acara Anda secara profesional.
          </p>
          <div className="flex gap-5 items-center justify-center">
            <div className="bg-yellow-800 p-2 rounded-md flex items-center gap-2 hover:bg-yellow-900">
              <a
                href="https://wa.me/628512334223"
                target="_blank"
                rel="noopener noreferrer"
              >
                Konsultasi Acara Gratis
              </a>
              <SquareArrowOutUpRightIcon size={18} />
            </div>
            <div className="border border-white rounded-md p-2 hover:text-yellow-800 hover:bg-white">
              <a href="#layanan">Karya Kami</a>
            </div>
          </div>
        </div>
      </section>

      <section id="layanan" className="bg-brand-sand/50 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 items-stretch gap-4 md:grid-cols-3 lg:grid-cols-5 md:gap-5 py-10 md:py-15 lg:py-20">
            <h2 className="font-heading text-4xl max-w-sm">
              Events For a Brighter Tomorrow
            </h2>
            <div className="col-span-2">
              <div className="my-6 h-px w-full bg-black/20"></div>
            </div>
            <div className="col-span-2 flex flex-col gap-5">
              <p className="font-heading text-lg leading-relaxed">
                From corporate gatherings to dream weddings, we create meaningful experiences with meticulous planning, creative design and flawless execution.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 items-stretch gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <a
                  key={service.title}
                  href="/contact"
                  className="group relative isolate flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-xl bg-neutral-950 p-4 text-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-5"
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/35 to-black/5" />
                  <div className="relative">
                    <Icon
                      size={22}
                      strokeWidth={1.5}
                      className="mb-5 text-white/90"
                    />
                    <h3 className="text-lg font-medium leading-tight sm:text-xl font-heading">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/65 sm:text-sm">
                      {service.description}
                    </p>
                    <div className="mt-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 transition duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black">
                      <ArrowUpRight size={17} strokeWidth={1.5} />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-brand-sand/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80"
                alt="Aeterna Team"
                className="rounded-2xl shadow-xl w-full h-[450px] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-lg border border-brand-border hidden sm:block max-w-xs">
                <p className="font-heading text-3xl font-bold text-brand-gold mb-1">
                  10+ Tahun
                </p>
                <p className="text-xs text-brand-muted">
                  Pengalaman menciptakan lebih dari 500+ momen bersejarah di Indonesia.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest font-semibold text-brand-gold">
                Tentang Aeterna
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl text-brand-dark font-normal leading-tight">
                Dedikasi Penuh untuk <span className="italic font-light">Keindahan & Kebahagiaan</span> Anda
              </h2>
              <p className="text-brand-muted leading-relaxed">
                Di <strong>Aeterna</strong>, kami percaya bahwa setiap acara memiliki cerita unik yang patut dirayakan dengan sempurna. Sebagai penyelenggara acara (<em>Event Organizer & Wedding Planner</em>), kami mengkombinasikan kreativitas tinggi, manajemen yang terstruktur, serta relasi vendor terbaik untuk menghadirkan pengalaman acara tanpa cela.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="border-l-2 border-brand-gold pl-4">
                  <h4 className="font-heading font-bold text-lg">Konsep Personal</h4>
                  <p className="text-xs text-brand-muted mt-1">
                    Acara dirancang khusus menyesuaikan karakter & impian Anda.
                  </p>
                </div>
                <div className="border-l-2 border-brand-gold pl-4">
                  <h4 className="font-heading font-bold text-lg">Vendor Terpercaya</h4>
                  <p className="text-xs text-brand-muted mt-1">
                    Jaringan catering, dekorasi, & entertainment profesional kelas atas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}