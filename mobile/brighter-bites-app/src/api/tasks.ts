import apiClient from "./apiClient";

// Define the shape of the DailyRecord data returned from the backend
export interface DailyRecord {
    _id: string;
  child: string;
  date: string;
  morningBrush: { status: 'Pending' | 'Completed', completedAt: string | null };
  nightBrush: { status: 'Pending' | 'Completed', completedAt: string | null };
  customHabits: { habitId: string, name: string, status: 'Pending' | 'Completed' }[];
  dailyChallenge: { status: 'Pending' | 'Completed' };
  stars: { morningBrush: boolean, nightBrush: boolean, allHabits: boolean };
  challengeCompleted: boolean;
  starCount: number;
}

/**
 * Fetches the daily record for the currently logged-in child.
 * @param token - The child's JWT.
 * @returns The DailyRecord object for today.
 */
export const getTodaysTasksApi = async (token: string): Promise<DailyRecord> => {
  const response = await apiClient.get('/tasks/today', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Marks a specific task as complete.
 * @param taskType - The type of task (e.g., 'morningBrush', 'customHabit').
 * @param token - The child's JWT.
 * @param habitId - (Optional) The ID of the custom habit being completed.
 * @returns The updated DailyRecord object.
 */
export const completeTaskApi = async (
  taskType: string,
  token: string,
  habitId?: string
): Promise<DailyRecord> => {
  const response = await apiClient.post(
    `/tasks/${taskType}/complete`,
    { habitId }, // Body will contain habitId if it exists, otherwise it's an empty object
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

/**
 * Calls the backend to explicitly add a habit to a child's task list for the current day.
 * @param habitId - The ID of the habit to add.
 * @param childId - The ID of the child whose list to update.
 * @param token - The parent's authentication token.
 * @returns The updated DailyRecord object.
 */
export const addHabitToTodayApi = async (habitId: string, childId: string, token: string) => {
  const response = await apiClient.post(
    '/tasks/today/add-habit',
    { habitId, childId }, // The request body
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateTodayRecordApi = async (childId: string, token: string) => {
  const response = await apiClient.post(
    '/tasks/today/update',
    {childId},
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
    }
  );
  console.log("deleted for today");
  return response.data;
}