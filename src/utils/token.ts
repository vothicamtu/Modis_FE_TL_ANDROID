// src/utils/token.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveToken = async (token: any) => {
  try {

    await AsyncStorage.setItem("userToken", token);
  } catch (error) {
    console.log("Error saving token:", error);
  }
};

export const loadTokenFromStorage = async () => {
  try {
    return await AsyncStorage.getItem("userToken");
  } catch (error) {
    console.log("Error loading token:", error);
    return null;
  }
};

export const removeToken = async () => {
  try {

    await AsyncStorage.removeItem("userToken");
  } catch (error) {
    console.log("Error removing token:", error);
  }
};
