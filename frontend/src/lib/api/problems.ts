
import {
  apiRequest,
  getAuthToken,
} from "./client";

export interface Problem {
  id: string;
  citizen_id?: string;
  title: string;
  description: string;
  district?: string;
  category?: string;
  severity_score?: number | null;
  status?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  image_url?: string | null;
  video_url?: string | null;
  created_at?: string;
}

export interface CreateProblemRequest {
  title: string;
  description: string;
  district: string;
  category?: string;
  latitude?: number | null;
  longitude?: number | null;
  image_url?: string | null;
  video_url?: string | null;
}

export interface UploadProblemFileResponse {
  url: string;
  type: "image" | "video";
}

/**
 * Get all problems
 */
export async function getProblems(): Promise<Problem[]> {
  const token = getAuthToken();

  return apiRequest<Problem[]>("/api/problems/", {
    method: "GET",
    token: token ?? undefined,
  });
}

/**
 * Get a single problem
 */
export async function getProblem(
  problemId: string
): Promise<Problem> {
  const token = getAuthToken();

  return apiRequest<Problem>(
    `/api/problems/${problemId}`,
    {
      method: "GET",
      token: token ?? undefined,
    }
  );
}

/**
 * Create a new problem
 */
export async function createProblem(
  data: CreateProblemRequest
): Promise<Problem> {
  const token = getAuthToken();

  return apiRequest<Problem>("/api/problems/", {
    method: "POST",
    body: JSON.stringify(data),
    token: token ?? undefined,
  });
}

/**
 * Update an existing problem
 */
export async function updateProblem(
  problemId: string,
  data: Partial<CreateProblemRequest>
): Promise<Problem> {
  const token = getAuthToken();

  return apiRequest<Problem>(
    `/api/problems/${problemId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
      token: token ?? undefined,
    }
  );
}

/**
 * Upload problem image/video
 *
 * Important:
 * Do NOT use apiRequest() here because the request
 * must be multipart/form-data instead of application/json.
 */
export async function uploadProblemFile(
  file: File
): Promise<UploadProblemFileResponse> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  const formData = new FormData();
  formData.append("file", file);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000";

  const response = await fetch(
    `${API_URL}/api/problems/upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    let errorMessage = `Upload failed: ${response.status}`;

    try {
      const errorData = await response.json();

      if (typeof errorData.detail === "string") {
        errorMessage = errorData.detail;
      } else if (errorData.detail) {
        errorMessage = JSON.stringify(errorData.detail);
      }
    } catch {
      // Keep default error message
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

