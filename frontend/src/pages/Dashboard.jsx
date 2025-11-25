import { useState, useEffect } from 'react';
import { Plus, Scroll, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, taskAPI, sessionAPI } from '../utils/api';
import HeroCard from '../components/HeroCard';
import QuestItem from '../components/QuestItem';
import BattleTimer from '../components/BattleTimer';
import BreakTimer from '../components/BreakTimer';

const Dashboard = ({ setActiveSession: setAppActiveSession, activeSession: appActiveSession }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [activeSession, setActiveSession] = useState(appActiveSession);
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestSessions, setNewQuestSessions] = useState(1);
  const [newQuestDifficulty, setNewQuestDifficulty] = useState('Medium');
  const [showNewQuestForm, setShowNewQuestForm] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null);

  useEffect(() => {
    loadTasks();
    loadActiveSession();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await taskAPI.getTasks();
      setTasks(response.data.data);
    } catch (error) {
      console.error('Failed to load quests:', error);
    }
  };

  const loadActiveSession = async () => {
    try {
      const response = await sessionAPI.getActiveSession();
      setActiveSession(response.data.data);
      if (response.data.data?.taskId) {
        setSelectedQuest(response.data.data.taskId);
      }
    } catch (error) {
      console.error('Failed to load active battle:', error);
    }
  };

  const handleCreateQuest = async (e) => {
    e.preventDefault();
    try {
      await taskAPI.createTask({
        title: newQuestTitle,
        estimatedSessions: newQuestSessions,
        difficulty: newQuestDifficulty
      });
      setNewQuestTitle('');
      setNewQuestSessions(1);
      setNewQuestDifficulty('Medium');
      setShowNewQuestForm(false);
      await loadTasks();
    } catch (error) {
      console.error('Failed to create quest:', error);
      alert('Failed to create quest');
    }
  };

  const handleStartBattle = async (quest) => {
    try {
      const response = await sessionAPI.startSession({ taskId: quest._id });
      const session = response.data.data;
      setActiveSession(session);
      setAppActiveSession(session);
      setSelectedQuest(quest);
      await loadTasks();
    } catch (error) {
      console.error('Failed to start battle:', error);
      alert(error.response?.data?.message || 'Failed to start battle');
    }
  };

  const activeQuests = tasks.filter(t => t.status !== 'DONE');
  const completedQuests = tasks.filter(t => t.status === 'DONE');

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column: Hero Card */}
          <div className="lg:col-span-1">
            <HeroCard user={user} />
            
            {/* Streak Info */}
            <div className="mt-4 bg-slate-900 rounded-xl p-4 border border-slate-800">
              <h3 className="text-sm font-bold text-slate-300 mb-2">📅 Victory Streak System</h3>
              <p className="text-xs text-slate-400 mb-2">
                Complete quests and upload evidence daily to maintain your streak!
              </p>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Current Streak:</span>
                <span className="text-yellow-400 font-bold">{user?.stats?.currentStreak || 0} days 🔥</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Longest Streak:</span>
                <span className="text-purple-400 font-bold">{user?.stats?.longestStreak || 0} days 👑</span>
              </div>
            </div>
            
            {/* Shop Button */}
            <a
              href="/shop"
              className="mt-4 w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <ShoppingBag size={20} />
              Visit Shop
            </a>
          </div>

          {/* Right Column: Quests & Battle */}
          <div className="lg:col-span-2 space-y-6">
            {/* Battle Interface */}
            {activeSession && !onBreak && (
              <div className="bg-slate-900 rounded-xl p-6 border-2 border-red-600">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  ⚔️ Active Battle
                </h2>
                <BattleTimer
                  activeSession={activeSession}
                  selectedQuest={selectedQuest}
                  setActiveSession={setActiveSession}
                  setAppActiveSession={setAppActiveSession}
                  setOnBreak={setOnBreak}
                  onUpdate={loadTasks}
                />
              </div>
            )}

            {/* Break Timer */}
            {onBreak && (
              <div className="bg-slate-900 rounded-xl p-6 border-2 border-blue-600">
                <BreakTimer 
                  duration={user?.settings?.shortBreak || 5}
                  onBreakEnd={() => setOnBreak(false)} 
                />
              </div>
            )}

            {/* Active Quests */}
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Scroll className="text-yellow-400" size={28} />
                  Active Quests
                </h2>
                <button
                  onClick={() => setShowNewQuestForm(!showNewQuestForm)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus size={20} />
                  New Quest
                </button>
              </div>

              {/* New Quest Form */}
              {showNewQuestForm && (
                <form onSubmit={handleCreateQuest} className="mb-6 bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <input
                    type="text"
                    placeholder="Quest Title..."
                    value={newQuestTitle}
                    onChange={(e) => setNewQuestTitle(e.target.value)}
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Estimated Battles</label>
                      <input
                        type="number"
                        min="1"
                        value={newQuestSessions}
                        onChange={(e) => setNewQuestSessions(parseInt(e.target.value))}
                        className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Difficulty</label>
                      <select
                        value={newQuestDifficulty}
                        onChange={(e) => setNewQuestDifficulty(e.target.value)}
                        className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Easy">⭐ Easy</option>
                        <option value="Medium">⭐⭐ Medium</option>
                        <option value="Hard">⭐⭐⭐ Hard</option>
                        <option value="Epic">👑 Epic</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                      Create Quest
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewQuestForm(false)}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Quest List */}
              {activeQuests.length === 0 ? (
                <div className="text-center text-slate-400 py-12">
                  <Scroll size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No active quests. Create one to begin your journey!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeQuests.map(quest => (
                    <QuestItem
                      key={quest._id}
                      quest={quest}
                      onUpdate={loadTasks}
                      onStartBattle={handleStartBattle}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Completed Quests */}
            {completedQuests.length > 0 && (
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                <h2 className="text-xl font-bold mb-4 text-emerald-400">✓ Completed Quests</h2>
                <div className="space-y-2">
                  {completedQuests.slice(0, 5).map(quest => (
                    <QuestItem key={quest._id} quest={quest} onUpdate={loadTasks} onStartBattle={handleStartBattle} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
