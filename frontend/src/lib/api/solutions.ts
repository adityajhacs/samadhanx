
import { apiRequest, getAuthToken } from "./client";

export interface Solution {
  id: string;

  problem_id?: string | null;
  university_id?: string | null;
  project_id?: string | null;

  solution_title: string;
  description?: string | null;

  prototype_status?: string | null;
  estimated_cost?: string | null;

  prototype_description?: string | null;
  how_it_works?: string | null;
  key_features?: string | null;
  problem_solution?: string | null;

  funding_received?: string | null;
  created_at?: string | null;
}

export interface CreateSolutionPayload {
  problem_id: string;
  university_id: string;
  project_id?: string | null;

  solution_title: string;
  description: string;

  prototype_status:
    | "IDEA"
    | "DESIGN"
    | "PROTOTYPE"
    | "FIELD_TEST"
    | "DEPLOYED";

  estimated_cost?: number | null;

  prototype_description?: string | null;
  how_it_works?: string | null;
  key_features?: string | null;
  problem_solution?: string | null;

  funding_received?: number;
}

export interface UpdateSolutionPayload {
  problem_id?: string;
  university_id?: string;
  project_id?: string | null;

  solution_title?: string;
  description?: string;

  prototype_status?:
    | "IDEA"
    | "DESIGN"
    | "PROTOTYPE"
    | "FIELD_TEST"
    | "DEPLOYED";

  estimated_cost?: number | null;

  prototype_description?: string | null;
  how_it_works?: string | null;
  key_features?: string | null;
  problem_solution?: string | null;

  funding_received?: number | null;
}

/*
 * Solution Memory
 */

export interface SolutionMemoryItem {
  id: string;

  solution_title: string;

  prototype_status?: string | null;
  estimated_cost?: string | null;
  funding_received?: string | null;

  similarity?: number | null;
  recommendation?: string | null;

  problem_id?: string | null;
  university_id?: string | null;
  project_id?: string | null;

  description?: string | null;
}

export interface SolutionMemoryResponse {
  problem_id: string;
  count: number;
  solutions: SolutionMemoryItem[];
}

/*
 * AI Solution Recommendation
 */

export interface SolutionRecommendation {
  solution_id?: string | null;
  problem_id?: string | null;

  relevance_explanation?: string | null;
  compatibility_score?: number | null;

  key_matches?: string[] | null;
  limitations?: string[] | null;

  confidence?: number | null;
}

/*
 * Get all solutions
 */

export async function getSolutions(
  filters?: {
    problem_id?: string;
    university_id?: string;
    project_id?: string;
    prototype_status?: string;
  }
): Promise<Solution[]> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login first.");
  }

  const params = new URLSearchParams();

  if (filters?.problem_id) {
    params.set("problem_id", filters.problem_id);
  }

  if (filters?.university_id) {
    params.set("university_id", filters.university_id);
  }

  if (filters?.project_id) {
    params.set("project_id", filters.project_id);
  }

  if (filters?.prototype_status) {
    params.set(
      "prototype_status",
      filters.prototype_status
    );
  }

  const queryString = params.toString();

  return apiRequest<Solution[]>(
    `/api/solutions${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
      token,
    }
  );
}

/*
 * Get one solution
 */

export async function getSolution(
  solutionId: string
): Promise<Solution> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login first.");
  }

  return apiRequest<Solution>(
    `/api/solutions/${solutionId}`,
    {
      method: "GET",
      token,
    }
  );
}

/*
 * Create solution
 */

export async function createSolution(
  data: CreateSolutionPayload
): Promise<Solution> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login first.");
  }

  return apiRequest<Solution>(
    "/api/solutions",
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
}

/*
 * Update solution
 */

export async function updateSolution(
  solutionId: string,
  data: UpdateSolutionPayload
): Promise<Solution> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login first.");
  }

  return apiRequest<Solution>(
    `/api/solutions/${solutionId}`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(data),
    }
  );
}

/*
 * Get Solution Memory
 *
 * Backend response:
 *
 * {
 *   problem_id: "...",
 *   count: 3,
 *   solutions: [...]
 * }
 *
 * This function returns only the solutions array so that
 * the recommendation page can directly use:
 *
 * memory.map(...)
 */

export async function getSolutionMemory(
  problemId: string,
  limit = 10
): Promise<SolutionMemoryItem[]> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login first.");
  }

  const response =
    await apiRequest<SolutionMemoryResponse>(
      `/api/problems/${problemId}/solution-memory?limit=${limit}`,
      {
        method: "GET",
        token,
      }
    );

  return response.solutions;
}

/*
 * Get AI Solution Recommendation
 */

export async function getSolutionRecommendation(
  problemId: string,
  solutionId: string
): Promise<SolutionRecommendation> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login first.");
  }

  return apiRequest<SolutionRecommendation>(
    `/api/problems/${problemId}/solution-recommendation/${solutionId}`,
    {
      method: "POST",
      token,
    }
  );
}
