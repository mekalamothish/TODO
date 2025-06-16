"use client"

import { useState, useEffect } from "react"
import type { ToDoTask } from "./Types/ToDoTask"
import { taskService } from "./Services/TaskService"
import { CreateTaskForm } from "./Components/CreateTaskForm"
import { TaskItem } from "./Components/TaskItem"
import { TaskStats } from "./Components/TaskStats"
import { TaskFilters } from "./Components/TaskFilters"
import { TaskCompletionChart } from "./Components/TaskCompletionChart"
import { DateRangePicker } from "./Components/DateRangePicker"

interface ToDoAppProbs{
  searchTerm :string;
}
export default function TodoApp({searchTerm}:ToDoAppProbs) {
  const [tasks, setTasks] = useState<ToDoTask[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "overdue">("all")

    // Chart date range state - default to last 7 days
  const [chartStartDate, setChartStartDate] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() - 6)
    return date
  })
const [chartEndDate, setChartEndDate] = useState(new Date())

  const loadTasks = async () => {
    setIsLoading(true)
    try {
      const allTasks = await taskService.getAllTasks()
      setTasks(allTasks)
      
    } catch (error) {
      console.error("Failed to load tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  
  useEffect(() => {
    loadTasks();
    // const intervalId = setInterval(() => {
    //   loadTasks();
    // },5000)

    // return () => clearInterval(intervalId) // Clean up on unmount
  }, [])

  const handleTaskCreated = () => {
    loadTasks()
  }

  const handleTaskUpdate = (updatedTask: ToDoTask) => {
    setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
  }

  const handleTaskDelete = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const handleStatusChange = (id: number, status: boolean) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, isCompleted: status, UpdatedOn: new Date() } : task)),
    )
  }
    const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setChartStartDate(startDate)
    setChartEndDate(endDate)
  }
   let filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  )
  filteredTasks = filteredTasks.filter((task) => {
    if (filter === "active") return !task.isCompleted
    if (filter === "completed") return task.isCompleted
    if (filter === "overdue") return !task.isCompleted && new Date() > task.deadLine
    return true
  })
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <svg className="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full mx-auto px-4 lg:px-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Todo Management</h1>
          <p className="text-gray-600">Stay organized and meet your deadlines</p>
        </div>

        {/* Stats */}
        <TaskStats tasks={tasks} />

        {/* Filter Tabs */}
        <TaskFilters filter={filter} onFilterChange={setFilter} />
        <div className="flex gap-4 flex-col-reverse sm:flex-row justify-center"> 
        <div className="sm:w-1/2 w-full">
        {/* Create Task Form */}
        <div className="mb-6">
          <CreateTaskForm onTaskCreated={handleTaskCreated} />
        </div>
        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {filter === "all" ? "No tasks yet" : `No ${filter} tasks`}
              </h3>
              <p className="text-gray-500">
                {filter === "all"
                  ? "Create your first task to get started"
                  : `You have no ${filter} tasks at the moment`}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={handleTaskUpdate}
                onDelete={handleTaskDelete}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </div>
        </div>
        <div className="sm:w-1/2 w-full">
       {/* Chart Section with Date Range Picker */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h2>
            <DateRangePicker startDate={chartStartDate} onDateRangeChange={handleDateRangeChange} />
          </div>
          <div className="bg-gray-50 rounded-lg p-1">
            <TaskCompletionChart tasks={tasks} startDate={chartStartDate} endDate={chartEndDate} />
          </div>
        </div>
        </div>
        </div>
    </div> 
    </div>
  )
}
