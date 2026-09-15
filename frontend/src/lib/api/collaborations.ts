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

export interface Project {
  id: string;
  problem_id: string | null;
  solution_id: string | null;
  title: string;
  description: string | null;
  status: string | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
}

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

export async function getProject(
  projectId: string
): Promise<Project> {
  return apiRequest<Project>(`/api/projects/${projectId}`, {
    method: "GET",
  });
}