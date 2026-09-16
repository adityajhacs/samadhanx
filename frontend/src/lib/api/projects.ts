import { apiRequest, getAuthToken } from "./client";

export interface Project {
  id: string;
  problem_id?: string | null;
  solution_id?: string | null;

  title: string;
  description?: string | null;
  status?: string | null;
  created_by?: string | null;

  member_count?: number;

  deadline?: string | null;
  progress?: number;

  budget?: number | null;
  expected_impact?: number | null;

  prototype_name?: string | null;
  prototype_url?: string | null;

  created_at?: string | null;
  updated_at?: string | null;
}

export async function getProjects(): Promise<Project[]> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login first.");
  }

  return apiRequest<Project[]>("/api/projects", {
    method: "GET",
    token,
  });
}
export async function getProject(projectId: string): Promise<Project> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login first.");
  }

  return apiRequest<Project>(`/api/projects/${projectId}`, {
    method: "GET",
    token,
  });
}
export async function updateProject(
  projectId: string,
  data: Partial<
    Pick<
      Project,
      | "title"
      | "description"
      | "status"
      | "deadline"
      | "progress"
      | "budget"
    >
  >
): Promise<Project> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login first.");
  }

  return apiRequest<Project>(
    `/api/projects/${projectId}`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(data),
    }
  );
}