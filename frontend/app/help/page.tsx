"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  FileText,
  MessageCircle,
  HelpCircle,
  Plus,
  Minus,
} from "lucide-react";

const helpTopics = [
  {
    icon: FileText,
    title: "Report a Problem",
    description:
      "Learn how to submit a community problem with the required details and evidence.",
    href: "/problems#report",
  },
  {
    icon: Search,
    title: "Explore Problems",
    description:
      "Browse reported problems and discover challenges that need solutions.",
    href: "/problems",
  },
  {
    icon: MessageCircle,
    title: "Give Feedback",
    description:
      "Share your experience or feedback on problems reported by other citizens.",
  },
  {
    icon: HelpCircle,
    title: "Need More Help?",
    description:
      "If you have questions about using SamadhanX, check the information provided below.",
  },
];

const faqs = [
  {
    question: "How can I report a problem?",
    answer:
      "Go to the Report Problem section, enter the problem details, location and priority, then submit the form.",
  },
  {
    question: "Can I support a reported problem?",
    answer:
      "Yes. Open a problem from the Problems page and use the Support Problem option to show your support.",
  },
  {
    question: "Can I give feedback on a problem?",
    answer:
      "Yes. Open the problem details page and use the Give Feedback section to share your experience.",
  },
  {
    question: "What type of problems can I report?",
    answer:
      "You can report challenges related to civic issues, education, healthcare, environment, public safety and transport.",
  },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-xl text-white">
              S
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">SamadhanX</h1>
              <p className="text-xs text-slate-500">
                Ideas → Action → Impact
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="text-sm text-slate-600 hover:text-teal-600"
            >
              Home
            </Link>

            <Link
              href="/problems"
              className="text-sm text-slate-600 hover:text-teal-600"
            >
              Problems
            </Link>

            <Link
              href="/problems#report"
              className="text-sm text-slate-600 hover:text-teal-600"
            >
              Report Problem
            </Link>

            <Link
              href="/help"
              className="text-sm font-semibold text-teal-600"
            >
              Help
            </Link>

            <Link
              href="/problems#report"
              className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-medium text-teal-600">
            <HelpCircle size={17} />
            How can we help?
          </div>

          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Help & Support
          </h2>

          <p className="mt-5 whitespace-nowrap text-lg leading-8 text-slate-600">
            Find answers to common questions and learn how to use SamadhanX to report, explore and support community problems.
            </p>
        </div>

        {/* Help Topics */}
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {helpTopics.map((topic, index) => {
            const Icon = topic.icon;

            const content = (
              <>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <Icon size={22} />
                </div>

                <h3 className="mt-5 font-bold">{topic.title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {topic.description}
                </p>
              </>
            );

            if (index < 2) {
              return (
                <Link
                  key={topic.title}
                  href={topic.href!}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div
                key={topic.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                {content}
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="mb-8">
            <p className="font-semibold text-teal-600">FAQs</p>

            <h2 className="mt-2 text-3xl font-bold">
            Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
        {faqs.map((faq, index) => {
            const isOpen = openFaq === index;

            return (
            <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
            >
                <button
                type="button"
                onClick={() => setOpenFaq(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                <span className="font-semibold text-slate-900">
                    {faq.question}
                </span>

                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600">
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </span>
                </button>

                {isOpen && (
                <div className="border-t border-slate-200 bg-white px-6 py-5">
                    <p className="text-sm leading-6 text-slate-600">
                    {faq.answer}
                    </p>
                </div>
                )}
            </div>
            );
        })}
        </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-14">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl bg-teal-600 px-8 py-10 text-white md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold">
              Ready to make a difference?
            </h2>

            <p className="mt-2 text-teal-100">
              Report a problem from your community and help start the journey
              from ideas to action.
            </p>
          </div>

          <Link
            href="/problems#report"
            className="flex items-center gap-2 whitespace-nowrap rounded-xl bg-white px-6 py-3 font-semibold text-teal-600 hover:bg-teal-50"
          >
            Report a Problem
          </Link>
        </div>
      </section>

      {/* Footer */}
        <footer className="border-t border-slate-800 bg-slate-950 px-6 py-8 text-white">
          <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">

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

            <div className="text-center text-sm text-slate-400 md:absolute md:left-1/2 md:-translate-x-1/2">
              <p>© 2026 SamadhanX. Building solutions that matter.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-5 text-sm text-slate-300">
              <Link href="/" className="hover:text-white">
                Home
              </Link>

              <Link href="/problems" className="hover:text-white">
                Problems
              </Link>
            </div>

          </div>
        </footer>
    </main>
  );
}