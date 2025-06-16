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
}

export function TaskCompletionChart({ tasks }: TaskCompletionChartProps) {
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

      // Prepare data for the last 7 days
      const last7Days = []
      const today = new Date()

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        last7Days.push(date)
      }

      // Calculate daily statistics
      const dailyStats = last7Days.map((date) => {
        const dayStart = new Date(date)
        dayStart.setHours(0, 0, 0, 0)
        const dayEnd = new Date(date)
        dayEnd.setHours(23, 59, 59, 999)

              const tasksCreated = tasks.filter((task) =>
        new Date(task.created) >= dayStart && new Date(task.created) <= dayEnd
      ).length

      const tasksCompleted = tasks.filter((task) =>
        task.isCompleted && new Date(task.updatedOn) >= dayStart && new Date(task.updatedOn) <= dayEnd
      ).length

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
              text: "Daily Task Activity (Last 7 Days)",
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
  }, [tasks])

  // Calculate summary stats
  const totalCreated = tasks.length
  const totalCompleted = tasks.filter((task) => task.isCompleted).length
  const completionRate = totalCreated > 0 ? Math.round((totalCompleted / totalCreated) * 100) : 0

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
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
            Total Created: <span className="font-medium text-blue-600">{totalCreated}</span>
          </span>
          <span>
            Total Completed: <span className="font-medium text-green-600">{totalCompleted}</span>
          </span>
        </div>
      </div>

      <div className="relative h-80">
        <canvas ref={chartRef} className="w-full h-full"></canvas>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Track your daily productivity and task completion patterns over time
      </div>
    </div>
  )
}
