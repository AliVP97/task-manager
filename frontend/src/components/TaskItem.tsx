import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import { Task } from '../context/TaskContext';
import { Check, X, Edit2, Trash2, Clock, CheckCircle } from 'lucide-react';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleTaskStatus, updateTask, deleteTask } = useTask();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.description);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleToggleStatus = async () => {
    setIsLoading(true);
    try {
      await toggleTaskStatus(task.id);
    } catch (error) {
      console.error('Failed to toggle task status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (editValue.trim() === '') return;
    
    setIsLoading(true);
    try {
      await updateTask(task.id, { description: editValue.trim() });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditValue(task.description);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteTask(task.id);
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 transition-all duration-200 hover:shadow-md ${
      task.status === 'complete' 
        ? 'border-green-500 bg-green-50' 
        : 'border-blue-500 hover:border-blue-600'
    }`}>
      <div className="p-4">
        {/* Task Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleStatus}
              disabled={isLoading}
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                task.status === 'complete'
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-blue-500'
              }`}
            >
              {task.status === 'complete' && <Check size={16} />}
            </button>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              {task.status === 'complete' ? (
                <CheckCircle size={14} className="text-green-500" />
              ) : (
                <Clock size={14} className="text-blue-500" />
              )}
              <span className="capitalize">{task.status}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-1">
            <button
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              className="p-1 text-gray-400 hover:text-blue-500 transition-colors duration-200"
              title="Edit task"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isLoading}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
              title="Delete task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Task Content */}
        <div className="mb-3">
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                maxLength={500}
                placeholder="Enter task description..."
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  <X size={16} />
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isLoading || editValue.trim() === ''}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 transition-colors duration-200"
                >
                  <Check size={16} />
                </button>
              </div>
            </div>
          ) : (
            <p className={`text-gray-800 leading-relaxed ${
              task.status === 'complete' ? 'line-through text-gray-500' : ''
            }`}>
              {task.description}
            </p>
          )}
        </div>

        {/* Task Meta */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>Created: {formatDate(task.created_at)}</div>
          {task.updated_at !== task.created_at && (
            <div>Updated: {formatDate(task.updated_at)}</div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Task</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;