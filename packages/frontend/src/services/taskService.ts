import axios from "axios";

const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Response error:", error);

    if (error.response?.status === 404) {
      throw new Error("Resource not found");
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data.message || "Invalid request");
    } else if (error.response?.status >= 500) {
      throw new Error("Server error. Please try again later.");
    } else if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    } else {
      throw new Error(error.response?.data?.message || "An error occurred");
    }
  }
);

export interface Task {
  id: string;
  description: string;
  status: "pending" | "complete";
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  description: string;
  status?: "pending" | "complete";
}

export interface UpdateTaskRequest {
  description?: string;
  status?: "pending" | "complete";
}

export interface GetTasksParams {
  status?: "pending" | "complete";
  sort?: "created_at" | "updated_at" | "description" | "status";
  order?: "ASC" | "DESC";
}

export interface TaskResponse {
  task: Task;
  message: string;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
  filters: {
    status?: string;
    sort: string;
    order: string;
  };
}

export const taskService = {
  async getAllTasks(params: GetTasksParams = {}): Promise<TasksResponse> {
    const response = await api.get<TasksResponse>("/tasks", { params });
    return response.data;
  },

  async getTask(id: string): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  async createTask(data: CreateTaskRequest): Promise<TaskResponse> {
    const response = await api.post<TaskResponse>("/tasks", data);
    return response.data;
  },

  async updateTask(id: string, data: UpdateTaskRequest): Promise<TaskResponse> {
    const response = await api.put<TaskResponse>(`/tasks/${id}`, data);
    return response.data;
  },

  async deleteTask(
    id: string
  ): Promise<{ message: string; deletedTask: Task }> {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};
