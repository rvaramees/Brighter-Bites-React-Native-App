import apiClient from './apiClient';
import { 
         ParentLoginCredentials,
         ParentLoginResponse, 
         ParentRegisterCredentials, 
         ParentRegisterResponse 
       } from '../types'; // Assume you have these types

export const registerParent = async (credentials: ParentRegisterCredentials): Promise<ParentRegisterResponse> => {
  try {
    const response = await apiClient.post<ParentRegisterResponse>('/auth/parent/register', credentials);
    return response.data;
  } catch (error: any) {
    // Log the detailed error from the server if available
    console.error('Registration API error:', error.response?.data || error.message);
    // Re-throw the error so the UI component can handle it
    throw error;
  }
};

export const loginParent = async (credentials: ParentLoginCredentials): Promise<ParentLoginResponse> => {
  try {
    const response = await apiClient.post<ParentLoginResponse>('/auth/parent/login', credentials);
    // Axios wraps the response in a `data` object
    return response.data;
  } catch (error: any) {
    // It's better to let the calling component handle the error popup
    // so it can manage its own loading state.
    console.error('Login API error:', error.response?.data || error.message);
    throw error;
  }
};