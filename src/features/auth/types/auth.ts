export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  user: LoginUser;
}

export interface LoginResponse {
  success: boolean;
  data: LoginResponseData;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponseData {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  data: RefreshResponseData;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface OrganizationRoleDetails {
  id: string;
  name: string;
}

export interface OrganizationRole {
  id: string;
  role: OrganizationRoleDetails;
}

export interface MeUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  organizationId: string;
  systemRole: string | null;
  organizationRole: OrganizationRole;
}

export interface MeResponseData {
  user: MeUser;
}

export interface MeResponse {
  success: boolean;
  data: MeResponseData;
}
