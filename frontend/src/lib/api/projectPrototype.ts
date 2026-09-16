import {
  getAuthToken,
} from "./client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export async function uploadProjectPrototype(
  projectId: string,
  file: File
) {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login first.");
  }

  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_URL}/api/projects/${projectId}/prototype`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    let message = "Failed to upload prototype.";

    try {
      const data = await response.json();

      if (typeof data.detail === "string") {
        message = data.detail;
      }
    } catch {}

    throw new Error(message);
  }

  return response.json();
}