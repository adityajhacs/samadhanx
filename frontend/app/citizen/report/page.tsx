
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  FileText,
  Loader2,
  MapPin,
  Upload,
  Video,
  AlertCircle,
} from "lucide-react";

import {
  createProblem,
  uploadProblemFile,
} from "@/lib/api/problems";

const categories = [
  "Road Infrastructure",
  "Education",
  "Healthcare",
  "Environment",
  "Public Safety",
  "Transport",
  "Sanitation",
  "Water Management",
  "Agriculture",
];

const priorities = ["Low", "Medium", "High", "Critical"];

export default function ReportProblemPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [district, setDistrict] = useState("");
  const [priority, setPriority] = useState("Medium");

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [location, setLocation] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

  const [photo, setPhoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function getCurrentLocation() {
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);
        setLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        setLocationLoading(false);
      },
      (locationError) => {
        console.error("Location error:", locationError);

        setLocationLoading(false);
        setError(
          "Unable to get your location. Please allow location access and try again."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setError("");

    const file = event.target.files?.[0];

    if (!file) return;

    const maxPhotoSize = 300 * 1024;

    if (file.size > maxPhotoSize) {
      setError("Photo size must be 300 KB or less.");
      event.target.value = "";
      return;
    }

    setPhoto(file);
  }

  function handleVideoChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setError("");

    const file = event.target.files?.[0];

    if (!file) return;

    const maxVideoSize = 300 * 1024 * 1024;

    if (file.size > maxVideoSize) {
      setError("Video size must be 300 MB or less.");
      event.target.value = "";
      return;
    }

    setVideo(file);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Please enter a problem title.");
      return;
    }

    if (!description.trim()) {
      setError("Please describe the problem.");
      return;
    }

    if (!district.trim()) {
      setError("Please enter the district.");
      return;
    }

    if (!category) {
      setError("Please select a category.");
      return;
    }

    try {
      setSubmitting(true);

      let imageUrl: string | undefined;
      let videoUrl: string | undefined;

      // Upload photo
      if (photo) {
        const uploadedPhoto = await uploadProblemFile(photo);
        imageUrl = uploadedPhoto.url;
      }

      // Upload video
      if (video) {
        const uploadedVideo = await uploadProblemFile(video);
        videoUrl = uploadedVideo.url;
      }

      // Create problem
      await createProblem({
        title: title.trim(),
        description: description.trim(),
        district: district.trim(),
        category,
        latitude,
        longitude,
        image_url: imageUrl,
        video_url: videoUrl,
      });

      setSuccess(
        "Your problem has been reported successfully."
      );

      setTitle("");
      setCategory("");
      setDescription("");
      setDistrict("");
      setPriority("Medium");
      setLocation("");
      setLatitude(null);
      setLongitude(null);
      setPhoto(null);
      setVideo(null);

      setTimeout(() => {
        window.location.href = "/citizen/problems";
      }, 1200);
    } catch (submitError) {
      console.error("Failed to report problem:", submitError);

      if (submitError instanceof Error) {
        setError(submitError.message);
      } else {
        setError("Failed to report the problem. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      {/* ==================== NAVBAR ==================== */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <Link
            href="/citizen/dashboard"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-sm font-bold text-white shadow-sm">
              S
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900">
                SamadhanX
              </p>

              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Ideas → Action → Impact
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <div className="hidden items-center gap-7 md:flex">

            <Link
              href="/citizen/dashboard"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Dashboard
            </Link>

            <Link
              href="/problems"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              All Problems
            </Link>

            <Link
              href="/citizen/problems"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              My Problems
            </Link>

            <Link
              href="/help"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-700"
            >
              Help
            </Link>

            <Link
              href="/citizen/report"
              className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
            >
              Report Problem
            </Link>

          </div>

          {/* Mobile */}
          <Link
            href="/citizen/report"
            className="rounded-xl bg-teal-700 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 md:hidden"
          >
            Report Problem
          </Link>

        </div>
      </nav>

      {/* ==================== PAGE HEADER ==================== */}
      <section className="mx-auto max-w-5xl px-6 pb-8 pt-10">

        <Link
          href="/citizen/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-teal-700"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="mt-7">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700">
            <FileText size={17} />
            Report a Community Problem
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Report a Problem
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            Tell us about a problem in your community. Your report can help
            connect the right people and organizations to build a solution.
          </p>
        </div>

      </section>

      {/* ==================== FORM ==================== */}
      <section className="mx-auto max-w-5xl px-6 pb-20">

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle
                size={19}
                className="mt-0.5 shrink-0"
              />

              <p>{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              <CheckCircle2
                size={19}
                className="mt-0.5 shrink-0"
              />

              <div>
                <p className="font-semibold">
                  {success}
                </p>

                <p className="mt-1">
                  Redirecting to your problems...
                </p>
              </div>
            </div>
          )}

          {/* Basic Details */}
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Problem Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Provide clear information so the problem can be understood
              properly.
            </p>
          </div>

          <div className="mt-7 space-y-6">

            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Problem Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Example: Broken road near local school"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              />
            </div>

            {/* Category + Priority */}
            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Priority
                </label>

                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                >
                  {priorities.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs text-slate-400">
                  Priority helps describe urgency. It is currently stored as
                  part of the form experience.
                </p>
              </div>

            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Problem Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what is happening, where it is happening and how it affects people..."
                rows={6}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              />
            </div>

          </div>

          {/* Location */}
          <div className="mt-10 border-t border-slate-100 pt-8">

            <h2 className="text-xl font-bold text-slate-900">
              Problem Location
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add the district and, if possible, your current coordinates.
            </p>

            <div className="mt-6 space-y-6">

              {/* District */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  District
                </label>

                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Example: Ranchi"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                />
              </div>

              {/* Location */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Current Location
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">

                  <div className="relative flex-1">
                    <MapPin
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={location}
                      readOnly
                      placeholder="Use the button to get your current location"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-600 outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-5 py-3 text-sm font-semibold text-teal-700 transition hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {locationLoading ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <MapPin size={17} />
                    )}

                    {locationLoading
                      ? "Getting Location..."
                      : "Use Current Location"}
                  </button>

                </div>

                {latitude !== null &&
                  longitude !== null && (
                    <p className="mt-2 text-xs text-slate-400">
                      Coordinates: {latitude}, {longitude}
                    </p>
                  )}
              </div>

            </div>
          </div>

          {/* Evidence */}
          <div className="mt-10 border-t border-slate-100 pt-8">

            <h2 className="text-xl font-bold text-slate-900">
              Evidence
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add a photo or video to help explain the problem.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              {/* Photo */}
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Camera size={21} />
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  Problem Photo
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Upload one photo. Maximum size: 300 KB.
                </p>

                <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700">
                  <Upload size={16} />
                  Choose Photo

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>

                {photo && (
                  <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                    <p className="truncate text-xs font-semibold text-emerald-700">
                      {photo.name}
                    </p>

                    <p className="mt-1 text-[11px] text-emerald-600">
                      {(photo.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                )}

              </div>

              {/* Video */}
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Video size={21} />
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  Problem Video
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Upload one video. Maximum size: 300 MB.
                </p>

                <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700">
                  <Upload size={16} />
                  Choose Video

                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                </label>

                {video && (
                  <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                    <p className="truncate text-xs font-semibold text-emerald-700">
                      {video.name}
                    </p>

                    <p className="mt-1 text-[11px] text-emerald-600">
                      {(video.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                )}

              </div>

            </div>
          </div>

          {/* Submit */}
          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-slate-100 pt-8 sm:flex-row sm:justify-end">

            <Link
              href="/problems"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Submitting...
                </>
              ) : (
                <>
                  <FileText size={17} />
                  Submit Problem
                </>
              )}
            </button>

          </div>

        </form>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-8 text-white">
        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">

          {/* Logo */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold">
                S
              </div>

              <div>
                <p className="font-semibold">
                  SamadhanX
                </p>

                <p className="text-sm text-slate-400">
                  Ideas → Action → Impact
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-slate-400 md:absolute md:left-1/2 md:-translate-x-1/2">
            <p>
              © 2026 SamadhanX. Building solutions that matter.
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap justify-center gap-5 text-sm text-slate-300">

            <Link
              href="/"
              className="transition hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/problems"
              className="transition hover:text-white"
            >
              Problems
            </Link>

          </div>

        </div>
      </footer>
    </main>
  );
}

