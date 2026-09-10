
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getProblems,
  createProblem,
  uploadProblemFile,
  Problem,
} from "@/lib/api/problems";
import {
  Camera,
  Video,
  MapPin,
  Sparkles,
  Search,
  Construction,
  GraduationCap,
  Hospital,
  Leaf,
  ShieldCheck,
  Bus,
  Trash2,
  Droplets,
  Wheat,
} from "lucide-react";

const problems = [
  {
    id: "1",
    title: "Road Infrastructure",
    description:
      "Report and discover road-related problems such as potholes, damaged roads, poor maintenance and unsafe streets.",
    count: "1,240+",
    icon: Construction,
  },
  {
    id: "2",
    title: "Education",
    description:
      "Find challenges in schools, colleges and communities and help build better learning opportunities.",
    count: "680+",
    icon: GraduationCap,
  },
  {
    id: "3",
    title: "Healthcare",
    description:
      "Explore healthcare challenges and connect innovative ideas with real community needs.",
    count: "520+",
    icon: Hospital,
  },
  {
    id: "4",
    title: "Environment",
    description:
      "Discover environmental problems involving pollution, waste and sustainable development.",
    count: "410+",
    icon: Leaf,
  },
  {
    id: "5",
    title: "Public Safety",
    description:
      "Identify local safety challenges and support solutions that make communities safer.",
    count: "290+",
    icon: ShieldCheck,
  },
  {
    id: "6",
    title: "Transport",
    description:
      "Explore transportation and mobility problems and develop practical solutions.",
    count: "185+",
    icon: Bus,
  },
  {
    id: "7",
    title: "Sanitation",
    description:
      "Identify sanitation challenges such as waste collection, cleanliness and access to proper sanitation facilities.",
    count: "165+",
    icon: Trash2,
  },
  {
    id: "8",
    title: "Water Management",
    description:
      "Discover challenges related to water supply, availability, conservation and efficient water management.",
    count: "145+",
    icon: Droplets,
  },
  {
    id: "9",
    title: "Agriculture",
    description:
      "Explore challenges faced by farmers involving irrigation, agricultural resources, productivity and rural livelihoods.",
    count: "120+",
    icon: Wheat,
  },
];

