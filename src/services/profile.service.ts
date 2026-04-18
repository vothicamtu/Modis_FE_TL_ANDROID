import apiClient from '../api/config';
import { ProfileRespone } from '../types/auth/profile';

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

    const response = await apiClient.put(
      `users/${id}/update-avatar`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return response.data;
  },
};
