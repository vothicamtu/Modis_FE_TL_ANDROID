import apiClient from '../api/config';
import { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from '../types/auth/auth';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    console.log("URL đang gọi:", apiClient.defaults.baseURL + "auth/login"); 
    const response = await apiClient.post('auth/login', data);
    return response.data; 
  },

  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    console.log("URL đang gọi:", apiClient.defaults.baseURL + "auth/register"); 
    const response = await apiClient.post('auth/register', data);
    return response.data;
  }
};