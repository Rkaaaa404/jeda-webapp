import { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

const TimerDisplay = ({ activeSession, onStart, onStop, selectedTask, userSettings }) => {
  const POMODORO_DURATION = (userSettings?.workDuration || 25) * 60; // Convert minutes to seconds
  const [timeRemaining, setTimeRemaining] = useState(POMODORO_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [canEndSession, setCanEndSession] = useState(false);

  // Reset timer when settings change
  useEffect(() => {
    if (!activeSession) {
      setTimeRemaining(POMODORO_DURATION);
    }
  }, [POMODORO_DURATION, activeSession]);

  useEffect(() => {
    if (activeSession) {
      setIsRunning(true);
      const startTime = new Date(activeSession.startTime);
      const minDuration = (userSettings?.minSessionDuration || 5) * 60; // Convert to seconds
      
      const interval = setInterval(() => {
        const now = new Date();
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        const remaining = Math.max(0, POMODORO_DURATION - elapsedSeconds);
        setTimeRemaining(remaining);
        
        // Check if minimum duration met
        setCanEndSession(elapsedSeconds >= minDuration);
        
        // Auto-complete when timer reaches 0
        if (remaining === 0) {
          clearInterval(interval);
          setCanEndSession(true);
          // Play notification sound or show alert
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Pomodoro Complete!', {
              body: 'Great work! Time to take a break.',
            });
          }
        }
      }, 1000);
      
      return () => clearInterval(interval);
    } else {
      setIsRunning(false);
      setTimeRemaining(POMODORO_DURATION);
      setCanEndSession(false);
    }
  }, [activeSession, POMODORO_DURATION, userSettings]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!selectedTask && !activeSession) {
      alert('Please select a task first!');
      return;
    }
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    onStart(selectedTask?._id);
  };

  const handleStop = () => {
    if (!canEndSession) {
      const minDuration = userSettings?.minSessionDuration || 5;
      alert(`You must work for at least ${minDuration} minutes before ending the session to prevent spam.`);
      return;
    }
    onStop();
  };

  const progress = Math.min(((POMODORO_DURATION - timeRemaining) / POMODORO_DURATION) * 100, 100);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Circular Timer */}
      <div className="relative w-64 h-64 mb-8">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="#1e293b"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="#10b981"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 120}`}
            strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-6xl font-bold mb-2 transition-colors ${
            timeRemaining <= 60 && isRunning ? 'text-red-500 animate-pulse' : 'text-white'
          }`}>
            {formatTime(timeRemaining)}
          </div>
          <div className="text-sm text-slate-400">
            {isRunning ? (timeRemaining === 0 ? 'Time\'s Up!' : 'Focus Time') : 'Ready to Start'}
          </div>
        </div>
      </div>

      {/* Active Task Display */}
      {selectedTask && (
        <div className="mb-6 text-center">
          <div className="text-xs text-emerald-500 mb-1">WORKING ON</div>
          <div className="text-lg font-semibold text-white">{selectedTask.title}</div>
          <div className="text-sm text-slate-400 mt-1">
            Session {(selectedTask.completedSessions || 0) + 1} of {selectedTask.estimatedSessions || 1}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            disabled={!selectedTask}
            className={`flex items-center gap-2 text-white px-8 py-4 rounded-lg font-semibold transition-all transform ${
              selectedTask 
                ? 'bg-emerald-500 hover:bg-emerald-600 hover:scale-105 shadow-lg shadow-emerald-500/50' 
                : 'bg-slate-700 cursor-not-allowed'
            }`}
          >
            <Play size={20} />
            {selectedTask ? `Start ${userSettings?.workDuration || 25}-Min Focus` : 'Select a Task First'}
          </button>
        ) : (
          <button
            onClick={handleStop}
            disabled={!canEndSession}
            className={`flex items-center gap-2 text-white px-8 py-4 rounded-lg font-semibold transition-all transform shadow-lg ${
              canEndSession
                ? 'bg-red-500 hover:bg-red-600 hover:scale-105 shadow-red-500/50'
                : 'bg-slate-700 cursor-not-allowed opacity-50'
            }`}
            title={!canEndSession ? `Wait ${userSettings?.minSessionDuration || 5} minutes minimum` : ''}
          >
            <Pause size={20} />
            {canEndSession ? 'End Session' : 'Session in Progress...'}
          </button>
        )}
      </div>

      {/* Progress Indicator */}
      {isRunning && (
        <div className="mt-6 text-center">
          <div className="text-xs text-slate-400">
            {timeRemaining > 0 
              ? `${Math.round(progress)}% Complete • ${formatTime(timeRemaining)} remaining`
              : 'Session Complete! Click "End Session" to save.'}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerDisplay;
