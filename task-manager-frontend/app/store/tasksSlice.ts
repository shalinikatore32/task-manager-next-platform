import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { TaskWithoutId } from "../tasks/new/page";

import { Task } from "./types";

interface TasksState {
  list: Task[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TasksState = {
  list: [],
  status: "idle",
  error: null,
};

// Async thunks for API calls
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const response = await fetch("http://localhost:5000/tasks");
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json() as Promise<Task[]>;
});

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (newTask: TaskWithoutId) => {
    const response = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });
    if (!response.ok) {
      throw new Error("Failed to add task");
    }
    return response.json() as Promise<Task>;
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (updatedTask: Task) => {
    const response = await fetch(
      `http://localhost:5000/tasks/${updatedTask._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update task");
    }
    return response.json() as Promise<Task>;
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string) => {
    const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete task");
    }
    return taskId;
  }
);

// Slice
const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.list.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.list.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.list = state.list.filter((task) => task._id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
