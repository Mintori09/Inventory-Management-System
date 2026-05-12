export type UserRole = "admin" | "staff";

export type AuthUser = {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

export type LoginPayload = {
  email: string;
  password: string;
};
