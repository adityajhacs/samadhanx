
import { apiRequest, getAuthToken } from "./client";

export interface Cluster {
  cluster_id: string;
  name: string;
  common_theme: string | null;
  possible_root_cause: string | null;
  problem_count: number;
}

export interface ClusterAnalysis {
  cluster_id: string;
  common_theme: string | null;
  possible_root_cause: string | null;
}

export interface BuildClustersResponse {
  message: string;
  cluster_count: number;
  clusters: Array<{
    cluster_id: string;
    name: string;
    problem_ids: string[];
  }>;
}

export async function getClusters(): Promise<Cluster[]> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  return apiRequest<Cluster[]>("/api/clusters", {
    method: "GET",
    token,
  });
}

export async function buildClusters(): Promise<BuildClustersResponse> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  return apiRequest<BuildClustersResponse>("/api/clusters/build", {
    method: "POST",
    token,
  });
}

export async function analyzeCluster(
  clusterId: string
): Promise<ClusterAnalysis> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  return apiRequest<ClusterAnalysis>(
    `/api/clusters/${clusterId}/analyze`,
    {
      method: "POST",
      token,
    }
  );
}

export async function getClusterAnalysis(
  clusterId: string
): Promise<ClusterAnalysis> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  return apiRequest<ClusterAnalysis>(
    `/api/clusters/${clusterId}/analysis`,
    {
      method: "GET",
      token,
    }
  );
}

