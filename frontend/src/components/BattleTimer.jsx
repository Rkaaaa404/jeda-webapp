import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkullIcon, Heart } from 'lucide-react';
import { sessionAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const BattleTimer = ({ 
  activeSession, 
  selectedQuest,
  setActiveSession, 
  setAppActiveSession,
  setOnBreak,
  onUpdate
}) => {
  const { user } = useAuth();
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Calculate time remaining based on session start time (always accurate)
  const calculateTimeRemaining = () => {
    if (!activeSession) return 0;
    const workDuration = activeSession.duration || user?.settings?.workDuration || 25;
    const startTime = new Date(activeSession.startTime).getTime();
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    const totalSeconds = workDuration * 60;
    const remaining = Math.max(0, totalSeconds - elapsedSeconds);
    return remaining;
  };

  useEffect(() => {
    if (!activeSession) {
      clearInterval(intervalRef.current);
      return;
    }

    // Set initial time
    setTimeRemaining(calculateTimeRemaining());

    // Only start timer if not paused
    if (!isPaused) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        const remaining = calculateTimeRemaining();
        setTimeRemaining(remaining);
        
        if (remaining <= 0) {
          clearInterval(intervalRef.current);
          handleBattleComplete();
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [activeSession, isPaused]);

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleBattleComplete = async () => {
    try {
      await sessionAPI.stopSession();
      setActiveSession(null);
      setAppActiveSession(null);
      alert(`⚔️ ${selectedQuest?.monsterType || 'Monster'} HP Depleted! Battle Session Complete!`);
      setOnBreak(true);
      onUpdate();
    } catch (error) {
      console.error('Failed to complete battle:', error);
      const remaining = error?.response?.data?.remainingMinutes;
      if (remaining) {
        // Extend timer for required remaining minutes and resume countdown
        setTimeRemaining(remaining * 60);
        setIsPaused(false);
      }
    }
  };

  const handleFlee = async () => {
    if (!confirm('⚠️ Fleeing from battle will grant NO rewards. Are you sure?')) {
      return;
    }

    try {
      await sessionAPI.deleteSession(activeSession._id);
      setActiveSession(null);
      setAppActiveSession(null);
      alert('💨 You fled from battle!');
      onUpdate();
    } catch (error) {
      console.error('Failed to flee:', error);
      alert('Failed to flee from battle. Please try again.');
    }
  };

  const workDuration = (activeSession?.duration || user?.settings?.workDuration || 25) * 60;
  const hpPercentage = (timeRemaining / workDuration) * 100;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="relative">
      {/* Monster Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-6xl">
            {selectedQuest?.difficulty === 'Epic' ? '🐉' : 
             selectedQuest?.difficulty === 'Hard' ? '👹' :
             selectedQuest?.difficulty === 'Medium' ? '👺' : '👾'}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-red-400">{selectedQuest?.monsterType || 'Monster'}</h3>
            <p className="text-slate-400">{selectedQuest?.title}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-white">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-slate-400">Time Remaining</div>
        </div>
      </div>

      {/* HP Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-red-300 mb-2">
          <span className="flex items-center gap-1 font-semibold">
            <Heart size={16} className="text-red-500" />
            Monster HP
          </span>
          <span className="font-bold">{Math.round(hpPercentage)}%</span>
        </div>
        <div className="h-8 bg-slate-800 rounded-full overflow-hidden border-2 border-red-900 shadow-inner">
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${
              hpPercentage > 50 ? 'bg-gradient-to-r from-red-500 to-red-600' :
              hpPercentage > 25 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
              'bg-gradient-to-r from-yellow-500 to-orange-500'
            } shadow-lg`}
            style={{ width: `${hpPercentage}%` }}
          >
            <div className="w-full h-full bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Battle Controls */}
      <div className="flex gap-3">
        <button
          onClick={handlePauseResume}
          className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          {isPaused ? <Play size={20} /> : <Pause size={20} />}
          {isPaused ? 'Resume Battle' : 'Pause Battle'}
        </button>
        <button
          onClick={handleFlee}
          className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
        >
          <SkullIcon size={20} />
          Flee
        </button>
      </div>

      {isPaused && (
        <div className="mt-4 bg-yellow-900/30 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-xl text-sm text-center">
          ⚠️ Battle Paused - Monster is waiting...
        </div>
      )}
    </div>
  );
};

export default BattleTimer;
