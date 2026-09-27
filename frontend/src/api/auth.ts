import { api } from "./client";
import { User } from "../types";

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export async function registerRequest(name: string, email: string, password: string) {
  const { data } = await api.post<AuthResponse>("/auth/register", { name, email, password });
  return data;
}

export async function loginRequest(email: string, password: string) {
  const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
  return data;
}
