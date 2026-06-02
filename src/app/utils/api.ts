// 1. Define the Base URL for your backend API
const BASE_URL =
  process.env.REACT_APP_API_URL || "https://api.ileadinitiative.com/v1";

// 2. Define TypeScript Interfaces for your data shapes
// This enforces strict type-checking so you always know exactly what your data looks like!
export interface UserRegistrationData {
  fullName: string;
  email: string;
  role: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 3. Create helper functions for your HTTP Methods
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`,
    );
  }
  return response.json();
}

// 4. Exported API Interactions
export const apiService = {
  /**
   * Submits a new user application/registration to the iLEAD platform
   */
  registerUser: async (
    userData: UserRegistrationData,
  ): Promise<ApiResponse<{ userId: string }>> => {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return handleResponse<{ userId: string }>(response);
  },

  /**
   * Fetches data or configuration settings needed for the platform
   */
  getPlatformStats: async (): Promise<
    ApiResponse<{ membersCount: number; coursesCount: number }>
  > => {
    const response = await fetch(`${BASE_URL}/platform/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleResponse<{ membersCount: number; coursesCount: number }>(
      response,
    );
  },
};
