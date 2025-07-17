import React, { createContext, useContext, useReducer, useEffect } from "react";

import { taskService } from "../services/taskService";

export interface Task {
  id: string;
  description: string;
  status: "pending" | "complete";
  created_at: string;
  updated_at: string;
}

export interface TaskFilters {
  status: "all" | "pending" | "complete";
  sort: "created_at" | "updated_at" | "description" | "status";
  order: "ASC" | "DESC";
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filters: TaskFilters;
}

type TaskAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "SET_FILTERS"; payload: Partial<TaskFilters> };

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  filters: {
    status: "all",
    sort: "created_at",
    order: "DESC",
  },
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_TASKS":
      return { ...state, tasks: action.payload, loading: false, error: null };
    case "ADD_TASK":
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    default:
      return state;
  }
};

interface TaskContextType {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
  fetchTasks: () => Promise<void>;
  createTask: (description: string) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  setFilters: (filters: Partial<TaskFilters>) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const fetchTasks = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const response = await taskService.getAllTasks({
        status:
          state.filters.status === "all" ? undefined : state.filters.status,
        sort: state.filters.sort,
        order: state.filters.order,
      });

      dispatch({ type: "SET_TASKS", payload: response.tasks });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch tasks" });
    }
  };

  const createTask = async (description: string) => {
    try {
      dispatch({ type: "SET_ERROR", payload: null });
      const response = await taskService.createTask({ description });
      dispatch({ type: "ADD_TASK", payload: response.task });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to create task" });
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      dispatch({ type: "SET_ERROR", payload: null });
      const response = await taskService.updateTask(id, updates);
      dispatch({ type: "UPDATE_TASK", payload: response.task });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to update task" });
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      dispatch({ type: "SET_ERROR", payload: null });
      await taskService.deleteTask(id);
      dispatch({ type: "DELETE_TASK", payload: id });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to delete task" });
      throw error;
    }
  };

  const toggleTaskStatus = async (id: string) => {
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return;

    const newStatus = task.status === "pending" ? "complete" : "pending";
    await updateTask(id, { ...task, status: newStatus });
  };

  const setFilters = (filters: Partial<TaskFilters>) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  };

  useEffect(() => {
    fetchTasks();
  }, [state.filters]);

  const value: TaskContextType = {
    state,
    dispatch,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    setFilters,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
