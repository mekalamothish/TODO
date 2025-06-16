"use client"

import type React from "react"

import { useState } from "react"
import type { ToDoTask } from "../Types/ToDoTask"
import { taskService } from "../Services/TaskService"

interface EditTaskFormProps {
  task: ToDoTask
  onSave: (updatedTask: ToDoTask) => void
  onCancel: () => void
}

export function EditTaskForm({ task, onSave, onCancel }: EditTaskFormProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [deadLine, setDeadLine] = useState(() => {
  const date = new Date(task.deadLine)  // safer if it's a string from server
  return date.toISOString().split("T")[0]
})

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !deadLine) return

    setIsLoading(true)
    try {
      const updatedTask: ToDoTask = {
        ...task,
        title: title.trim(),
        description: description.trim(),
        deadLine: new Date(deadLine),
        updatedOn: new Date(),
      }

      const success = await taskService.updateTask(updatedTask)
      if (success) {
        onSave(updatedTask)
      }
    } catch (error) {
      console.error("Failed to update task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 text-lg font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        placeholder="Task description..."
        className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
      <input
        type="date"
        value={deadLine}
        onChange={(e) => setDeadLine(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading || !title.trim() || !deadLine}
          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
