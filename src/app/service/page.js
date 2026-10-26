"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
  Sparkles, Music
} from "lucide-react";

const services_list = [
  {
    slug: "corporate-events",
    title: "Corporate Events",
    description: "Inspire teams. Drive growth.",
    image: "/corporate.webp",
    icon: Users,
  },
  {
    slug: "weddings",
    title: "Weddings",
    description: "Unforgettable celebrations.",
    image: "/weeding.jpg",
    icon: Heart,
  },
  {
    slug: "conferences-seminars",
    title: "Conferences & Seminars",
    description: "Ideas that inspire an impact.",
    image: "/seminar.jpeg",
    icon: Presentation,
  },
  {
    slug: "brand-activation",
    title: "Brand Activation & Product Launch",
    description: "Bring your brand to life.",
    image: "/brand.jpg",
    icon: Star,
  },
  {
    slug: "private-social-events",
    title: "Private & Social Events",
    description: "Intimate moments. Cherished memories.",
    image: "/private.jpg",
    icon: Sparkles,
  },
  {
    slug: "concerts-festivals",
    title: "Concerts & Festivals",
    description: "Unforgettable crowd experiences.",
    image: "/festival.jpg",
    icon: Music,
  },
];

const choose_us = [
  {
    title: "Experienced Team",
    description: "Tim profesional dengan pengalaman bertahun tahun.",
    icon: Users,
  },
  {
    title: "Creative Concepts",
    description: "Konsep segar dan inovatif sesuai dengan karakter anda.",
    icon: Users,
  },
  {
    title: "Trusted Network",
    description: "Didukung vendor terbaik di berbagai bidang.",
    icon: Users,
  },
  {
    title: "Seamless Excecution",
    description: "Setiap detail terkelola dengan sempurna.",
    icon: Users,
  },
];

const clients = [
  { name: "Samsung", logo: "/clients/samsung.webp" },
  { name: "BCA", logo: "/clients/bca.jpg" },
  { name: "Pertamina", logo: "/clients/pertamina.webp" },
  { name: "Bank Indonesia", logo: "/clients/BI.png" },
  { name: "Telkomsel", logo: "/clients/telkomsel.png" },
  { name: "Grab", logo: "/clients/grab.svg" },
  { name: "Perhutani", logo: "/clients/perhutani.png" },
  { name: "Indomaret", logo: "/clients/indomaret.png" },
];

const VISIBLE = 6;      // jumlah logo yang tampil sekaligus
const INTERVAL = 2000;  // geser tiap 2 detik
const DURATION = 500; 

