"use client";

import { Bot, Search, Lightbulb, Check, RotateCcw } from "lucide-react";
import { useState } from "react";

type AIAnalysisProps = {
  category: string;
  severity: string;
  affectedSector: string;
  estimatedImpact: string;
};

export default function AIAnalysis({
  category,
  severity,
  affectedSector,
  estimatedImpact,
}: AIAnalysisProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setCompleted(false);

    setTimeout(() => {
      setAnalyzing(false);
      setCompleted(true);
    }, 1800);
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
            <h2 className="text-xl font-bold">AI Analysis</h2>
            <p className="text-sm text-slate-500">
              Automated problem assessment
            </p>
          </div>
        </div>

        {completed && (
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
            <Check size={14} />
            Analysis Complete
            </span>
          </span>
        )}
      </div>

      {/* Initial State */}
        {!analyzing && !completed && (
        <div className="mt-6 flex flex-1 flex-col items-center justify-center rounded-2xl border border-teal-100 bg-white p-8 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            <Bot size={24} />
            </div>

            <h3 className="mt-3 font-semibold">
            Ready to analyze this problem
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            AI can assess the reported problem and identify its category,
            severity, affected sector and estimated impact.
            </p>

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

      {/* Loading State */}
      {analyzing && (
        <div className="mt-6 rounded-2xl border border-teal-100 bg-white p-8 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />

          <h3 className="mt-4 font-semibold">
            Analyzing problem...
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Assessing the reported information and identifying key factors.
          </p>
        </div>
      )}

      {/* Completed State */}
      {completed && (
        <>
          {/* AI Summary */}
          <div className="mt-6 rounded-2xl border border-teal-100 bg-white p-5">
            <div className="flex items-center gap-2">
              <span className="text-teal-600">
            <Lightbulb size={20} />
            </span>
              <h3 className="font-semibold">AI Summary</h3>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Based on the reported information, this problem appears to
              require attention from the concerned authorities. The issue may
              affect daily activities and create concerns for local residents.
            </p>
          </div>

          {/* Analysis Results */}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-5">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Category
              </p>

              <p className="mt-2 font-semibold">
                {category}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Severity
              </p>

              <p className="mt-2 font-semibold text-amber-600">
                {severity}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Affected Sector
              </p>

              <p className="mt-2 font-semibold">
                {affectedSector}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Estimated Impact
              </p>

              <p className="mt-2 font-semibold">
                {estimatedImpact}
              </p>
            </div>
          </div>

          {/* Confidence */}
          <div className="mt-5 flex items-center justify-between rounded-2xl border border-teal-100 bg-white px-5 py-4">
            <div>
              <p className="text-sm font-semibold">
                AI Confidence
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Based on the submitted problem information
              </p>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-teal-600">
                92%
              </p>

              <p className="text-xs text-slate-400">
                High confidence
              </p>
            </div>
          </div>

          {/* Re-analyze */}
          <button
            onClick={handleAnalyze}
            className="mt-5 text-sm font-semibold text-teal-600 hover:text-teal-700"
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