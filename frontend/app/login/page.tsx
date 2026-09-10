"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { login, getCurrentUser } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // 1. Login through FastAPI
      await login({
        email: email.trim(),
        password,
      });

      // 2. Verify token and get current user
      const user = await getCurrentUser();

      setSuccess("Login successful. Redirecting...");

      // 3. Role-based redirect
      const role = user.role?.toLowerCase();

      setTimeout(() => {
        if (role === "government" || role === "admin") {
          router.push("/government/dashboard");
        } else if (role === "university") {
          router.push("/university/dashboard");
        } else if (role === "industry") {
          router.push("/industry/dashboard");
        } else {
          router.push("/");
        }
      }, 500);
    } catch (err) {
      console.error("Login error:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to login. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">

        {/* =====================================================
            LEFT — BRAND / PLATFORM INTRO
        ====================================================== */}

        <section className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:w-[48%]">
          <div className="absolute inset-0">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-teal-600/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
          </div>

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* Brand */}

            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-white shadow-lg">
                  <ShieldCheck size={27} strokeWidth={2} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight text-white">
                      SamadhanX
                    </span>

                    <span className="rounded-full bg-teal-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-teal-300 ring-1 ring-teal-400/20">
                      Platform
                    </span>
                  </div>

                  <p className="mt-0.5 text-xs font-medium text-slate-400">
                    Ideas → Action → Impact
                  </p>
                </div>
              </Link>
            </div>

            {/* Main message */}

            <div className="max-w-lg">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-teal-400">
                Civic Innovation Platform
              </p>

              <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Turning civic challenges
                <span className="block text-teal-400">
                  into real solutions.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
                Connect citizens, government, universities and industry
                to identify problems, build solutions and create measurable
                impact.
              </p>

              {/* Feature cards */}

              <div className="mt-10 grid grid-cols-2 gap-3">

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
                    <ShieldCheck size={18} />
                  </div>

                  <p className="text-sm font-semibold text-white">
                    Secure Access
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Protected workspace access
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
                    <ArrowRight size={18} />
                  </div>

                  <p className="text-sm font-semibold text-white">
                    Collaborative
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    From ideas to implementation
                  </p>
                </div>

              </div>
            </div>

            {/* Footer */}

            <p className="text-xs text-slate-600">
              SamadhanX Civic Problem Solving Platform
            </p>
          </div>
        </section>

        {/* =====================================================
            RIGHT — LOGIN FORM
        ====================================================== */}

        <section className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-[52%]">

          <div className="w-full max-w-md">

            {/* Mobile brand */}

            <div className="mb-10 flex items-center justify-center lg:hidden">
              <Link
                href="/"
                className="flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white">
                  <ShieldCheck size={24} />
                </div>

                <div>
                  <p className="text-lg font-bold text-slate-900">
                    SamadhanX
                  </p>

                  <p className="text-[10px] font-medium text-slate-500">
                    Ideas → Action → Impact
                  </p>
                </div>
              </Link>
            </div>

            {/* Heading */}

            <div className="mb-8">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <LockKeyhole size={21} />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to continue to your SamadhanX workspace.
              </p>
            </div>

            {/* Error */}

            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <p>{error}</p>
              </div>
            )}

            {/* Success */}

            {success && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <p>{success}</p>
              </div>
            )}

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                    className="
                      h-12 w-full rounded-xl
                      border border-slate-200
                      bg-white
                      pl-11 pr-4
                      text-sm text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      hover:border-slate-300
                      focus:border-teal-500
                      focus:ring-4 focus:ring-teal-500/10
                      disabled:cursor-not-allowed
                      disabled:bg-slate-50
                    "
                  />
                </div>
              </div>

              {/* Password */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-semibold text-teal-700 hover:text-teal-800"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    className="
                      h-12 w-full rounded-xl
                      border border-slate-200
                      bg-white
                      pl-11 pr-12
                      text-sm text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      hover:border-slate-300
                      focus:border-teal-500
                      focus:ring-4 focus:ring-teal-500/10
                      disabled:cursor-not-allowed
                      disabled:bg-slate-50
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="
                      absolute right-3.5 top-1/2
                      -translate-y-1/2
                      text-slate-400
                      transition
                      hover:text-teal-700
                    "
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember / security */}

              <div className="flex items-center gap-2">
                <div className="flex h-4 w-4 items-center justify-center rounded border border-teal-200 bg-teal-50">
                  <CheckCircle2
                    size={11}
                    className="text-teal-600"
                  />
                </div>

                <span className="text-xs text-slate-500">
                  Secure SamadhanX authentication
                </span>
              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="
                  flex h-12 w-full
                  items-center justify-center gap-2
                  rounded-xl
                  bg-teal-600
                  px-5
                  text-sm font-bold text-white
                  shadow-sm
                  transition-all duration-200
                  hover:bg-teal-700
                  hover:shadow-md
                  focus:outline-none
                  focus:ring-4 focus:ring-teal-500/20
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                "
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

            </form>

            {/* Bottom info */}

            <div className="mt-8 border-t border-slate-200 pt-6">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-teal-600"
                />

                <p className="text-xs leading-5 text-slate-500">
                  Your access is protected by token-based authentication.
                  After signing in, SamadhanX automatically opens the
                  workspace associated with your account.
                </p>
              </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}