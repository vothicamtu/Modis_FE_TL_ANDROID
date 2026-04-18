export interface LoginRequest {
  username: string;
  password: string; 
}

export interface LoginResponse {
  token: string;
  id: string;
  username: string;
}

export interface SignupRequest {
  username: string;
  password: string;
  fullname: string;
  mail: string;
  sdt: string
}

export interface SignupResponse {
  token: string;
  id: string;
  username: string;
}