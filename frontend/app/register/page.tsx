"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UserRound,
  Building2,
  GraduationCap,
  Factory,
  UsersRound,
  BriefcaseBusiness,
  Loader2,
} from "lucide-react";

import { register } from "@/lib/api/auth";
import { getUniversities, University } from "@/lib/api/universities";

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
    value: "student",
    label: "Student",
    icon: UsersRound,
  },
  {
    value: "faculty",
    label: "Faculty",
    icon: BriefcaseBusiness,
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

  const [universities, setUniversities] = useState<University[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(false);

  const [universityId, setUniversityId] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");

  const [facultyDepartment, setFacultyDepartment] = useState("");
  const [designation, setDesignation] = useState("");

  const [universityName, setUniversityName] = useState("");
  const [expertiseArea, setExpertiseArea] = useState("");
  const [universityDistrict, setUniversityDistrict] = useState("");
  const [universityDepartment, setUniversityDepartment] = useState("");

  const [industryName, setIndustryName] = useState("");
  const [industryType, setIndustryType] = useState("");
  const [industryDescription, setIndustryDescription] = useState("");
  const [industryLocation, setIndustryLocation] = useState("");
  const [industryContactEmail, setIndustryContactEmail] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role !== "student" && role !== "faculty") {
      return;
    }

    async function loadUniversities() {
      try {
        setLoadingUniversities(true);
        setError("");

        const data = await getUniversities();
        setUniversities(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load universities."
        );
      } finally {
        setLoadingUniversities(false);
      }
    }

    loadUniversities();
  }, [role]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (
      (role === "student" || role === "faculty") &&
      !universityId
    ) {
      setError("Please select your university.");
      return;
    }

    if (role === "university" && !universityName.trim()) {
      setError("Please enter your university name.");
      return;
    }

    if (role === "industry" && !industryName.trim()) {
      setError("Please enter your industry/company name.");
      return;
    }

    try {
      setLoading(true);

      const response = await register({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        role,

        ...(role === "student"
          ? {
              university_id: universityId,
              course: course.trim(),
              year: year.trim(),
            }
          : {}),

        ...(role === "faculty"
          ? {
              university_id: universityId,
              department: facultyDepartment.trim(),
              designation: designation.trim(),
            }
          : {}),

        ...(role === "university"
          ? {
              university_name: universityName.trim(),
              expertise_area: expertiseArea
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
              district: universityDistrict.trim(),
              department: universityDepartment.trim(),
            }
          : {}),

        ...(role === "industry"
          ? {
              industry_name: industryName.trim(),
              industry_type: industryType.trim(),
              industry_description: industryDescription.trim(),
              industry_location: industryLocation.trim(),
              industry_contact_email:
                industryContactEmail.trim(),
            }
          : {}),
      });

      if (!response.access_token) {
        throw new Error(
          "Registration successful, but no login token was returned. Please login manually."
        );
      }

      if (role === "government") {
        router.push("/government/dashboard");
      } else if (role === "university") {
        router.push("/university/dashboard");
      } else if (role === "industry") {
        router.push("/industry/dashboard");
      } else if (
        role === "student" ||
        role === "faculty"
      ) {
        router.push("/university/dashboard");
      } else {
        router.push("/citizen/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left side */}
        <section className="hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-sm font-bold">
                S
              </div>

              <div>
                <p className="text-xl font-bold">
                  SamadhanX
                </p>
                <p className="text-xs text-slate-400">
                  Ideas → Action → Impact
                </p>
              </div>
            </Link>

            <div className="mt-24 max-w-lg">
              <p className="text-sm font-semibold uppercase tracking-wider text-teal-400">
                Join the platform
              </p>

              <h1 className="mt-4 text-5xl font-bold leading-tight">
                Turn ideas into
                <span className="text-teal-400">
                  {" "}
                  real impact.
                </span>
              </h1>

              <p className="mt-6 text-lg leading-8 text-slate-300">
                Connect citizens, universities, students,
                faculty, government and industry to solve
                real-world problems together.
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-500">
            SamadhanX • Collaborative Civic Innovation
          </p>
        </section>

        {/* Right side */}
        <section className="flex items-center justify-center bg-white px-6 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-xl">
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-2 lg:hidden">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-sm font-bold text-white">
                  S
                </div>
                <p className="text-lg font-bold text-slate-900">
                  SamadhanX
                </p>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Create your account
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Choose your role and provide the details
                needed for your SamadhanX profile.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Basic details */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full name
                  </label>

                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) =>
                      setFullName(e.target.value)
                    }
                    placeholder="Enter your full name"
                   className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm !text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="At least 6 characters"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              {/* Role */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-700">
                  Account type
                </label>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {roles.map((item) => {
                    const Icon = item.icon;
                    const selected = role === item.value;

                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() =>
                          setRole(item.value)
                        }
                        className={`rounded-xl border p-4 text-left transition ${
                          selected
                            ? "border-teal-600 bg-teal-50 ring-1 ring-teal-600"
                            : "border-slate-200 hover:border-teal-300 hover:bg-slate-50"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            selected
                              ? "text-teal-700"
                              : "text-slate-500"
                          }`}
                        />

                        <p
                          className={`mt-2 text-sm font-semibold ${
                            selected
                              ? "text-teal-800"
                              : "text-slate-700"
                          }`}
                        >
                          {item.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Student */}
              {role === "student" && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-base font-bold text-slate-900">
                    Student details
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Tell us which university you belong to.
                  </p>

                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        University
                      </label>

                      <select
                        required
                        value={universityId}
                        onChange={(e) =>
                          setUniversityId(e.target.value)
                        }
                        disabled={loadingUniversities}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                      >
                        <option value="">
                          {loadingUniversities
                            ? "Loading universities..."
                            : "Select your university"}
                        </option>

                        {universities.map(
                          (university) => (
                            <option
                              key={university.id}
                              value={university.id}
                            >
                              {university.name}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Course
                        </label>

                        <input
                          type="text"
                          value={course}
                          onChange={(e) =>
                            setCourse(e.target.value)
                          }
                          placeholder="e.g. B.Tech CSE"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Year
                        </label>

                        <input
                          type="text"
                          value={year}
                          onChange={(e) =>
                            setYear(e.target.value)
                          }
                          placeholder="e.g. 3rd Year"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Faculty */}
              {role === "faculty" && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-base font-bold text-slate-900">
                    Faculty details
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Tell us which university you teach at.
                  </p>

                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        University
                      </label>

                      <select
                        required
                        value={universityId}
                        onChange={(e) =>
                          setUniversityId(e.target.value)
                        }
                        disabled={loadingUniversities}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                      >
                        <option value="">
                          {loadingUniversities
                            ? "Loading universities..."
                            : "Select your university"}
                        </option>

                        {universities.map(
                          (university) => (
                            <option
                              key={university.id}
                              value={university.id}
                            >
                              {university.name}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Department
                        </label>

                        <input
                          type="text"
                          value={facultyDepartment}
                          onChange={(e) =>
                            setFacultyDepartment(
                              e.target.value
                            )
                          }
                          placeholder="e.g. Computer Science"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Designation
                        </label>

                        <input
                          type="text"
                          value={designation}
                          onChange={(e) =>
                            setDesignation(e.target.value)
                          }
                          placeholder="e.g. Assistant Professor"
                         className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* University */}
              {role === "university" && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-base font-bold text-slate-900">
                    University details
                  </h3>

                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        University name
                      </label>

                      <input
                        type="text"
                        required
                        value={universityName}
                        onChange={(e) =>
                          setUniversityName(e.target.value)
                        }
                        placeholder="Enter university name"
                       className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          District
                        </label>

                        <input
                          type="text"
                          value={universityDistrict}
                          onChange={(e) =>
                            setUniversityDistrict(
                              e.target.value
                            )
                          }
                          placeholder="e.g. Ranchi"
                         className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Department
                        </label>

                        <input
                          type="text"
                          value={universityDepartment}
                          onChange={(e) =>
                            setUniversityDepartment(
                              e.target.value
                            )
                          }
                          placeholder="e.g. CSE"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Expertise areas
                      </label>

                      <input
                        type="text"
                        value={expertiseArea}
                        onChange={(e) =>
                          setExpertiseArea(e.target.value)
                        }
                        placeholder="AI, IoT, Data Science"
                       className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                      />

                      <p className="mt-1 text-xs text-slate-400">
                        Separate multiple areas with commas.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Industry */}
              {role === "industry" && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-base font-bold text-slate-900">
                    Industry details
                  </h3>

                  <div className="mt-4 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Company / Industry name
                        </label>

                        <input
                          type="text"
                          required
                          value={industryName}
                          onChange={(e) =>
                            setIndustryName(e.target.value)
                          }
                          placeholder="Company name"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Industry type
                        </label>

                        <input
                          type="text"
                          value={industryType}
                          onChange={(e) =>
                            setIndustryType(e.target.value)
                          }
                          placeholder="e.g. Technology"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Location
                      </label>

                      <input
                        type="text"
                        value={industryLocation}
                        onChange={(e) =>
                          setIndustryLocation(e.target.value)
                        }
                        placeholder="City / District"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Contact email
                      </label>

                      <input
                        type="email"
                        value={industryContactEmail}
                        onChange={(e) =>
                          setIndustryContactEmail(
                            e.target.value
                          )
                        }
                        placeholder="company@example.com"
                       className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Description
                      </label>

                      <textarea
                        rows={3}
                        value={industryDescription}
                        onChange={(e) =>
                          setIndustryDescription(
                            e.target.value
                          )
                        }
                        placeholder="Briefly describe the company."
                       className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || loadingUniversities}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {loading
                  ? "Creating account..."
                  : "Create account"}
              </button>

              <p className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-teal-700 hover:text-teal-800"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}