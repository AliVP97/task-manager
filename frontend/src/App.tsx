import React, { useState, useEffect } from 'react';
import { TaskProvider } from './context/TaskContext';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskFilters from './components/TaskFilters';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { CheckSquare, Plus } from 'lucide-react';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <TaskProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CheckSquare className="text-indigo-600" size={32} />
              <h1 className="text-4xl font-bold text-gray-800">Task Manager</h1>
            </div>
            <p className="text-gray-600 text-lg">
              Organize your tasks and boost your productivity
            </p>
          </header>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            {/* Action Bar */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <TaskFilters />
                <button
                  onClick={() => setShowForm(!showForm)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    showForm
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  <Plus size={20} />
                  {showForm ? 'Cancel' : 'Add Task'}
                </button>
              </div>
            </div>

            {/* Task Form */}
            {showForm && (
              <div className="mb-6">
                <TaskForm onClose={() => setShowForm(false)} />
              </div>
            )}

            {/* Task List */}
            <TaskList />
          </div>
        </div>
      </div>
    </TaskProvider>
  );
}

export default App;