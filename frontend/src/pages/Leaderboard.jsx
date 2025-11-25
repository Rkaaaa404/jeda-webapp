import { useState, useEffect } from 'react';
import { Trophy, Zap } from 'lucide-react';
import { leaderboardAPI } from '../utils/api';
import Podium from '../components/Podium';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('streak'); // 'streak' or 'sessions'
  const [timeRange, setTimeRange] = useState('all'); // 'today', 'week', 'month', 'all'
  const [streakData, setStreakData] = useState([]);
  const [sessionData, setSessionData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLeaderboards();
  }, [timeRange]);

  const loadLeaderboards = async () => {
    setLoading(true);
    try {
      const [streakResponse, sessionResponse] = await Promise.all([
        leaderboardAPI.getStreakLeaderboard(),
        leaderboardAPI.getSessionLeaderboard(timeRange)
      ]);
      setStreakData(streakResponse.data.data);
      setSessionData(sessionResponse.data.data);
    } catch (error) {
      console.error('Failed to load leaderboards:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentData = activeTab === 'streak' ? streakData : sessionData;
  const topThree = currentData.slice(0, 3);
  const restOfList = currentData.slice(3);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
          <p className="text-slate-400">Compete with the community</p>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setActiveTab('streak')}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'streak'
                ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <Trophy size={20} />
            Top Slayers
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'sessions'
                ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <Zap size={20} />
            Top Warriors
          </button>
        </div>

        {/* Description */}
        <div className="text-center text-sm text-slate-400 mb-6">
          {activeTab === 'streak' ? (
            <div>
              <p className="mb-2">🏆 <strong>Longest Victory Streak</strong> - Your all-time record!</p>
              <p className="text-xs text-slate-500">Complete and upload evidence for quests on consecutive days to build your streak.</p>
            </div>
          ) : (
            <p>⏱️ Ranked by total battle time - Every second of focus counts!</p>
          )}
        </div>

        {/* Time Range Filter (Sessions only) */}
        {activeTab === 'sessions' && (
          <div className="flex gap-2 mb-6 justify-center">
            {['today', 'week', 'month', 'all'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  timeRange === range
                    ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        )}

        {/* Podium */}
        <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 mb-6">
          {loading ? (
            <div className="text-center text-slate-400 py-12">Loading...</div>
          ) : (
            <Podium topThree={topThree} showFocusTime={activeTab === 'sessions'} />
          )}
        </div>

        {/* Rest of Leaderboard */}
        {restOfList.length > 0 && (
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <h2 className="text-lg font-bold mb-4">Rankings</h2>
            <div className="space-y-2">
              {restOfList.map((user) => (
                <div
                  key={user.username}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    user.isCurrentUser ? 'bg-emerald-900/30 border border-emerald-700' : 'bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-xl font-bold text-slate-400 w-8">
                      #{user.rank}
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {user.username}
                        {user.isCurrentUser && (
                          <span className="ml-2 text-xs text-emerald-500">(You)</span>
                        )}
                      </div>
                      {activeTab === 'sessions' && user.totalDuration > 0 && (
                        <div className="text-sm text-slate-400">
                          {user.sessionCount} session{user.sessionCount !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {activeTab === 'streak' ? (
                      <>
                        <div className="text-2xl font-bold text-emerald-400">
                          {user.longestStreak}
                        </div>
                        <div className="text-xs text-slate-400">days</div>
                      </>
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-emerald-400">
                          {Math.floor(user.totalDuration / 60)}h {Math.round(user.totalDuration % 60)}m
                        </div>
                        <div className="text-xs text-slate-400">focus time</div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
