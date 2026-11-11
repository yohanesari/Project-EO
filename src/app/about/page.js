/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
  ShieldCheck,
  Users,
  Clock,
  Award,
  Lightbulb,
  Handshake,
} from "lucide-react";

const philosophy = [
  { title: "Passion", description: "Every detail is carefully planned, so you can focus on what matters.", icon: Heart },
  { title: "Creativity", description: "We tailor each event to reflect your unique story and vision.", icon: Sparkles },
  { title: "Integrity", description: "The little things create the biggest memories.", icon: ShieldCheck },
  { title: "Collaboration", description: "From start to finish, we handle it all with professional care.", icon: Handshake },
];

const choose_us = [
  { title: "Experienced Team", description: "A professional team with years of experience in the industry.", icon: Users },
  { title: "On-Time Delivery", description: "Fresh and innovative ideas that match your character.", icon: Clock },
  { title: "Quality Results", description: "Access to the best vendors across various fields.", icon: Award },
  { title: "Creative Concepts", description: "Every detail is managed with perfection.", icon: Lightbulb },
];

const teamImages = [
  "/component/about/crew-1.jpg",
  "/component/about/crew-2.jpg",
  "/component/about/crew-3.jpg",
  "/component/about/crew-4.jpg",
];

export default function About() {
    const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () =>
    setCurrentImage((prev) => (prev + 1) % teamImages.length);

  const prevImage = () =>
    setCurrentImage((prev) => (prev - 1 + teamImages.length) % teamImages.length);
  return (
    <div className="w-full mx-auto">
      <section className="relative h-[65vh] min-h-[480px] max-h-[650px] overflow-hidden md:h-[75vh] md:min-h-[550px] md:max-h-[750px] lg:h-screen lg:max-h-none">

        {/* Background Image */}
        <img
          src="/component/hero_about.jpeg"
          alt="Aeterna Event Organizer"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-transparent" />

        {/* Text Content */}
        <div className="relative z-10 flex h-full max-w-3xl flex-col justify-center px-6 text-white md:px-16 lg:px-24">

          <h3 className="mb-3 text-lg font-medium md:text-2xl">
            About Us
          </h3>

          <h1 className="font-heading text-4xl leading-tight md:text-6xl">
            Creating Moments
            <br />
            That Last Forever.
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-7 text-white/80 md:text-base">
            Aeterna is an event organizer dedicated to creating
            meaningful experiences through thoughtful planning,
            creativity, and attention to detail.
          </p>

        </div>
      </section>

        <section className="min-h-lg max-h-[250vh] w-full">
            <div className="max-w-7xl mx-auto my-10">
                <div className="grid grid-cols-2 gap-20 items-center">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-5 mb-5">
                            <span className="font-heading text-[#a48a5a] text-lg md:text-xl">01</span>
                            <div className="w-10 border-t border-[#a48a5a]"></div>
                        </div>
                        <h1 className="font-heading text-xl md:text-3xl">Our Story</h1>
                        <h3 className="text-[#a48a5a] text-lg md:text-xl">MORE THAN JUST AN EVENT</h3>
                        <p className="text-sm md:text-base">Aeterna was born from a simple belief — that every celebration deserves to be extraordinary. What started as a passion for beautiful details and meaningful connections has grown into a trusted event organizer, helping individuals and brands create unforgettable moments across Indonesia.
                            We've had the privilege of planning a wide range of events, from intimate weddings to large-scale corporate gatherings. Each project is a new story, and we're honored to be part of yours.
                            Your vision is our inspiration.</p>
                    </div>
                    <div className="flex items-center justify-center gap-5">
                        <div className="w-full h-[55vh]">
                            <img src="/component/about/our_story.jpg" className="w-full h-full object-cover"/>
                        </div>
                        <div className="border-l border-[#A8A095] min-h-[35vh]"></div>
                        <p className="text-sm md:text-base text-[#a48a5a] font-heading">Your Vision is Our Inspiration</p>
                    </div>
                </div>
            </div>
        </section>

        <section className="min-h-lg max-h-[250vh] w-full">
            <div className="grid grid-cols-3 items-center">    
                <div className="w-full h-[60vh]">
                    <img className="inset-0 w-full h-full" src="/component/about/filosofi.jpg"/>
                </div>
                <div className="col-span-2 px-4 md:px-12 lg:px-18 ">
                    <div className="flex flex-col gap-2 mb-8">
                        <div className="flex items-center gap-5 mb-5">
                            <span className="font-heading text-[#a48a5a] text-lg md:text-xl">02</span>
                            <div className="w-10 border-t border-[#a48a5a]"></div>
                        </div>
                        <h1 className="font-heading text-xl md:text-3xl">Our Philosophy</h1>
                        <h3 className="text-[#a48a5a] text-lg md:text-xl">THE VALUE THAT GUIDE US</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-5">
                        {philosophy.map((philosophy) => {
                            const Icon = philosophy.icon;
                        
                        return (
                            <a key={philosophy.title} href="/contact" className="group relative isolate flex aspect-full flex-col overflow-hidden rounded-xl bg-neutral-950 p-4 text-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-5">
                                    
                                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/35 to-black/5" />
                                <div className="relative flex h-full flex-1 flex-col">
                                    <Icon size={22} strokeWidth={1.5} className="mb-5 text-white/90"/>
                                    <h3 className="min-h-[2.5em] text-lg font-medium leading-tight sm:text-xl font-heading">
                                        {philosophy.title}
                                    </h3>
                                    <p className="mt-2 text-xs leading-relaxed text-white/65 sm:text-sm">
                                        {philosophy.description}
                                    </p>
                                </div>
                            </a>
                        );
                        })}
                    </div>
                </div>
            </div>
        </section>

        <section className="min-h-lg max-h-[250vh] w-full">
            <div className="grid grid-cols-4 gap-12 max-w-7xl mx-auto items-center my-16">
                <div className="col-span-2">
                    <div className="flex flex-col gap-2 mb-8">
                        <div className="flex items-center gap-5 mb-5">
                            <span className="font-heading text-[#a48a5a] text-lg md:text-xl">03</span>
                            <div className="w-10 border-t border-[#a48a5a]"></div>
                        </div>
                        <h1 className="font-heading text-xl md:text-3xl">Why Choose Us</h1>
                        <h3 className="text-[#a48a5a] text-lg md:text-xl">THE AETERNA DIFFERENCE</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        {choose_us.map((choose) => {
                            const Icon = choose.icon;
                        
                        return (
                            <div key={choose.title} className="group relative isolate flex aspect-full flex-col overflow-hidden rounded-xl p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-5">
                                    
                                <div className="absolute inset-0 -z-10" />
                                <div className="flex gap-5">
                                    <Icon size={22} strokeWidth={1.5} className="mb-5"/>
                                    <div className="relative flex h-full flex-1 flex-col gap-2">
                                        <h3 className="text-lg font-medium leading-tight sm:text-xl font-heading">
                                            {choose.title}
                                        </h3>
                                        <p className="mt-2 text-xs leading-relaxed sm:text-sm">
                                            {choose.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                        })}
                    </div>
                </div>
                <div className="col-span-2 w-full h-[65vh]">
                    <img className="inset-0 w-full h-full" src="/component/about/choose.jpg"/>
                    {/* <video className="w-full h-full object-cover" src="/component/about/vid_choose.mp4" autoPlay muted loop playsInline/> */}
                </div>
            </div>
        </section>

        <section className="min-h-lg max-h-[250vh] w-full">
            <div className="grid grid-cols-5 gap-12 max-w-7xl mx-auto items-center my-16">
                <div className="relative col-span-2 h-[65vh] w-full">

                    {/* Stacked Images */}
                    {teamImages.map((image, index) => {
                        const offset =
                            (index - currentImage + teamImages.length) % teamImages.length;

                        if (offset > 2) return null;

                        return (
                            <div
                                key={image}
                                className="absolute inset-0 overflow-hidden rounded-xl shadow-xl transition-all duration-500"
                                style={{
                                    zIndex: 3 - offset,
                                    transform: `translate(${offset * 14}px, ${offset * -14}px) scale(${1 - offset * 0.035})`,
                                    opacity: 1 - offset * 0.12,
                                }}
                            >
                                <img
                                    src={image}
                                    alt={`Aeterna Team ${index + 1}`}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        );
                    })}

                    {/* Navigation Buttons */}
                    <div className="absolute bottom-5 left-5 z-20 flex gap-3">

                        <button
                            onClick={prevImage}
                            aria-label="Previous image"
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-md transition hover:bg-[#a48a5a] hover:text-white"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <button
                            onClick={nextImage}
                            aria-label="Next image"
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-md transition hover:bg-[#a48a5a] hover:text-white"
                        >
                            <ChevronRight size={20} />
                        </button>

                    </div>

                    {/* Image Counter */}
                    <div className="absolute bottom-8 right-5 z-20 rounded-full bg-black/50 px-4 py-2 text-xs text-white backdrop-blur-sm">
                        {currentImage + 1} / {teamImages.length}
                    </div>

                </div>

                <div className="col-span-3">
                    <div className="flex flex-col gap-2 mb-8">
                        <div className="flex items-center gap-5 mb-5">
                            <span className="font-heading text-[#a48a5a] text-lg md:text-xl">03</span>
                            <div className="w-10 border-t border-[#a48a5a]"></div>
                        </div>
                        <h1 className="font-heading text-xl md:text-3xl">The People Behind the Moments</h1>
                        <h3 className="text-[#a48a5a] text-lg md:text-xl">A PASSIONATE TEAM</h3>
                        <p className="tex-sm md:text-base">Aeterna is built by a team of dreamers, planners, and problem solvers. We work together to ensure every event runs smoothly and reflects your unique vision.</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
  );
}
