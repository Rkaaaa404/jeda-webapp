import { useState, useEffect } from 'react';
import { Plus, Flame, Circle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, taskAPI, sessionAPI } from '../utils/api';
import TimerDisplay from '../components/TimerDisplay';
import TaskItem from '../components/TaskItem';
import EvidenceModal from '../components/EvidenceModal';

const Dashboard = () => {
  const { user, updateUserStats } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [taskToComplete, setTaskToComplete] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSessions, setNewTaskSessions] = useState(1);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSessions, setEditSessions] = useState(1);

  useEffect(() => {
    loadDashboard();
    loadTasks();
    loadActiveSession();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await dashboardAPI.getDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const response = await taskAPI.getTasks();
      setTasks(response.data.data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const loadActiveSession = async () => {
    try {
      const response = await sessionAPI.getActiveSession();
      setActiveSession(response.data.data);
      if (response.data.data?.taskId) {
        const task = tasks.find(t => t._id === response.data.data.taskId._id);
        setSelectedTask(task || response.data.data.taskId);
      }
    } catch (error) {
      console.error('Failed to load active session:', error);
    }
  };

  const handleStartSession = async (taskId) => {
    try {
      const response = await sessionAPI.startSession({ taskId });
      setActiveSession(response.data.data);
      await loadTasks();
    } catch (error) {
      console.error('Failed to start session:', error);
      alert(error.response?.data?.message || 'Failed to start session');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await taskAPI.createTask({
        title: newTaskTitle,
        estimatedSessions: newTaskSessions
      });
      setNewTaskTitle('');
      setNewTaskSessions(1);
      setShowNewTaskForm(false);
      await loadTasks();
      // Auto-select the newly created task
      setSelectedTask(response.data.data);
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task');
    }
  };

  const handleCompleteTask = (task) => {
    setTaskToComplete(task);
    setShowEvidenceModal(true);
  };

  const handleSubmitEvidence = async (taskId, formData) => {
    try {
      const response = await taskAPI.completeTask(taskId, formData);
      updateUserStats(response.data.data.stats);
      await loadTasks();
      await loadDashboard();
      setShowEvidenceModal(false);
      setTaskToComplete(null);
      
      // Show streak animation (simple alert for now)
      alert(`🔥 Streak updated! Current: ${response.data.data.stats.currentStreak} days`);
    } catch (error) {
      console.error('Failed to submit evidence:', error);
      throw error;
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try {
      await taskAPI.deleteTask(taskId);
      await loadTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditSessions(task.estimatedSessions);
  };

  const handleSaveEdit = async () => {
    try {
      await taskAPI.updateTask(editingTask._id, {
        title: editTitle,
        estimatedSessions: editSessions
      });
      setEditingTask(null);
      await loadTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('Failed to update task');
    }
  };

  const handleStopSession = async () => {
    try {
      const response = await sessionAPI.stopSession();
      setActiveSession(null);
      updateUserStats(response.data.data.stats);
      await loadTasks();
      await loadDashboard();
    } catch (error) {
      console.error('Failed to stop session:', error);
      // Check if it's a minimum duration error
      if (error.response?.data?.remainingMinutes) {
        alert(error.response.data.message);
      } else {
        alert('Failed to stop session');
      }
    }
  };

  const getStreakIcon = () => {
    if (!dashboardData) return <Circle className="text-slate-500" size={24} />;
    
    switch (dashboardData.streakStatus) {
      case 'ACTIVE':
        return <Flame className="text-orange-500" size={24} />;
      case 'PENDING':
        return <Circle className="text-yellow-500" size={24} />;
      default:
        return <Circle className="text-slate-500" size={24} />;
    }
  };

  const todoTasks = tasks.filter(t => t.status === 'TODO' || t.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter(t => t.status === 'DONE');

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Welcome back, {user?.username}!</h1>
            <p className="text-sm text-slate-400">
              Today's Progress: {dashboardData?.todayProgress.sessionsCompleted || 0} / {dashboardData?.todayProgress.dailyGoal || 4} sessions
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg">
              {getStreakIcon()}
              <span className="font-semibold">{user?.stats.currentStreak || 0} Day Streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Timer */}
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <TimerDisplay
              activeSession={activeSession}
              onStart={handleStartSession}
              onStop={handleStopSession}
              selectedTask={selectedTask}
              userSettings={user?.settings}
            />
          </div>

          {/* Right: Tasks */}
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Tasks</h2>
              <button
                onClick={() => setShowNewTaskForm(!showNewTaskForm)}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={20} />
                New Task
              </button>
            </div>

            {/* New Task Form */}
            {showNewTaskForm && (
              <form onSubmit={handleCreateTask} className="mb-4 p-4 bg-slate-800 rounded-lg">
                <input
                  type="text"
                  placeholder="Task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-slate-700 text-white px-3 py-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={newTaskSessions}
                    onChange={(e) => setNewTaskSessions(parseInt(e.target.value))}
                    className="w-24 bg-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-400 py-2">sessions</span>
                  <button
                    type="submit"
                    className="ml-auto bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded transition-colors"
                  >
                    Add
                  </button>
                </div>
              </form>
            )}

            {/* Task List */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {todoTasks.length === 0 && doneTasks.length === 0 ? (
                <div className="text-center text-slate-400 py-12">
                  No tasks yet. Create one to get started!
                </div>
              ) : (
                <>
                  {todoTasks.map(task => (
                    <TaskItem
                      key={task._id}
                      task={task}
                      isSelected={selectedTask?._id === task._id}
                      onSelect={setSelectedTask}
                      onComplete={handleCompleteTask}
                      onDelete={handleDeleteTask}
                      onEdit={handleEditTask}
                    />
                  ))}
                  {doneTasks.length > 0 && (
                    <>
                      <div className="text-sm text-slate-400 mt-6 mb-2 font-semibold">Completed</div>
                      {doneTasks.slice(0, 3).map(task => (
                        <TaskItem
                          key={task._id}
                          task={task}
                          isSelected={false}
                          onSelect={() => {}}
                          onComplete={() => {}}
                          onDelete={() => {}}
                        />
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Modal */}
      {showEvidenceModal && taskToComplete && (
        <EvidenceModal
          task={taskToComplete}
          onClose={() => {
            setShowEvidenceModal(false);
            setTaskToComplete(null);
          }}
          onSubmit={handleSubmitEvidence}
        />
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-xl p-6 max-w-md w-full border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Edit Task</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Estimated Sessions
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={editSessions}
                  onChange={(e) => setEditSessions(parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingTask(null)}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editTitle.trim() || editSessions < 1}
                className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </Layout>
  );
};

export def