export default function Service() {
    const [index, setIndex] = useState(0);
    const [animate, setAnimate] = useState(true);
    const [paused, setPaused] = useState(false);

    const total = clients.length;
    // duplikasi beberapa logo di akhir supaya loop terlihat mulus
    const items = [...clients, ...clients.slice(0, VISIBLE)];

    // auto geser
    useEffect(() => {
        if (paused) return;
        const timer = setInterval(() => setIndex((i) => i + 1), INTERVAL);
        return () => clearInterval(timer);
    }, [paused]);

    // setelah sampai ujung, lompat balik ke 0 tanpa animasi
    useEffect(() => {
        if (index !== total) return;
        const t = setTimeout(() => {
        setAnimate(false);
        setIndex(0);
        }, DURATION);
        return () => clearTimeout(t);
    }, [index, total]);

    // nyalakan animasi lagi setelah reset
    useEffect(() => {
        if (animate) return;
        const t = setTimeout(() => setAnimate(true), 50);
        return () => clearTimeout(t);
    }, [animate]);

    return(
        <>
        <div className="w-full mx-auto">
            <section className="relative h-[65vh] min-h-[480px] max-h-[650px] md:h-[75vh] md:min-h-[550px] md:max-h-[750px] lg:h-screen lg:max-h-none">
                <img src="/hero_service.jpg" alt="Wedding Event" className="absolute inset-0 h-full w-full object-cover"/>

                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute font-heading max-w-3xl inset-0 flex flex-col items-start justify-center text-white gap-5 px-8 md:px-16 lg:px-24">
                    <p className="mt-4 text-lg">WHAT WE DO</p>
                    <h1 className="text-4xl font-bold md:text-6xl">
                        Every Occasion, Thoughtfully Created.
                    </h1>
                    <p className="mt-4 text-lg">
                        We offer a comprehensive range of event planning and production service, tailored to your vision. 
                        From intimate gatherings to large scale production, we bring your ideas to live with creativity, precision, and a passion for excellent.
                    </p>
                </div>
            </section>

            <section className="w-full min-h-screen my-15">
                <div className="flex items-center justify-between gap-50 px-8 md:px-16 lg:px-24 mb-15">
                    <div className="font-heading flex flex-col gap-3">
                        <p className="text-lg">OUR EXPERTISE</p>
                        <h2 className="text-3xl">Tailored Experiences for Every Occasion.</h2>
                    </div>
                    <div className="max-w-2xl">
                        <p className="text-md">Kami menghadirkan solusi acara yang sesuai dengan kebutuhan dan tujuan anda. Setiap layanan kami dirancang untuk memberikan pengalaman yang berkesan, dengan dukungan tim profesional dan jaringan vendor terbaik</p>
                    </div>
                </div>
                
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-stretch gap-2 md:grid-cols-2 lg:grid-cols-3 md:gap-5">
                        {services_list.map((service) => {
                            const Icon = service.icon;
                
                        return (
                        <Link key={service.slug} href={`/services/${service.slug}`}
                                className="group relative isolate flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-xl bg-neutral-950 p-4 text-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-5">
                            <img src={service.image} alt={service.title}
                                className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-105"/>
                                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/35 to-black/5" />
                                <div className="relative">
                                <Icon size={22} strokeWidth={1.5} className="mb-5 text-white/90"/>
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
                            </Link>
                          );
                        })}
                    </div>
                </div>
            </section>

            <section className="w-full px-8 pb-12 md:px-16 lg:px-24">
                {/* Header */}
                <div className="mb-10 flex items-end justify-between">
                    <div>
                        <p className="mb-3 text-md font-medium uppercase tracking-[0.25em] text-[#a48a5a]">
                            Our Portfolio &amp; Clients
                        </p>
                        <h2 className="font-heading text-3xl text-neutral-900 md:text-4xl">
                            Trusted by Leading Brands &amp; Individuals
                        </h2>
                    </div>

                    <Link href="/portfolio" className="flex items-center gap-2 text-sm font-medium text-[#a48a5a] transition hover:gap-3">
                        View All Portfolio <ArrowRight size={16} />
                    </Link>
                </div>

                {/* Carousel */}
                <div
                    className="overflow-hidden"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    <div className="flex ease-in-out"
                        style={{
                            transform: `translateX(-${index * (100 / VISIBLE)}%)`,
                            transition: animate ? `transform ${DURATION}ms ease-in-out` : "none",
                        }}
                    >
                    {items.map((client, i) => (
                        <div key={`${client.name}-${i}`} className="flex h-16 flex-none items-center justify-center px-6" style={{ width: `${100 / VISIBLE}%` }}>
                        <img src={client.logo} alt={client.name}
                            className="max-h-10 w-full max-w-[120px] object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                        />
                        </div>
                    ))}
                    </div>
                </div>
            </section>

            <section className="w-full min-h-screen my-15">
                <div className="grid grid-cols-3">    
                    <img className="inset-0 w-full h-full object-cover" src="/service_choose.jpg"/>
                    <div className="col-span-2 px-8 md:px-16 lg:px-24 py-16">
                        <h3 className="font-medium text-md text-[#a48a5a] uppercase">Why Choose Us</h3>
                        <h1 className="font-heading text-3xl my-6">Your Vision, Our Expertise.</h1>
                        <p className="text-md mb-12">Kami bukan hanya penyelenggara acara, tapi partner yang siap mendengarkan, memahami, dan mewujudkan setiap detail impian anda</p>
                        <div className="grid grid-cols-4 gap-5">
                            {choose_us.map((choose) => {
                                const Icon = choose.icon;
                    
                            return (
                                <a key={choose.title} href="/contact" className="group relative isolate flex aspect-full flex-col overflow-hidden rounded-xl bg-neutral-950 p-4 text-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-5">
                                    
                                    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/35 to-black/5" />
                                    <div className="relative flex h-full flex-1 flex-col">
                                        <Icon size={22} strokeWidth={1.5} className="mb-5 text-white/90"/>
                                        <h3 className="min-h-[2.5em] text-lg font-medium leading-tight sm:text-xl font-heading">
                                            {choose.title}
                                        </h3>
                                        <p className="mt-2 text-xs leading-relaxed text-white/65 sm:text-sm">
                                            {choose.description}
                                        </p>
                                        <div className="mt-auto pt-5">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 transition duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black">
                                                <ArrowUpRight size={17} strokeWidth={1.5} />
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative w-full min-h-64">
                <img src="/hero_bottom.jpg" alt="Reservasi" className="absolute inset-0 h-full w-full object-cover"/>

                <div className="absolute inset-0 bg-black/70" />

                <div className="absolute max-w-xl mx-auto inset-0 flex flex-col items-center justify-center text-center text-white gap-5 p-4">
                    <p className="mb-3 text-md font-medium uppercase tracking-[0.25em] text-[#a48a5a]">
                        Lets Plan Your Next Event
                    </p>
                    <h2 className="font-heading text-3xl md:text-4xl">
                        Ready To Create Something Extraordinary ?
                    </h2>
                    <div className="bg-[#a48a5a] p-2 rounded-md flex items-center gap-2 hover:bg-[#7a6643]">
                        <a href="https://wa.me/628512334223" target="_blank" rel="noopener noreferrer">
                            Konsultasi Sekarang
                        </a>
                        <SquareArrowOutUpRightIcon size={18} />
                    </div>
                </div>
            </section>
        </div>
        </>
    )
}