import { useState } from 'react';
import { Swords, Target, Skull, CheckCircle, Upload, X, Edit2, Trash2 } from 'lucide-react';
import { taskAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const DIFFICULTY_COLORS = {
  Easy: 'bg-green-900/50 border-green-600 text-green-400',
  Medium: 'bg-yellow-900/50 border-yellow-600 text-yellow-400',
  Hard: 'bg-orange-900/50 border-orange-600 text-orange-400',
  Epic: 'bg-purple-900/50 border-purple-600 text-purple-400'
};

const DIFFICULTY_ICONS = {
  Easy: '⭐',
  Medium: '⭐⭐',
  Hard: '⭐⭐⭐',
  Epic: '👑'
};

const QuestItem = ({ quest, onUpdate, onStartBattle }) => {
  const { user } = useAuth();
  const [showEvidence, setShowEvidence] = useState(false);
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    title: quest.title,
    estimatedSessions: quest.estimatedSessions,
    difficulty: quest.difficulty
  });

  const handleEditQuest = async () => {
    try {
      await taskAPI.updateTask(quest._id, editForm);
      setShowEdit(false);
      alert('✅ Quest updated successfully!');
      onUpdate();
    } catch (error) {
      console.error('Failed to edit quest:', error);
      alert('Failed to update quest. Try again.');
    }
  };

  const handleDeleteQuest = async () => {
    if (!confirm('🗑️ Are you sure you want to DELETE this quest permanently? This cannot be undone!')) {
      return;
    }

    try {
      await taskAPI.deleteTask(quest._id);
      alert('✅ Quest deleted successfully');
      onUpdate();
    } catch (error) {
      console.error('Failed to delete quest:', error);
      alert('Failed to delete quest. Try again.');
    }
  };

  const handleCompleteQuest = async () => {
    if (!evidenceFile) {
      alert('Please upload evidence of quest completion!');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('evidence', evidenceFile);

      const response = await taskAPI.completeTask(quest._id, formData);
      
      // Show RPG Reward Notification
      const { rpgRewards } = response.data.data;
      const levelUpMsg = rpgRewards.leveledUp 
        ? `\n🎉 LEVEL UP! You are now Level ${rpgRewards.newLevel}!`
        : '';
      
      alert(
        `⚔️ VICTORY! ${quest.monsterType} Defeated!\n\n` +
        `💜 +${rpgRewards.xpGained} XP\n` +
        `💰 +${rpgRewards.goldGained} Gold` +
        levelUpMsg
      );

      setShowEvidence(false);
      setEvidenceFile(null);
      onUpdate();
      
      // Reload page to update hero stats after level up
      if (rpgRewards.leveledUp) {
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error) {
      console.error('Failed to complete quest:', error);
      alert('Failed to complete quest. Try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className={`${DIFFICULTY_COLORS[quest.difficulty]} border-2 rounded-xl p-4 transition-all hover:shadow-lg hover:scale-[1.02]`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{DIFFICULTY_ICONS[quest.difficulty]}</span>
              <h3 className="text-lg font-bold text-white">{quest.title}</h3>
              {quest.status !== 'DONE' && (
                <div className="flex items-center gap-1">
                  {quest.status === 'TODO' && (
                    <button
                      onClick={() => setShowEdit(true)}
                      className="text-slate-400 hover:text-yellow-400 transition-colors"
                      title="Edit Quest"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                  <button
                    onClick={handleDeleteQuest}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                    title="Delete Quest"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <span className="flex items-center gap-1">
                <Skull size={14} />
                {quest.monsterType}
              </span>
              <span className="flex items-center gap-1">
                <Target size={14} />
                {quest.estimatedSessions} Battle{quest.estimatedSessions > 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${DIFFICULTY_COLORS[quest.difficulty]}`}>
            {quest.difficulty}
          </div>
        </div>

        {quest.status === 'DONE' ? (
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-900/30 rounded-lg px-4 py-3">
            <CheckCircle size={20} />
            <span className="font-semibold">Quest Completed!</span>
          </div>
        ) : quest.status === 'IN_PROGRESS' && quest.completedSessions > 0 ? (
          <button
            onClick={() => setShowEvidence(true)}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Upload size={18} />
            Claim Victory
          </button>
        ) : quest.status === 'IN_PROGRESS' ? (
          <button
            onClick={() => onStartBattle(quest)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Swords size={18} />
            Continue Battle
          </button>
        ) : (
          <button
            onClick={() => onStartBattle(quest)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Swords size={18} />
            Begin Battle
          </button>
        )}
      </div>

      {/* Evidence Upload Modal */}
      {showEvidence && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-md w-full p-6 border-2 border-yellow-600">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">📸 Proof of Victory</h3>
              <button onClick={() => setShowEvidence(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <p className="text-slate-300 mb-4 text-sm">
              Upload evidence that you defeated the {quest.monsterType} to claim your rewards!
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEvidenceFile(e.target.files[0])}
              className="w-full mb-4 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-600 file:text-white hover:file:bg-yellow-700 file:cursor-pointer"
            />

            {evidenceFile && (
              <p className="text-green-400 text-sm mb-4">✓ {evidenceFile.name}</p>
            )}

            <button
              onClick={handleCompleteQuest}
              disabled={!evidenceFile || uploading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              {uploading ? 'Claiming...' : '⚔️ Claim Victory & Loot'}
            </button>
          </div>
        </div>
      )}

      {/* Edit Quest Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-md w-full p-6 border-2 border-yellow-600">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">✏️ Edit Quest</h3>
              <button onClick={() => setShowEdit(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-bold mb-2">Quest Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border-2 border-slate-600 focus:border-yellow-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-bold mb-2">Difficulty</label>
                <select
                  value={editForm.difficulty}
                  onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border-2 border-slate-600 focus:border-yellow-600 outline-none"
                >
                  <option value="Easy">⭐ Easy</option>
                  <option value="Medium">⭐⭐ Medium</option>
                  <option value="Hard">⭐⭐⭐ Hard</option>
                  <option value="Epic">👑 Epic</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-bold mb-2">Estimated Battles</label>
                <input
                  type="number"
                  min="1"
                  value={editForm.estimatedSessions}
                  onChange={(e) => setEditForm({ ...editForm, estimatedSessions: parseInt(e.target.value) })}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border-2 border-slate-600 focus:border-yellow-600 outline-none"
                />
              </div>

              <button
                onClick={handleEditQuest}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                💾 Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuestItem;
