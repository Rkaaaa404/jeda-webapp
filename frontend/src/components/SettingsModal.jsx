import { useState, useEffect } from 'react';
import { X, Settings as SettingsIcon, Save } from 'lucide-react';
import { settingsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const SettingsModal = ({ isOpen, onClose, activeSession }) => {
  const { updateUserSettings } = useAuth();
  const [settings, setSettings] = useState({
    workDuration: 25,
    shortBreak: 5,
    minSessionDuration: 5
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await settingsAPI.getSettings();
      setSettings(response.data.data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsAPI.updateSettings(settings);
      updateUserSettings(settings); // Update user context immediately
      alert('Settings saved successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-md w-full p-6 relative border border-slate-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <SettingsIcon size={24} className="text-emerald-500" />
            <h2 className="text-xl font-bold text-white font-display">Timer Settings</h2>
          </div>
          <p className="text-sm text-slate-400">
            Customize your Pomodoro timer durations
          </p>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-8">Loading...</div>
        ) : (
          <>
            {activeSession && (
              <div className="mb-4 bg-yellow-900/30 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-xl text-sm">
                ⚠️ Settings cannot be changed during an active session. Please end your current session first.
              </div>
            )}
            <div className="space-y-5">
            {/* Work Duration */}
            <div>
              <label className="block text-slate-300 mb-2 text-sm font-medium">
                Work Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={settings.workDuration}
                onChange={(e) => setSettings({ ...settings, workDuration: parseInt(e.target.value) })}
                disabled={activeSession}
                className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Short Break */}
            <div>
              <label className="block text-slate-300 mb-2 text-sm font-medium">
                Break Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.shortBreak}
                onChange={(e) => setSettings({ ...settings, shortBreak: parseInt(e.target.value) })}
                disabled={activeSession}
                className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Minimum Session Duration */}
            <div>
              <label className="block text-slate-300 mb-2 text-sm font-medium">
                Minimum Session Duration (minutes)
              </label>
              <input
                type="number"
                value={settings.minSessionDuration}
                disabled
                className="w-full bg-slate-600 border border-slate-600 text-slate-400 px-4 py-3 rounded-lg cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 mt-1">
                Fixed at {settings.minSessionDuration} minutes to prevent spam and maintain fair leaderboard competition
              </p>
            </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading || activeSession}
            className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
