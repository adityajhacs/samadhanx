"use client";
import { Check, ThumbsUp } from "lucide-react";
import { useState } from "react";

export default function ProblemActions({
  supporters,
}: {
  supporters: number;
}) {
  const [supported, setSupported] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const currentSupporters = supporters + (supported ? 1 : 0);

  const handleFeedback = (e: React.FormEvent) => {
    e.preventDefault();

    if (feedback.trim()) {
      setSubmitted(true);
      setFeedback("");
    }
  };

  return (
    <>
      {/* Support */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-bold">
          Support This Problem
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Show your support to help bring attention to this issue.
        </p>

        <button
          onClick={() => setSupported(!supported)}
          className={`mt-5 w-full rounded-xl px-5 py-3 font-semibold transition ${
            supported
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-teal-600 text-white hover:bg-teal-700"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            {supported ? <Check size={17} /> : <ThumbsUp size={17} />}
            {supported ? "Supported" : "Support Problem"}
        </span>
        </button>

        <p className="mt-3 text-center text-sm text-slate-500">
          {currentSupporters} citizens support this problem
        </p>
      </div>

      {/* Feedback */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-bold">
          Give Feedback
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Have you experienced this problem? Share your feedback.
        </p>

        <button
          onClick={() => {
            setFeedbackOpen(!feedbackOpen);
            setSubmitted(false);
          }}
          className="mt-5 w-full rounded-xl border border-teal-600 px-5 py-3 font-semibold text-teal-600 transition hover:bg-teal-50"
        >
          {feedbackOpen ? "Close Feedback" : "Share Feedback"}
        </button>

        {feedbackOpen && (
          <form onSubmit={handleFeedback} className="mt-5">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write your feedback here..."
              rows={4}
              required
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />

            <button
              type="submit"
              className="mt-3 w-full rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white hover:bg-teal-700"
            >
              Submit Feedback
            </button>

            {submitted && (
              <p className="mt-3 text-center text-sm font-medium text-emerald-600">
                ✓ Feedback submitted successfully!
              </p>
            )}
          </form>
        )}
      </div>
    </>
  );
}