export default function ProblemsPage() {
  const [apiProblems, setApiProblems] = useState<Problem[]>([]);
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [apiError, setApiError] = useState("");

  const [search, setSearch] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [photoError, setPhotoError] = useState("");
  const [videoError, setVideoError] = useState("");

  const [reportActive, setReportActive] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [district, setDistrict] = useState("");
  const [priority, setPriority] = useState("");

  // Coordinates
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Files
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const categoryCounts = {
    "Road Infrastructure": apiProblems.filter((p) =>
      p.category?.toLowerCase().includes("road")
    ).length,

    Education: apiProblems.filter((p) =>
      p.category?.toLowerCase().includes("education")
    ).length,

    Healthcare: apiProblems.filter((p) =>
      p.category?.toLowerCase().includes("health")
    ).length,

    Environment: apiProblems.filter((p) =>
      p.category?.toLowerCase().includes("environment")
    ).length,

    "Public Safety": apiProblems.filter((p) =>
      p.category?.toLowerCase().includes("safety")
    ).length,

    Transport: apiProblems.filter((p) =>
      p.category?.toLowerCase().includes("transport")
    ).length,

    Sanitation: apiProblems.filter((p) =>
      p.category?.toLowerCase().includes("sanitation")
    ).length,

    "Water Management": apiProblems.filter((p) =>
      p.category?.toLowerCase().includes("water")
    ).length,

    Agriculture: apiProblems.filter((p) =>
      p.category?.toLowerCase().includes("agriculture")
    ).length,
  };

  useEffect(() => {
    const checkHash = () => {
      setReportActive(window.location.hash === "#report");
    };

    checkHash();

    window.addEventListener("hashchange", checkHash);

    return () => {
      window.removeEventListener("hashchange", checkHash);
    };
  }, []);

  useEffect(() => {
    const loadProblems = async () => {
      try {
        setLoadingProblems(true);
        setApiError("");

        const data = await getProblems();
        setApiProblems(data);
      } catch (error) {
        console.error("Failed to load problems:", error);

        if (error instanceof Error) {
          setApiError(error.message);
        } else {
          setApiError("Failed to load problems.");
        }
      } finally {
        setLoadingProblems(false);
      }
    };

    loadProblems();
  }, []);

  const filteredProblems = problems.filter((problem) =>
    problem.title.toLowerCase().includes(search.toLowerCase())
  );

  // Use browser location
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setSubmitError("Location services are not supported by this browser.");
      return;
    }

    setLocationLoading(true);
    setSubmitError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);

        setLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);

        setLocationLoading(false);
      },
      (error) => {
        console.error("Location error:", error);

        setLocationLoading(false);

        if (error.code === error.PERMISSION_DENIED) {
          setSubmitError(
            "Location permission was denied. Please allow location access or enter the location manually."
          );
        } else {
          setSubmitError("Unable to get your current location.");
        }
      }
    );
  };

  const handlePhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    setPhotoError("");

    if (!file) {
      setPhotoFile(null);
      return;
    }

    if (file.size > 300 * 1024) {
      setPhotoError("Photo must be 300 KB or smaller.");
      e.target.value = "";
      setPhotoFile(null);
      return;
    }

    setPhotoFile(file);
  };

  const handleVideoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    setVideoError("");

    if (!file) {
      setVideoFile(null);
      return;
    }

    if (file.size > 300 * 1024 * 1024) {
      setVideoError("Video must be 300 MB or smaller.");
      e.target.value = "";
      setVideoFile(null);
      return;
    }

    setVideoFile(file);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setSubmitted(false);
    setSubmitError("");

    if (!title.trim() || !category || !description.trim()) {
      setSubmitError("Please fill in all required fields.");
      return;
    }

    if (!district.trim()) {
      setSubmitError("Please enter the district.");
      return;
    }

    if (!location.trim()) {
      setSubmitError("Please enter the problem location.");
      return;
    }

    if (photoError || videoError) {
      setSubmitError("Please fix the file upload errors first.");
      return;
    }

    try {
      setSubmitting(true);

      let imageUrl: string | null = null;
      let videoUrl: string | null = null;

      // Upload photo first
      if (photoFile) {
        const uploadedPhoto = await uploadProblemFile(photoFile);

        imageUrl = uploadedPhoto.url;
      }

      // Upload video
      if (videoFile) {
        const uploadedVideo = await uploadProblemFile(videoFile);

        videoUrl = uploadedVideo.url;
      }

      // Create problem in backend
      const newProblem = await createProblem({
        title: title.trim(),
        description: description.trim(),
        district: district.trim(),
        category,
        latitude,
        longitude,
        image_url: imageUrl,
        video_url: videoUrl,
      });

      // Add newly created problem immediately to the list
      setApiProblems((current) => [newProblem, ...current]);

      setSubmitted(true);

      // Reset form
      setTitle("");
      setCategory("");
      setDescription("");
      setLocation("");
      setDistrict("");
      setPriority("");

      setLatitude(null);
      setLongitude(null);

      setPhotoFile(null);
      setVideoFile(null);

      setPhotoError("");
      setVideoError("");
    } catch (error) {
      console.error("Failed to submit problem:", error);

      if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError(
          "Failed to submit problem. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

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
              <h1 className="text-xl font-bold tracking-tight">
                SamadhanX
              </h1>
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
              className={`text-sm ${
                reportActive
                  ? "text-slate-600 hover:text-teal-600"
                  : "font-semibold text-teal-600"
              }`}
            >
              Problems
            </Link>

            <Link
              href="/problems#report"
              className={`text-sm ${
                reportActive
                  ? "font-semibold text-teal-600"
                  : "text-slate-600 hover:text-teal-600"
              }`}
            >
              Report Problem
            </Link>

            <Link
              href="/help"
              className="text-sm text-slate-600 hover:text-teal-600"
            >
              Help
            </Link>

            <Link
              href="#"
              className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-6 pt-6">
        <div className="max-w-5xl">
          <div className="mb-6 inline-flex rounded-full bg-teal-50 px-4 py-2 text-sm font-medium text-teal-600">
            <span className="flex items-center gap-2">
              <Sparkles size={18} className="text-teal-600" />
              Explore real-world challenges
            </span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            What needs a{" "}
            <span className="text-teal-600">Samadhan?</span>
          </h2>

          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-600 whitespace-nowrap">
            Discover challenges reported by communities and find
            opportunities to create meaningful solutions together.
          </p>
        </div>

        {/* Search */}
        <div className="mt-8 max-w-2xl">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-5 text-base outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            />
          </div>
        </div>
      </section>

      {/* Problem Cards */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        {loadingProblems ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-slate-500">
              Loading reported problems...
            </p>
          </div>
        ) : apiError ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-12 text-center">
            <p className="font-medium text-red-600">{apiError}</p>
          </div>
        ) : apiProblems.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
            <h3 className="text-xl font-semibold">
              No problems reported yet
            </h3>
            <p className="mt-2 text-slate-500">
              Be the first to report a real-world problem.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-950">
                Reported Problems
              </h2>
              <p className="mt-2 text-slate-600">
                Real challenges reported by citizens through SamadhanX.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {apiProblems
                .filter((problem) =>
                  problem.title
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                .map((problem) => (
                  <div
                    key={problem.id}
                    className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                        <Construction size={22} />
                      </div>

                      {problem.status && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {problem.status}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-6 text-xl font-bold text-slate-950">
                      {problem.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 leading-7 text-slate-600">
                      {problem.description}
                    </p>

                    <div className="mt-auto pt-6">
                      <div className="flex flex-wrap gap-2 text-xs">
                        {problem.category && (
                          <span className="rounded-full bg-teal-50 px-3 py-1 font-medium text-teal-700">
                            {problem.category}
                          </span>
                        )}

                        {problem.district && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
                            {problem.district}
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/problems/${problem.id}`}
                        className="mt-5 inline-flex text-sm font-semibold text-teal-600 hover:text-teal-700"
                      >
                        View Problem →
                      </Link>
                    </div>
                  </div>
                ))}
            </div>

            {apiProblems.filter((problem) =>
              problem.title
                .toLowerCase()
                .includes(search.toLowerCase())
            ).length === 0 && (
              <div className="rounded-3xl bg-white p-12 text-center">
                <h3 className="text-xl font-semibold">
                  No problems found
                </h3>
                <p className="mt-2 text-slate-500">
                  Try searching for another problem.
                </p>
              </div>
            )}
          </>
        )}
      </section>

      {/* Report Problem */}
      <form
        id="report"
        onSubmit={handleSubmit}
        className="mx-6 mb-16 rounded-[2rem] border border-slate-200 bg-white px-8 py-12 shadow-sm"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="font-semibold text-teal-600">
              REPORT A PROBLEM
            </p>

            <h3 className="mt-2 text-3xl font-bold text-slate-950">
              Tell us what needs a Samadhan.
            </h3>

            <p className="mt-3 text-slate-600">
              Share a real-world problem and help us connect it with
              people who can create meaningful solutions.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Problem Title <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g: Poor road condition in my area"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Category <span className="text-red-500">*</span>
              </label>

              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              >
                <option value="">Select a category</option>
                <option>Road Infrastructure</option>
                <option>Education</option>
                <option>Healthcare</option>
                <option>Environment</option>
                <option>Public Safety</option>
                <option>Transport</option>
                <option>Sanitation</option>
                <option>Water Management</option>
                <option>Agriculture</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description <span className="text-red-500">*</span>
            </label>

            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the problem in detail..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            />
          </div>

          {/* Location */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Location <span className="text-red-500">*</span>
            </label>

            <div className="flex gap-3">
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter problem location"
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              />

              <button
                type="button"
                onClick={handleUseLocation}
                disabled={locationLoading}
                className="flex items-center gap-2 rounded-xl border border-teal-200 px-4 py-3 text-sm font-semibold text-teal-600 hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <MapPin size={17} />

                {locationLoading
                  ? "Getting..."
                  : "Use Location"}
              </button>
            </div>

            {latitude !== null && longitude !== null && (
              <p className="mt-2 text-xs text-slate-500">
                Coordinates: {latitude.toFixed(6)},{" "}
                {longitude.toFixed(6)}
              </p>
            )}
          </div>

          {/* District */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              District <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="Enter district"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            />
          </div>

          {/* Photo + Video */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Photo */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Photo
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-center transition hover:border-teal-300 hover:bg-teal-50">
                <span className="text-2xl">
                  <Camera size={18} />
                </span>

                <span className="mt-2 text-sm font-semibold text-slate-700">
                  {photoFile
                    ? photoFile.name
                    : "Upload Photo"}
                </span>

                <span className="mt-1 text-xs text-slate-500">
                  JPG, JPEG, PNG • Max 300 KB
                </span>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>

              {photoError && (
                <p className="mt-2 text-sm text-red-500">
                  {photoError}
                </p>
              )}
            </div>

            {/* Video */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Video
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-center transition hover:border-teal-300 hover:bg-teal-50">
                <span className="text-2xl">
                  <Video size={18} />
                </span>

                <span className="mt-2 text-sm font-semibold text-slate-700">
                  {videoFile
                    ? videoFile.name
                    : "Upload Video"}
                </span>

                <span className="mt-1 text-xs text-slate-500">
                  MP4, MOV, WEBM • Max 300 MB
                </span>

                <input
                  type="file"
                  accept=".mp4,.mov,.webm"
                  className="hidden"
                  onChange={handleVideoChange}
                />
              </label>

              {videoError && (
                <p className="mt-2 text-sm text-red-500">
                  {videoError}
                </p>
              )}
            </div>
          </div>

          {/* Priority */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Priority
            </label>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            >
              <option value="">Select priority</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>

            <p className="mt-2 text-xs text-slate-400">
              Priority is currently collected in the UI; the current
              backend problem API does not store this field yet.
            </p>
          </div>

          {/* Submit error */}
          {submitError && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {submitError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-8 rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Submitting..."
              : "Submit Problem"}
          </button>

          {submitted && (
            <p className="mt-4 font-medium text-emerald-600">
              ✓ Problem submitted successfully!
            </p>
          )}
        </div>
      </form>

      {/* CTA */}
      <section className="mx-6 mb-16 rounded-[2rem] bg-teal-600 px-8 py-14 text-white md:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="font-semibold text-teal-200">
              HAVE A PROBLEM?
            </p>

            <h3 className="mt-3 max-w-2xl text-3xl font-bold md:text-4xl">
              Your challenge could inspire the next solution.
            </h3>

            <p className="mt-4 max-w-2xl text-teal-100">
              Share a real-world problem and help innovators discover
              opportunities to make an impact.
            </p>
          </div>

          <a
            href="#report"
            className="whitespace-nowrap rounded-2xl bg-white px-7 py-4 font-bold text-teal-600 shadow-lg hover:bg-teal-50"
          >
            Submit a Problem
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
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

          <div className="text-center text-sm text-slate-400">
            <p>
              © 2026 SamadhanX. Building solutions that matter.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-5 text-sm text-slate-300">
            <span className="cursor-pointer hover:text-white">
              About
            </span>
            <span className="cursor-pointer hover:text-white">
              Contact
            </span>
            <span className="cursor-pointer hover:text-white">
              Privacy
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
