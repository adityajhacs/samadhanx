"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Construction,
  GraduationCap,
  Hospital,
  Leaf,
  ShieldCheck,
  Bus,
} from "lucide-react";

const categories = [
  { name: "Road Infrastructure", icon: Construction, count: "1,240+" },
  { name: "Education", icon: GraduationCap, count: "680+" },
  { name: "Healthcare", icon: Hospital, count: "520+" },
  { name: "Environment", icon: Leaf, count: "410+" },
  { name: "Public Safety", icon: ShieldCheck, count: "290+" },
  { name: "Transport", icon: Bus, count: "185+" },
];

const stats = [
  { value: "2,850+", label: "Problems Reported" },
  { value: "1,240+", label: "Solutions Built" },
  { value: "86", label: "Districts Covered" },
  { value: "94%", label: "Impact Success" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-xl text-white">
              S
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">SamadhanX</h1>
              <p className="text-xs text-slate-500">Ideas → Action → Impact</p>
            </div>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#" className="text-sm font-medium text-teal-600">
              Home
            </a>

            <a
              href="/problems"
              className="text-sm font-medium text-slate-600 hover:text-teal-600"
            >
              Problems
            </a>

            <a
              href="/problems#report"
              className="text-sm font-medium text-slate-600 hover:text-teal-600"
            >
              Report Problem
            </a>

            <a
              href="/help"
              className="text-sm font-medium text-slate-600 hover:text-teal-600"
            >
              Help
            </a>

            <button className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700">
              Get Started
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-slate-200 px-3 py-2 md:hidden"
          >
            ☰
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
            <div className="flex flex-col gap-4">
            <a href="#">Home</a>
            <a href="/problems">Problems</a>
            <a href="/problems#report">Report Problem</a>
            <a href="#help">Help</a>
              <button className="rounded-xl bg-teal-600 px-4 py-2 text-white">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-4 lg:grid-cols-2 lg:py-8">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700">
              ✨ Turning real problems into real solutions
            </div>

            <h2 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              Your Problem.
              <br />
              <span className="text-teal-600">Our Innovation.</span>
              <br />
              Real Impact.
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              SamadhanX connects citizens, government, universities and
              industry to identify real-world problems and build meaningful
              solutions together.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/problems#report"
                className="rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-teal-700"
              >
                Report a Problem →
              </Link>

              <button className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 hover:bg-slate-50">
                Explore Solutions
              </button>
            </div>

            <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
              <div className="flex -space-x-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-teal-200">
                  👩
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-green-200">
                  👨
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-orange-200">
                  👩
                </div>
              </div>
              <span>Citizens and innovators building a better tomorrow</span>
            </div>
          </div>

          {/* Hero Card */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-teal-100/60 blur-3xl" />

            <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Community Overview
                  </p>
                  <h3 className="mt-1 text-2xl font-bold">Live Impact</h3>
                </div>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                  ● Active
                </span>
              </div>

              <div className="rounded-2xl bg-slate-900 p-6 text-white">
                <p className="text-sm text-slate-400">Solutions deployed</p>
                <p className="mt-2 text-4xl font-bold">1,240+</p>

                <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-700">
                  <div className="h-full w-[78%] rounded-full bg-teal-500" />
                </div>

                <div className="mt-3 flex justify-between text-xs text-slate-400">
                  <span>Community problems</span>
                  <span>78% resolved</span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-teal-50 p-5">
                  <p className="text-sm text-slate-500">Active Projects</p>
                  <p className="mt-1 text-2xl font-bold text-teal-700">328</p>
                </div>

                <div className="rounded-2xl bg-green-50 p-5">
                  <p className="text-sm text-slate-500">Citizens</p>
                  <p className="mt-1 text-2xl font-bold text-green-700">12K+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="problems" className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-semibold text-teal-600">EXPLORE PROBLEMS</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              What needs a Samadhan?
            </h2>
            <p className="mt-3 max-w-3xl text-slate-600">
              Discover challenges reported by communities and find
              opportunities to create meaningful solutions.
            </p>
          </div>

          <a href="/problems" className="text-sm font-semibold text-teal-600">
            View all problems →
          </a>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg"
            >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-teal-600 group-hover:bg-teal-50">
            <category.icon size={22} />
          </div>

              <h3 className="mt-5 font-bold">{category.name}</h3>
              <p className="mt-2 text-sm text-slate-500">
                {category.count} reported challenges
              </p>

              <Link
                href="/problems"
                className="mt-5 inline-block text-sm font-semibold text-teal-600 hover:text-teal-700"
              >
                Explore →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="solutions" className="px-6 pb-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-teal-600 px-8 py-14 text-white md:px-14">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-teal-200">
                Have an idea?
              </p>

              <h2 className="mt-2 max-w-2xl text-3xl font-bold">
                One problem can become the beginning of a powerful solution.
              </h2>

              <p className="mt-3 max-w-xl text-teal-100">
                Share a problem from your community and let innovators,
                students and organizations help solve it.
              </p>
            </div>

            <button className="shrink-0 rounded-xl bg-white px-6 py-3.5 font-bold text-teal-600 shadow-lg hover:bg-teal-50">
              Submit a Problem
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">

          {/* Logo & Tagline */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold">
                S
              </div>

              <div>
                <p className="font-semibold">SamadhanX</p>
                <p className="text-sm text-slate-400">
                  Ideas → Action → Impact
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-slate-400">
            © 2026 SamadhanX. All rights reserved.
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap gap-5 text-sm text-slate-300">
            <a href="#" className="hover:text-white">
              About
            </a>

            <a href="#" className="hover:text-white">
              Contact
            </a>

            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>

            <a href="#" className="hover:text-white">
              Terms of Service
            </a>
          </div>

        </div>
      </footer>
    </main>
  );
}