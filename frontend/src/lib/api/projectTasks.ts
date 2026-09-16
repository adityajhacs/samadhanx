import { apiRequest, getAuthToken } from "./client";

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  description?: string | null;
  assigned_to?: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  created_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CreateProjectTaskData {
  title: string;
  description?: string;
  assigned_to?: string | null;
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

export async function getProjectTasks(
  projectId: string
): Promise<ProjectTask[]> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login first.");
  }

  return apiRequest<ProjectTask[]>(
    `/api/project-tasks/project/${projectId}`,
    {
      method: "GET",
      token,
    }
  );
}

export async function createProjectTask(
  projectId: string,
  data: CreateProjectTaskData
): Promise<ProjectTask> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login first.");
  }

  return apiRequest<ProjectTask>(
    `/api/project-tasks/project/${projectId}`,
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
}

export async function updateProjectTask(
  taskId: string,
  data: Partial<CreateProjectTaskData>
): Promise<ProjectTask> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login first.");
  }

  return apiRequest<ProjectTask>(
    `/api/project-tasks/${taskId}`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(data),
    }
  );
}

export async function deleteProjectTask(
  taskId: string
): Promise<void> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login first.");
  }

  await apiRequest<void>(
    `/api/project-tasks/${taskId}`,
    {
      method: "DELETE",
      token,
    }
  );
}