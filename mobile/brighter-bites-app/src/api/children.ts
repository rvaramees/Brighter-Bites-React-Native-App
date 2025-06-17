import apiClient from './apiClient'; // Your configured axios instance
import { useAuth } from '../hooks/useAuth';

// Define the shape of a Child object, matching your backend model
export interface Child {
  _id: string;
  name: string;
  age: number;
  avatar?: string;
  points: number;
}

export interface NewChildData {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Prefer not to say';
  password: string; // The 4-digit password
  preferences: {
    morningBrushTime: string; // e.g., "08:00"
    nightBrushTime: string;   // e.g., "20:00"
  }; 
}

export interface ChildResponse {
  _id: string;
  name: string;
  age: number;
}

/**
 * Fetches the list of children for the currently logged-in parent.
 * It requires the auth token to be passed for the header.
 * @param token - The parent's JWT.
 * @returns A promise that resolves to an array of Child objects.
 */
export const getMyChildrenApi = async (token: string): Promise<Child[]> => {
  const response = await apiClient.get<Child[]>('/children/my-children', {
    headers: {
      // Set the Authorization header for this specific request
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Calls the backend API to add a new child for the currently logged-in parent.
 * @param childData - The data for the new child.
 * @param token - The parent's JWT for authentication.
 * @returns The newly created child object.
 */
export const addChildApi = async (childData: NewChildData, token: string): Promise<ChildResponse> => {
  const response = await apiClient.post<ChildResponse>('/children/add', childData, {
    headers: {
      // Attach the parent's token to the request header for authorization
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};