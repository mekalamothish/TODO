"use client"

import type { ToDoTask } from "../Types/ToDoTask"

interface TaskStatsProps {
  tasks: ToDoTask[]
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const completedCount = tasks.filter((task) => task.isCompleted).length
  const activeCount = tasks.length - completedCount
  const overdueCount = tasks.filter((task) => !task.isCompleted && new Date() > task.deadLine).length

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg p-4 text-center shadow-sm">
        <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
        <div className="text-sm text-gray-600">Total</div>
      </div>
      <div className="bg-white rounded-lg p-4 text-center shadow-sm">
        <div className="text-2xl font-bold text-orange-600">{activeCount}</div>
        <div className="text-sm text-gray-600">Active</div>
      </div>
      <div className="bg-white rounded-lg p-4 text-center shadow-sm">
        <div className="text-2xl font-bold text-green-600">{completedCount}</div>
        <div className="text-sm text-gray-600">Completed</div>
      </div>
      <div className="bg-white rounded-lg p-4 text-center shadow-sm">
        <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
        <div className="text-sm text-gray-600">Overdue</div>
      </div>
    </div>
  )
}
