"use client"

import { useState } from "react"

interface DateRangePickerProps {
  startDate: Date
  onDateRangeChange: (startDate: Date, endDate: Date) => void
}

export function DateRangePicker({ startDate, onDateRangeChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(startDate)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const handleDateSelect = (date: Date) => {
    const endDate = new Date(date)
    endDate.setDate(endDate.getDate() + 6) // 7 days total
    setSelectedDate(date)
    onDateRangeChange(date, endDate)
    setIsOpen(false)
  }

  const formatDateRange = (start: Date) => {
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    return `${start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth)
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    const firstDayWeekday = firstDayOfMonth.getDay()
    const daysInMonth = lastDayOfMonth.getDate()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
    }

    return days
  }

  const isDateSelected = (date: Date) => {
    const endDate = new Date(selectedDate)
    endDate.setDate(endDate.getDate() + 6)
    return date >= selectedDate && date <= endDate
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isFutureDate = (date: Date) => {
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    return date > today
  }

  const quickRanges = [
    {
      label: "Last 7 Days",
      getStartDate: () => {
        const date = new Date()
        date.setDate(date.getDate() - 6)
        return date
      },
    },
    {
      label: "This Week",
      getStartDate: () => {
        const date = new Date()
        const day = date.getDay()
        const diff = date.getDate() - day
        return new Date(date.setDate(diff))
      },
    },
    {
      label: "Previous Week",
      getStartDate: () => {
        const date = new Date()
        const day = date.getDay()
        const diff = date.getDate() - day - 7
        return new Date(date.setDate(diff))
      },
    },
    {
      label: "2 Weeks Ago",
      getStartDate: () => {
        const date = new Date()
        date.setDate(date.getDate() - 13)
        return date
      },
    },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      >
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-sm font-medium text-gray-700">{formatDateRange(selectedDate)}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 min-w-80">
          {/* Quick Range Buttons */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Select</h4>
            <div className="flex flex-wrap gap-2">
              {quickRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => handleDateSelect(range.getStartDate())}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div>
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                title="Previous month"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <h4 className="text-sm font-medium text-gray-700">
                {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h4>

              <button
                onClick={() => navigateMonth("next")}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                title="Next month"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1"
              title="Close calendar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-xs font-medium text-gray-500 text-center py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {generateCalendarDays().map((date, index) => (
                <div key={index} className="aspect-square">
                  {date && (
                    <button
                      onClick={() => handleDateSelect(date)}
                      disabled={isFutureDate(date)}
                      className={`w-full h-full text-xs rounded-md transition-colors ${
                        isDateSelected(date)
                          ? "bg-blue-600 text-white"
                          : isToday(date)
                            ? "bg-blue-100 text-blue-700 font-medium"
                            : isFutureDate(date)
                              ? "text-gray-300 cursor-not-allowed"
                              : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-500 text-center">
            Navigate months with arrows • Click any date to view 7-day period
          </div>
        </div>
      )}
    </div>
  )
}
