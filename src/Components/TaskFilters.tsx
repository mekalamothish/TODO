"use client"

interface TaskFiltersProps {
  filter: "all" | "active" | "completed" | "overdue"
  onFilterChange: (filter: "all" | "active" | "completed" | "overdue") => void
}

export function TaskFilters({ filter, onFilterChange }: TaskFiltersProps) {
  const filters = [
    { key: "all" as const, label: "All" },
    { key: "active" as const, label: "Active" },
    { key: "completed" as const, label: "Completed" },
    { key: "overdue" as const, label: "Overdue" },
  ]

  return (
    <div className="flex bg-white rounded-lg p-1 mb-6 shadow-sm">
      {filters.map((filterType) => (
        <button
          key={filterType.key}
          onClick={() => onFilterChange(filterType.key)}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            filter === filterType.key ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          {filterType.label}
        </button>
      ))}
    </div>
  )
}
