import { apiRequest, getAuthToken } from "./client";

export interface University {
  id: string;
  name: string;
  expertise_area?: string[] | null;
  district?: string | null;
  department?: string | null;
}

export interface UniversityProblem {
  id: string;
  title: string;
  description?: string | null;
  district?: string | null;
  category?: string | null;
  severity_score?: number | null;
  image_url?: string | null;
  video_url?: string | null;
  match_score?: number | null;
  match_reasons?: string[];
  status?: string | null;
  ai_summary?: string | null;
  

  university_expertise?: string[];

  ai_analysis?: {
    subcategory?: string | null;
    severity_level?: string | null;
    affected_sector?: string | null;
    estimated_affected_people?: number | null;
    root_cause?: string | null;
    ai_summary?: string | null;
    keywords?: string[];
  };

  similar_problems?: {
    id: string;
    title: string;
    category?: string | null;
    district?: string | null;
  }[];
}

interface CurrentUser {
  id: string;
  auth_id?: string | null;
  full_name: string;
  email: string;
  role: string;
  university_id?: string | null;
  industry_id?: string | null;
}

async function getCurrentUser(): Promise<CurrentUser> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login first.");
  }

  return apiRequest<CurrentUser>("/api/auth/me", {
    method: "GET",
    token,
  });
}

function normalizeRole(role: string | null | undefined): string {
  return (role || "").trim().toLowerCase();
}

function canViewUniversityData(role: string): boolean {
  return ["university", "faculty", "student"].includes(role);
}

function canManageUniversityProblem(role: string): boolean {
  return ["university", "faculty"].includes(role);
}

export async function getUniversities(): Promise<University[]> {
  return apiRequest<University[]>("/api/universities", {
    method: "GET",
  });
}

export async function getUniversityProblems(
  universityId: string
): Promise<UniversityProblem[]> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await apiRequest<{
    problems: UniversityProblem[];
  }>(`/api/universities/${universityId}/problems`, {
    method: "GET",
    token,
  });

  return response.problems;
}

export async function getUniversityProblem(
  universityId: string,
  problemId: string
): Promise<UniversityProblem> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login first.");
  }

  return apiRequest<UniversityProblem>(
    `/api/universities/${universityId}/problems/${problemId}`,
    {
      method: "GET",
      token,
    }
  );
}

export async function getMyUniversityProblems(): Promise<
  UniversityProblem[]
> {
  const user = await getCurrentUser();
  const role = normalizeRole(user.role);

  if (!canViewUniversityData(role)) {
    throw new Error(
      "Only university, faculty, and student users can access this data."
    );
  }

  if (!user.university_id) {
    throw new Error("No university is linked to this account.");
  }

  return getUniversityProblems(user.university_id);
}

export async function acceptUniversityProblem(
  universityId: string,
  problemId: string
): Promise<UniversityProblem> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login first.");
  }

  const user = await getCurrentUser();
  const role = normalizeRole(user.role);

  if (!canManageUniversityProblem(role)) {
    throw new Error(
      "Only university and faculty users can accept problems."
    );
  }

  if (!user.university_id) {
    throw new Error("No university is linked to this account.");
  }

  if (user.university_id !== universityId) {
    throw new Error(
      "You can only manage problems for your own university."
    );
  }

  return apiRequest<UniversityProblem>(
    `/api/universities/${universityId}/problems/${problemId}/accept`,
    {
      method: "POST",
      token,
      body: JSON.stringify({}),
    }
  );
}

export async function rejectUniversityProblem(
  universityId: string,
  problemId: string
): Promise<UniversityProblem> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login first.");
  }

  const user = await getCurrentUser();
  const role = normalizeRole(user.role);

  if (!canManageUniversityProblem(role)) {
    throw new Error(
      "Only university and faculty users can reject problems."
    );
  }

  if (!user.university_id) {
    throw new Error("No university is linked to this account.");
  }

  if (user.university_id !== universityId) {
    throw new Error(
      "You can only manage problems for your own university."
    );
  }

  return apiRequest<UniversityProblem>(
    `/api/universities/${universityId}/problems/${problemId}/reject`,
    {
      method: "POST",
      token,
      body: JSON.stringify({
        reason:
          "University is currently unable to take up this problem.",
      }),
    }
  );
}

export async function getMyUniversityId(): Promise<string> {
  const user = await getCurrentUser();
  const role = normalizeRole(user.role);

  if (!canViewUniversityData(role)) {
    throw new Error(
      "Only university, faculty, and student users can access this data."
    );
  }

  if (!user.university_id) {
    throw new Error("No university is linked to this account.");
  }

  return user.university_id;
}