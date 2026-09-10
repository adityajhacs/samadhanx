import {
  apiRequest,
  setAuthToken,
  removeAuthToken,
} from "./client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role?: string;
  name?: string;
}


export interface AuthResponse {
  access_token: string | null;
  refresh_token?: string | null;
  token_type: string;
  user?: AuthUser;
}



export async function login(
  data: LoginRequest
): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  if (response.access_token) {
    setAuthToken(response.access_token);
  }

  return response;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  return apiRequest<AuthUser>("/api/auth/me", {
    method: "GET",
    token,
  });
}

export function logout() {
  removeAuthToken();
}
export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role: string;
}


export async function register(
  data: RegisterRequest
): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>(
    "/api/auth/register",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  if (response.access_token) {
    setAuthToken(response.access_token);
  }

  return response;
}
