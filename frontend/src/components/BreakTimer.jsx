import { useState, useEffect } from 'react';
import { Coffee, Play } from 'lucide-react';

const BreakTimer = ({ duration = 5, onBreakEnd, onSkip, isLongBreak }) => {
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    // Reset timer if duration changes
    setTimeRemaining(duration * 60);
  }, [duration]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Break Over!', {
              body: 'Time to get back to work!',
            });
          }
          setTimeout(() => onBreakEnd(), 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onBreakEnd]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progress = ((duration * 60 - timeRemaining) / (duration * 60)) * 100;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50">
      <div className="text-center">
        {/* Break Icon */}
        <div className="mb-8 flex justify-center">
          <div className="bg-blue-500/20 p-8 rounded-full">
            <Coffee size={80} className="text-blue-400" />
          </div>
        </div>

        {/* Break Type */}
        <h2 className="text-4xl font-bold text-white mb-2 font-display">
          {isLongBreak ? 'Long Break' : 'Short Break'}
        </h2>
        <p className="text-slate-400 mb-8">Take a moment to rest and recharge</p>

        {/* Timer Circle */}
        <div className="relative w-64 h-64 mx-auto mb-8">
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
              stroke="#3b82f6"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 120}`}
              strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl font-bold text-blue-400 mb-2">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-slate-400">
              {timeRemaining === 0 ? 'Break Over!' : 'Relax...'}
            </div>
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={onSkip}
          className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 mx-auto"
        >
          <Play size={20} />
          Skip Break & Continue
        </button>
      </div>
    </div>
  );
};

export default BreakTimer;
