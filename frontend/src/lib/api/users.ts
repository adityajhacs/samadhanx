import { apiRequest, getAuthToken } from "./client";

export interface UniversityMember {
  id: string;
  full_name: string;
  email: string;
  role: string;
  university_id?: string | null;
}

export async function getUniversityMembers(): Promise<
  UniversityMember[]
> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Please login first.");
  }

  return apiRequest<UniversityMember[]>(
    "/api/users/university-members",
    {
      method: "GET",
      token,
    }
  );
}