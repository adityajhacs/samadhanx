
"use client";

import {
  Bot,
  Search,
  Lightbulb,
  Check,
  RotateCcw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { apiRequest, getAuthToken } from "@/lib/api/client";

type AIAnalysis = {
  problem_id: string;
  category: string;
  severity_score: number;
  subcategory: string;
  severity_level: string;
  affected_sector: string;
  estimated_affected_people: number;
  root_cause: string;
  ai_summary: string;
  keywords: string[];
  created_at: string;
};

type AIAnalysisProps = {
  problemId: string;
};

export default function AIAnalysis({
  problemId,
}: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getAuthToken();

        if (!token) {
          setLoading(false);
          return;
        }

        const data = await apiRequest<AIAnalysis>(
          `/api/problems/${problemId}/analysis`,
          {
            method: "GET",
            token,
          }
        );

        setAnalysis(data);
      } catch (error) {
        // 404 simply means this problem has not been analyzed yet.
        console.log("No existing AI analysis:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, [problemId]);

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      setError("");

      const token = getAuthToken();

      if (!token) {
        throw new Error("Please log in to analyze this problem.");
      }

      const data = await apiRequest<AIAnalysis>(
        `/api/problems/${problemId}/analyze`,
        {
          method: "POST",
          token,
        }
      );

      setAnalysis(data);
    } catch (error) {
      console.error("AI analysis failed:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to analyze the problem.");
      }
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-[460px] flex-col rounded-3xl border border-teal-100 bg-teal-50 p-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold text-white">
            AI
          </div>

          <div>
            <h2 className="text-xl font-bold">
              AI Analysis
            </h2>

            <p className="text-sm text-slate-500">
              Automated problem assessment
            </p>
          </div>
        </div>

        {analysis && (
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
            <Check size={14} />
            Analysis Complete
          </span>
        )}
      </div>

      {/* Loading existing analysis */}
      {loading && (
        <div className="mt-6 flex flex-1 flex-col items-center justify-center rounded-2xl border border-teal-100 bg-white p-8 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />

          <h3 className="mt-4 font-semibold">
            Checking AI analysis...
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Checking whether this problem has already been analyzed.
          </p>
        </div>
      )}

      {/* Ready State */}
      {!loading && !analysis && !analyzing && (
        <div className="mt-6 flex flex-1 flex-col items-center justify-center rounded-2xl border border-teal-100 bg-white p-8 text-center">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            <Bot size={24} />
          </div>

          <h3 className="mt-3 font-semibold">
            Ready to analyze this problem
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            AI can assess the reported problem and identify its
            category, severity, affected sector and estimated impact.
          </p>

          {error && (
            <p className="mt-4 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            onClick={handleAnalyze}
            className="mt-5 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            <span className="flex items-center justify-center gap-2">
              <Search size={17} />
              Analyze Problem
            </span>
          </button>
        </div>
      )}

      {/* Analyzing */}
      {analyzing && (
        <div className="mt-6 rounded-2xl border border-teal-100 bg-white p-8 text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />

          <h3 className="mt-4 font-semibold">
            Analyzing problem...
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            AI is assessing the reported information.
          </p>
        </div>
      )}

      {/* Completed */}
      {!loading && analysis && !analyzing && (
        <>
          {/* AI Summary */}
          <div className="mt-6 rounded-2xl border border-teal-100 bg-white p-5">

            <div className="flex items-center gap-2">
              <span className="text-teal-600">
                <Lightbulb size={20} />
              </span>

              <h3 className="font-semibold">
                AI Summary
              </h3>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {analysis.ai_summary}
            </p>
          </div>

          {/* Analysis Results */}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">

            <div className="rounded-2xl bg-white p-5">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Category
              </p>

              <p className="mt-2 font-semibold">
                {analysis.category}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {analysis.subcategory}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Severity
              </p>

              <p className="mt-2 font-semibold text-amber-600">
                {analysis.severity_level}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Score: {analysis.severity_score}/100
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Affected Sector
              </p>

              <p className="mt-2 font-semibold">
                {analysis.affected_sector}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Estimated Impact
              </p>

              <p className="mt-2 font-semibold">
                {analysis.estimated_affected_people.toLocaleString()} people
              </p>
            </div>
          </div>

          {/* Root Cause */}
          <div className="mt-5 rounded-2xl border border-teal-100 bg-white p-5">

            <p className="text-xs font-semibold uppercase text-slate-500">
              Root Cause
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {analysis.root_cause}
            </p>
          </div>

          {/* Keywords */}
          {analysis.keywords.length > 0 && (
            <div className="mt-5 rounded-2xl border border-teal-100 bg-white p-5">

              <p className="text-xs font-semibold uppercase text-slate-500">
                Keywords
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {analysis.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Re-analyze */}
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="mt-5 text-sm font-semibold text-teal-600 hover:text-teal-700 disabled:opacity-50"
          >
            <span className="flex items-center gap-2">
              <RotateCcw size={16} />
              Analyze Again
            </span>
          </button>
        </>
      )}
    </div>
  );
}

