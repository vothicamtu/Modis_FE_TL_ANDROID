import apiClient from '../api/config';
import { ProfileRespone } from '../types/auth/profile';
import { loadTokenFromStorage } from '../utils/token';

export const profileService = {
  getProfileById: async (id: string): Promise<ProfileRespone> => {
    const response = await apiClient.get(`users/${id}`);
    return response.data.data;
  },

  updateUsername: async (id: string, newValue: string) => {
    const response = await apiClient.put(`users/${id}/update-username`, {
      username: newValue,
    });
    return response.data;
  },

  updatePhone: async (id: string, newValue: string) => {
    const response = await apiClient.put(`users/${id}/update-phone`, {
      sdt: newValue,
    });
    return response.data;
  },

  updateMail: async (id: string, newValue: string) => {
    const response = await apiClient.put(`users/${id}/update-mail`, {
      mail: newValue,
    });
    return response.data;
  },

  changePassword: async (id: string, oldPass: string, newPass: string) => {
    const response = await apiClient.put(`users/${id}/change-password`, {
      oldPass,
      newPass,
    });
    return response.data;
  },

  updateAvatar: async (id: string, imageUri: string) => {
    const formData = new FormData();
    const normalizedUri = imageUri.startsWith("file://") || imageUri.startsWith("content://") ? imageUri : `file://${imageUri}`;
    let ext = normalizedUri.split('.').pop()?.toLowerCase() ?? 'jpg';
    if (!['jpg', 'jpeg', 'png', 'heic', 'webp'].includes(ext)) ext = 'jpg';
    const mimeType = ext === 'png' ? 'image/png' : ext === 'heic' ? 'image/heic' : 'image/jpeg';
    formData.append('avatar', {
      uri: normalizedUri,
      type: mimeType,
      name: `avatar_${id}.${ext}`,
    } as any);

    try {
      const token = await loadTokenFromStorage();
      const baseURL = apiClient.defaults.baseURL?.endsWith("/") ? apiClient.defaults.baseURL : `${apiClient.defaults.baseURL}/`;
      
      const response = await fetch(`${baseURL}users/${id}/update-avatar`, {
        method: "PUT",
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          // KHÔNG SET Content-Type ở đây
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Avatar update failed with status ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Lỗi tại profileService.updateAvatar:", error);
      throw error;
    }
  },
};
