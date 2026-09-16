import { apiRequest, getAuthToken } from "./client";

export interface ProjectMemberDetail {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
  project_role?: string | null;
  joined_at?: string | null;
}

export async function getProjectMemberDetails(
  projectId: string
): Promise<ProjectMemberDetail[]> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login first.");
  }

  return apiRequest<ProjectMemberDetail[]>(
    `/api/projects/${projectId}/members/details`,
    {
      method: "GET",
      token,
    }
  );
}