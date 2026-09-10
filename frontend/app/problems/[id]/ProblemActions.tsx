"use client";

import { Check, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getSupportCount,
  supportProblem,
  submitFeedback,
} from "@/lib/api/engagement";

export default function ProblemActions({
  problemId,
  supporters,
}: {
  problemId: string;
  supporters: number;
}) {
  const [supported, setSupported] = useState(false);
  const [supportCount, setSupportCount] = useState(supporters);
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportError, setSupportError] = useState("");

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  useEffect(() => {
    async function loadSupportCount() {
      try {
        const response = await getSupportCount(problemId);
        setSupportCount(response.supporters);
        setSupported(response.supported);
      } catch (error) {
        console.error("Failed to load support count:", error);
      }
    }

    loadSupportCount();
  }, [problemId]);

  const handleSupport = async () => {
    if (supported || supportLoading) {
      return;
    }

    setSupportLoading(true);
    setSupportError("");

    try {
      const response = await supportProblem(problemId);

      setSupported(true);
      setSupportCount(response.supporters);
    } catch (error) {
      setSupportError(
        error instanceof Error
          ? error.message
          : "Failed to support this problem."
      );
    } finally {
      setSupportLoading(false);
    }
  };

  const handleFeedback = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!feedback.trim() || feedbackLoading) {
      return;
    }

    setFeedbackLoading(true);
    setFeedbackError("");
    setSubmitted(false);

    try {
      await submitFeedback(problemId, feedback);

      setSubmitted(true);
      setFeedback("");
    } catch (error) {
      setFeedbackError(
        error instanceof Error
          ? error.message
          : "Failed to submit feedback."
      );
    } finally {
      setFeedbackLoading(false);
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
          onClick={handleSupport}
          disabled={supported || supportLoading}
          className={`mt-5 w-full rounded-xl px-5 py-3 font-semibold transition ${
            supported
              ? "cursor-default bg-emerald-600 text-white"
              : "bg-teal-600 text-white hover:bg-teal-700"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            {supported ? (
              <Check size={17} />
            ) : (
              <ThumbsUp size={17} />
            )}

            {supportLoading
              ? "Supporting..."
              : supported
                ? "Supported"
                : "Support Problem"}
          </span>
        </button>

        {supportError && (
          <p className="mt-3 text-center text-sm font-medium text-red-600">
            {supportError}
          </p>
        )}

        <p className="mt-3 text-center text-sm text-slate-500">
          {supportCount} citizens support this problem
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
            setFeedbackError("");
          }}
          className="mt-5 w-full rounded-xl border border-teal-600 px-5 py-3 font-semibold text-teal-600 transition hover:bg-teal-50"
        >
          {feedbackOpen
            ? "Close Feedback"
            : "Share Feedback"}
        </button>

        {feedbackOpen && (
          <form
            onSubmit={handleFeedback}
            className="mt-5"
          >
            <textarea
              value={feedback}
              onChange={(e) =>
                setFeedback(e.target.value)
              }
              placeholder="Write your feedback here..."
              rows={4}
              required
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />

            <button
              type="submit"
              disabled={feedbackLoading}
              className="mt-3 w-full rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {feedbackLoading
                ? "Submitting..."
                : "Submit Feedback"}
            </button>

            {submitted && (
              <p className="mt-3 text-center text-sm font-medium text-emerald-600">
                ✓ Feedback submitted successfully!
              </p>
            )}

            {feedbackError && (
              <p className="mt-3 text-center text-sm font-medium text-red-600">
                {feedbackError}
              </p>
            )}
          </form>
        )}
      </div>
    </>
  );
}