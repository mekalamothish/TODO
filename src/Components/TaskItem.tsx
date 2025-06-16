"use client"

import { useState } from "react"
import type { ToDoTask } from "../Types/ToDoTask"
import { taskService } from "../Services/TaskService"
import { EditTaskForm } from "./EditTaskForm"

interface TaskItemProps {
  task: ToDoTask
  onUpdate: (task: ToDoTask) => void
  onDelete: (id: number) => void
  onStatusChange: (id: number, status: boolean) => void
}

export function TaskItem({ task, onUpdate, onDelete, onStatusChange }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const handleStatusToggle = async () => {
    setIsUpdatingStatus(true)
    try {
      const newStatus = !task.isCompleted
      const success = await taskService.statusUpdate(task.id, newStatus)
      if (success) {
       onStatusChange(task.id,newStatus)
      }
      
    } catch (error) {
      console.error("Failed to update status:", error)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const success = await taskService.deleteTask(task.id)
      if (success) {
        onDelete(task.id)
      }
    } catch (error) {
      console.error("Failed to delete task:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSave = (updatedTask: ToDoTask) => {
    onUpdate(updatedTask)
    setIsEditing(false)
  }

  const now = Date.now();
  const deadline = new Date(task.deadLine).getTime();
  const timeDiff = deadline - now;

  const isOverdue = now > deadline && !task.isCompleted;
  const isDueSoon = !task.isCompleted && timeDiff > 0 && timeDiff <= 24 * 60 * 60 * 1000;



  if (isEditing) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <EditTaskForm  task={task} onSave={handleSave} onCancel={() => setIsEditing(false)} />
      </div>
    )
  }

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-all ${
        task.isCompleted ? "opacity-75" : ""
      } ${isOverdue ? "border-red-300 bg-red-50" : ""}`}
    >
      <div className="flex items-start gap-3">
        <button onClick={handleStatusToggle} disabled={isUpdatingStatus} className="mt-1 flex-shrink-0">
          {task.isCompleted ? (
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-gray-400 hover:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-medium ${task.isCompleted ? "line-through text-gray-500" : "text-gray-900"}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`mt-1 text-sm ${task.isCompleted ? "line-through text-gray-400" : "text-gray-600"}`}>
              {task.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="text-gray-400"> Created: {new Date(task.created).toLocaleDateString()}</span>
            <span
              className={`px-2 py-1 rounded-full ${
                isOverdue
                  ? "bg-red-100 text-red-800"
                  : isDueSoon
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-blue-100 text-blue-800"
              }`}
            >
              Due: {new Date(task.deadLine).toLocaleDateString()}
              {isOverdue && " (Overdue)"}
              {isDueSoon && !isOverdue && " (Due Soon)"}
            </span>
            {
            new Date(task.updatedOn).getTime() !== new Date(task.created).getTime() && (
              <span className="text-gray-400">
                Updated: {new Date(task.updatedOn).toLocaleDateString()}
              </span>
            )
          }
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
            title="Delete task"
          >
            {isDeleting ? (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
