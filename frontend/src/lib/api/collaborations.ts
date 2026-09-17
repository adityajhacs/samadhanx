
import { apiRequest, getAuthToken } from "./client";

export type CollaborationType =
  | "FUNDING"
  | "MENTORSHIP"
  | "HARDWARE"
  | "TESTING"
  | "PROTOTYPING";

export type CollaborationStatus =
  | "REQUESTED"
  | "UNDER_REVIEW"
  | "ACCEPTED"
  | "REJECTED"
  | "COMPLETED";

export interface Collaboration {
  id: string;
  project_id: string | null;
  industry_partner_id: string | null;
  collaboration_type: CollaborationType | null;
  amount: number | null;
  status: CollaborationStatus | null;
  description: string | null;
  created_at: string | null;
}

export type ProjectTaskStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED";

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  assigned_to: string | null;
  status: ProjectTaskStatus;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Project {
  id: string;
  problem_id: string | null;
  solution_id: string | null;
  problem_name: string | null;
  solution_name: string | null;

  title: string;
  description: string | null;

  status: string | null;
  created_by: string | null;

  university_name: string | null;

  deadline: string | null;
  progress: number;

  budget: number | null;
  expected_impact: number | null;

  prototype_name: string | null;
  prototype_url: string | null;

  member_count: number;

  created_at: string | null;
  updated_at: string | null;
}

/**
 * Collaboration list.
 *
 * Collaboration data remains protected.
 */
export async function getCollaborations(): Promise<Collaboration[]> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  return apiRequest<Collaboration[]>("/api/collaborations", {
    method: "GET",
    token,
  });
}

/**
 * Project details.
 *
 * Any authenticated user can view projects.
 * Project membership is not required.
 */
export async function getProject(
  projectId: string
): Promise<Project> {
  const token = getAuthToken();

if (!token) {
  throw new Error("Authentication required");
}

return apiRequest<Project>(`/api/projects/${projectId}`, {
  method: "GET",
  token,
});
}

/**
 * Project tasks.
 *
 * Industry users can view tasks without being
 * members of the project.
 */
export async function getProjectTasks(
  projectId: string
): Promise<ProjectTask[]> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  return apiRequest<ProjectTask[]>(
    `/api/project-tasks/project/${projectId}`,
    {
      method: "GET",
      token,
    }
  );
}

export interface CollaborationCreate {
  project_id: string;
  industry_partner_id: string;
  collaboration_type: CollaborationType;
  amount?: number | null;
  description?: string | null;
}

export async function createCollaboration(
  data: CollaborationCreate
): Promise<Collaboration> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  return apiRequest<Collaboration>(
    "/api/collaborations",
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
}



