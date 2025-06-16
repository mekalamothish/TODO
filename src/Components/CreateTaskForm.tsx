"use client"

import type React from "react"

import { useState } from "react"
import type { CreateTaskRequest } from "../Types/ToDoTask"
import { taskService } from "../Services/TaskService"

interface CreateTaskFormProps {
  onTaskCreated: () => void
}

export function CreateTaskForm({ onTaskCreated }: CreateTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [deadLine, setDeadLine] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !deadLine) return

    setIsLoading(true)
    try {
      const taskData: CreateTaskRequest = {
        title: title.trim(),
        description: description.trim(),
        deadLine: new Date(deadLine),
      }

      const success = await taskService.createTask(taskData)

      if (success) {
        setTitle("")
        setDescription("")
        setDeadLine("")
        setIsOpen(false)
        onTaskCreated()
      }
    } catch (error) {
      console.error("Failed to create task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
      >
        <svg
          className="w-5 h-5 text-gray-400 group-hover:text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span className="text-gray-600 group-hover:text-blue-600 font-medium">Add New Task</span>
      </button>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Task Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
            Deadline *
          </label>
          <input
            type="date"
            id="deadline"
            value={deadLine}
            onChange={(e) => setDeadLine(e.target.value)}
            min={getTomorrowDate()}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading || !title.trim() || !deadLine}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </div>
            ) : (
              "Create Task"
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              setTitle("")
              setDescription("")
              setDeadLine("")
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
