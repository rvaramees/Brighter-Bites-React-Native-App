import apiClient from './apiClient';

// --- INTERFACES ---

// This interface defines the full structure of a Habit object
// as it exists in the database and is returned by the API.
export interface Habit {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  parent: string;
  child: string;
  createdAt: string;
  updatedAt: string;
}

// This interface defines the data required to CREATE a new habit.
// `name` and `childId` are required.
// `description` and `icon` are optional.
export interface CreateHabitData {
  name: string;
  description?: string;
  childId: string;
  icon?: string;
}

// This interface defines the data that can be sent to UPDATE a habit.
// All fields are optional because the user might only want to change one thing.
export interface UpdateHabitData {
  name?: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
}


// --- API FUNCTIONS ---

/**
 * Creates a new habit for a child.
 * @param habitData - The data for the new habit (name, childId, and optional fields).
 * @param token - The parent's JWT.
 * @returns The newly created Habit object.
 */
export const createHabitApi = async (habitData: CreateHabitData, token: string): Promise<Habit> => {
  console.log("Initiating request");  
  const response = await apiClient.post<Habit>('/habit/add', habitData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log(response.data);
    return response.data;
};

/**
 * Fetches habits. For a parent, requires childId. For a child, fetches their own.
 * @param token - The user's (parent or child) JWT.
 * @param childId - (Optional) The ID of the child whose habits to fetch (for parents).
 * @returns An array of Habit objects.
 */
export const getHabitsApi = async (token: string, childId?: string): Promise<Habit[]> => {
  const response = await apiClient.get('/habit', {
    headers: { Authorization: `Bearer ${token}` },
    params: { childId },
  });
  return response.data;
};

/**
 * Updates an existing habit.
 * @param habitId - The ID of the habit to update.
 * @param updateData - An object containing the fields to update.
 * @param token - The parent's JWT.
 * @returns The updated Habit object.
 */
export const updateHabitApi = async (habitId: string, updateData: UpdateHabitData, token: string): Promise<Habit> => {
  const response = await apiClient.put<Habit>(`/habit/${habitId}`, updateData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

/**
 * Deletes a habit.
 * @param habitId - The ID of the habit to delete.
 * @param token - The parent's JWT.
 * @returns A success message from the backend.
 */
export const deleteHabitApi = async (habitId: string, token: string): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`/habit/${habitId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};