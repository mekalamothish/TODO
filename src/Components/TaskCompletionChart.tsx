"use client"

import { useEffect, useRef } from "react"
import type { ToDoTask } from "../Types/ToDoTask"

// Chart.js imports
declare global {
  interface Window {
    Chart: any
  }
}

interface TaskCompletionChartProps {
  tasks: ToDoTask[]
  startDate: Date
  endDate: Date
}

export function TaskCompletionChart({ tasks, startDate, endDate }: TaskCompletionChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<any>(null)

  useEffect(() => {
    // Load Chart.js dynamically
    const loadChartJS = async () => {
      if (typeof window !== "undefined" && !window.Chart) {
        const script = document.createElement("script")
        script.src = "https://cdn.jsdelivr.net/npm/chart.js"
        script.async = true
        document.head.appendChild(script)

        return new Promise((resolve) => {
          script.onload = resolve
        })
      }
    }

    const initChart = async () => {
      await loadChartJS()

      if (!chartRef.current || !window.Chart) return

      // Destroy existing chart if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }

      // Generate 7 days from startDate
      const chartDays = []
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i)
        chartDays.push(date)
      }

      // Calculate daily statistics for the selected period
      const dailyStats = chartDays.map((date) => {
        const dayStart = new Date(date)
        dayStart.setHours(0, 0, 0, 0)
        const dayEnd = new Date(date)
        dayEnd.setHours(23, 59, 59, 999)

        const tasksCreated = tasks.filter((task) => new Date(task.created).getDate() >= dayStart.getDate() && new Date(task.created).getDate() <= dayEnd.getDate()).length

             const tasksCompleted = tasks.filter((task) =>
        task.isCompleted && new Date(task.updatedOn).getDate() >= dayStart.getDate() && new Date(task.updatedOn).getDate() <= dayEnd.getDate()).length


        return {
          date: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
          created: tasksCreated,
          completed: tasksCompleted,
        }
      })

      const ctx = chartRef.current.getContext("2d")

      chartInstanceRef.current = new window.Chart(ctx, {
        type: "line",
        data: {
          labels: dailyStats.map((stat) => stat.date),
          datasets: [
            {
              label: "Tasks Created",
              data: dailyStats.map((stat) => stat.created),
              borderColor: "rgb(59, 130, 246)",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: "rgb(59, 130, 246)",
              pointBorderColor: "white",
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8,
            },
            {
              label: "Tasks Completed",
              data: dailyStats.map((stat) => stat.completed),
              borderColor: "rgb(34, 197, 94)",
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: "rgb(34, 197, 94)",
              pointBorderColor: "white",
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: `Task Activity - ${startDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })} to ${endDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}`,
              font: {
                size: 16,
                weight: "bold",
              },
              color: "#374151",
              padding: 20,
            },
            legend: {
              display: true,
              position: "top",
              labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                  size: 12,
                },
              },
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleColor: "white",
              bodyColor: "white",
              borderColor: "rgba(255, 255, 255, 0.1)",
              borderWidth: 1,
              cornerRadius: 8,
              displayColors: true,
              callbacks: {
                title: (context: any) => `${context[0].label}`,
                label: (context: any) => `${context.dataset.label}: ${context.parsed.y} tasks`,
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: "#6B7280",
                font: {
                  size: 11,
                },
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
              },
              ticks: {
                color: "#6B7280",
                font: {
                  size: 11,
                },
                stepSize: 1,
              },
            },
          },
          interaction: {
            intersect: false,
            mode: "index",
          },
          elements: {
            line: {
              borderJoinStyle: "round",
            },
          },
        },
      })
    }

    initChart()

    // Cleanup function
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [tasks, startDate, endDate])

  // Calculate summary stats for the selected period
  const periodTasks = tasks.filter((task) => new Date(task.created).getDate() >= startDate.getDate() && new Date(task.created).getDate() <= endDate.getDate())
  const periodCompleted = tasks.filter(
    (task) => task.isCompleted &&  new Date(task.updatedOn).getDate() >= startDate.getDate() &&  new Date(task.updatedOn).getDate() <= endDate.getDate(),
  )

  const totalCreated = periodTasks.length
  const totalCompleted = periodCompleted.length
  const completionRate = totalCreated > 0 ? Math.round((totalCompleted / totalCreated) * 100) : 0

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm ">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-900">Task Completion Trends</h2>
          <div className="flex gap-4 text-sm">
            <span className="text-gray-600">
              Completion Rate: <span className="font-semibold text-green-600">{completionRate}%</span>
            </span>
          </div>
        </div>
        <div className="flex gap-6 text-sm text-gray-600">
          <span>
            Created in Period: <span className="font-medium text-blue-600">{totalCreated}</span>
          </span>
          <span>
            Completed in Period: <span className="font-medium text-green-600">{totalCompleted}</span>
          </span>
        </div>
      </div>

      <div className="relative h-80">
        <canvas ref={chartRef} className="w-full h-full"></canvas>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Track your productivity and task completion patterns for the selected 7-day period
      </div>
    </div>
  )
}
