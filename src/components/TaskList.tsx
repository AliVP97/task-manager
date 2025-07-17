import React from 'react';
import { useTask } from '../context/TaskContext';
import TaskItem from './TaskItem';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { CheckSquare, Clock, AlertCircle } from 'lucide-react';

const TaskList: React.FC = () => {
  const { state } = useTask();
  const { tasks, loading, error } = state;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <LoadingSpinner size="medium" />
        <p className="text-gray-600 mt-4">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <div className="text-gray-400 mb-4">
          <CheckSquare size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No tasks found</h3>
        <p className="text-gray-500">
          {state.filters.status === 'all' 
            ? "You haven't created any tasks yet. Click 'Add Task' to get started!"
            : `No ${state.filters.status} tasks found. Try adjusting your filters.`}
        </p>
      </div>
    );
  }

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedTasks = tasks.filter(task => task.status === 'complete');

  return (
    <div className="space-y-6">
      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center">
            <Clock className="text-blue-500 mr-2" size={20} />
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-blue-600">{pendingTasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
          <div className="flex items-center">
            <CheckSquare className="text-green-500 mr-2" size={20} />
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedTasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center">
            <AlertCircle className="text-purple-500 mr-2" size={20} />
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-purple-600">{tasks.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;