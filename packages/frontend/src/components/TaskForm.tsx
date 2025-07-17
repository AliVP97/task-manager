import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import { Plus, X } from 'lucide-react';

interface TaskFormProps {
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose }) => {
  const { createTask } = useTask();
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      setError('Please enter a task description');
      return;
    }

    if (description.length > 500) {
      setError('Task description must be 500 characters or less');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await createTask(description.trim());
      setDescription('');
      onClose();
    } catch (error) {
      setError('Failed to create task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Add New Task</h2>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Task Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setError('');
            }}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={4}
            maxLength={500}
            placeholder="Enter a detailed description of your task..."
            disabled={isLoading}
          />
          <div className="flex justify-between items-center mt-2">
            <span className={`text-sm ${description.length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
              {description.length}/500 characters
            </span>
            {error && (
              <span className="text-sm text-red-500">{error}</span>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !description.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-all duration-200"
          >
            <Plus size={16} />
            {isLoading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;