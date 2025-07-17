import React from 'react';
import { useTask } from '../context/TaskContext';
import { Filter, SortAsc, SortDesc } from 'lucide-react';

const TaskFilters: React.FC = () => {
  const { state, setFilters } = useTask();
  const { filters } = state;

  const statusOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'complete', label: 'Completed' }
  ];

  const sortOptions = [
    { value: 'created_at', label: 'Date Created' },
    { value: 'updated_at', label: 'Date Updated' },
    { value: 'description', label: 'Description' },
    { value: 'status', label: 'Status' }
  ];

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <Filter size={16} className="text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filters:</span>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <label htmlFor="status-filter" className="text-sm text-gray-600">
          Status:
        </label>
        <select
          id="status-filter"
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value as any })}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Filter */}
      <div className="flex items-center gap-2">
        <label htmlFor="sort-filter" className="text-sm text-gray-600">
          Sort by:
        </label>
        <select
          id="sort-filter"
          value={filters.sort}
          onChange={(e) => setFilters({ sort: e.target.value as any })}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Order */}
      <button
        onClick={() => setFilters({ order: filters.order === 'ASC' ? 'DESC' : 'ASC' })}
        className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors duration-200"
        title={`Sort ${filters.order === 'ASC' ? 'Descending' : 'Ascending'}`}
      >
        {filters.order === 'ASC' ? (
          <SortAsc size={16} />
        ) : (
          <SortDesc size={16} />
        )}
        <span>{filters.order === 'ASC' ? 'Ascending' : 'Descending'}</span>
      </button>
    </div>
  );
};

export default TaskFilters;