import { apiRequest, getAuthToken } from "./client";

export interface SupportResponse {
  supported: boolean;
  supporters: number;
  message: string;
}

export interface SupportCountResponse {
  supported: boolean;
  supporters: number;
}

export interface FeedbackResponse {
  message: string;
}

export async function getSupportCount(
  problemId: string
): Promise<SupportCountResponse> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login to view support status.");
  }

  return apiRequest<SupportCountResponse>(
    `/api/problems/${problemId}/support`,
    {
      method: "GET",
      token,
    }
  );
}
export async function supportProblem(
  problemId: string
): Promise<SupportResponse> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login to support this problem.");
  }

  return apiRequest<SupportResponse>(
    `/api/problems/${problemId}/support`,
    {
      method: "POST",
      token,
    }
  );
}

export async function submitFeedback(
  problemId: string,
  feedback: string
): Promise<FeedbackResponse> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login to submit feedback.");
  }

  return apiRequest<FeedbackResponse>(
    `/api/problems/${problemId}/feedback`,
    {
      method: "POST",
      body: JSON.stringify({
        feedback,
      }),
      token,
    }
  );
}