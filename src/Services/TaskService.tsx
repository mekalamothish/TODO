import type { ToDoTask, CreateTaskRequest } from "../Types/ToDoTask"

const API_BASE_URL = "/api/Tasks" // Change to your actual API base

export const taskService = {
  async createTask(task: CreateTaskRequest): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    })
    return response.ok
  },

  async deleteTask(id: number): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    })
    return response.ok
  },

  async updateTask(task: ToDoTask): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    })
    return response.ok
  },

  async statusUpdate(id: number, status: boolean): Promise<boolean> {
    let sate: number = 0;
    if (status == true) {
      sate = 1;
    }
    const response = await fetch(`${API_BASE_URL}/${id}/${sate}`, {
      method: "PUT",
    })
    return response.ok
  },

  async getAllTasks(): Promise<ToDoTask[]> {
    const response = await fetch(`${API_BASE_URL}`)
    if (!response.ok) {
      throw new Error("Failed to fetch tasks")
    }
    return await response.json()
  },
}
