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
  UserRound,
  Building2,
  GraduationCap,
  Factory,
} from "lucide-react";
import { register } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

const roles = [
  {
    value: "citizen",
    label: "Citizen",
    icon: UserRound,
  },
  {
    value: "government",
    label: "Government",
    icon: Building2,
  },
  {
    value: "university",
    label: "University",
    icon: GraduationCap,
  },
  {
    value: "industry",
    label: "Industry",
    icon: Factory,
  },
];

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("citizen");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  setError("");
  setSuccess("");

  if (!fullName.trim() || !email.trim() || !password.trim()) {
    setError("Please fill in all required fields.");
    return;
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters long.");
    return;
  }

  try {
    setLoading(true);

    const response = await register({
      full_name: fullName.trim(),
      email: email.trim(),
      password,
      role,
    });

    if (!response.access_token) {
      throw new Error(
        "Account created, but authentication token was not returned."
      );
    }

    setSuccess("Account created successfully. Redirecting...");

    setTimeout(() => {
      if (role === "government") {
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
    console.error("Registration error:", err);

    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Unable to create your account. Please try again.");
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
                Join the Civic Innovation Network
              </p>

              <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Be part of turning
                <span className="block text-teal-400">
                  problems into impact.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
                Join citizens, government, universities and industry
                working together to identify challenges, build solutions
                and create measurable impact.
              </p>

              {/* Feature cards */}

              <div className="mt-10 grid grid-cols-2 gap-3">

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
                    <ShieldCheck size={18} />
                  </div>

                  <p className="text-sm font-semibold text-white">
                    Secure Platform
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Protected account access
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
                    Ideas → solutions → impact
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
            RIGHT — REGISTER FORM
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
                <UserRound size={21} />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Join SamadhanX and start making an impact.
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

                <div>
                  <p>{success}</p>

                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="mt-3 font-semibold text-teal-700 hover:text-teal-800"
                  >
                    Go to login →
                  </button>
                </div>
              </div>
            )}

            {/* Form */}

            {!success && (
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Full Name */}

                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <UserRound
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      autoComplete="name"
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
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

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
                      placeholder="Create a password"
                      autoComplete="new-password"
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

                {/* Role */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Account type
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    {roles.map((item) => {
                      const Icon = item.icon;
                      const selected = role === item.value;

                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => setRole(item.value)}
                          disabled={loading}
                          className={`
                            flex h-12 items-center gap-2.5
                            rounded-xl border
                            px-3.5
                            text-sm font-semibold
                            transition
                            disabled:cursor-not-allowed
                            ${
                              selected
                                ? "border-teal-500 bg-teal-50 text-teal-800 ring-2 ring-teal-500/10"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800"
                            }
                          `}
                        >
                          <Icon size={17} />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Security */}

                <div className="flex items-center gap-2">
                  <div className="flex h-4 w-4 items-center justify-center rounded border border-teal-200 bg-teal-50">
                    <CheckCircle2
                      size={11}
                      className="text-teal-600"
                    />
                  </div>

                  <span className="text-xs text-slate-500">
                    Your account will be protected with secure authentication.
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
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

              </form>
            )}

            {/* Bottom info */}

            <div className="mt-8 border-t border-slate-200 pt-6">
            
<div className="flex items-start gap-3">
  <ShieldCheck
    size={18}
    className="mt-0.5 shrink-0 text-teal-600"
  />

  <p className="text-xs leading-5 text-slate-500">
    Your account is protected with secure authentication.
    After registration, you will be redirected to your workspace.
  </p>
</div>



              <p className="mt-5 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-teal-700 hover:text-teal-800"
                >
                  Sign in
                </Link>
              </p>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}