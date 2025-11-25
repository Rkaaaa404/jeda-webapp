import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [heroClass, setHeroClass] = useState('Warrior');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login({ username, password });
      } else {
        await register({ username, password, heroClass });
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Left Side - Logo */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-gradient-to-br from-red-900/20 to-purple-900/20">
        <div className="text-center">
          <div className="text-9xl mb-6">⚔️</div>
          <h1 className="font-display text-8xl font-bold bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent mb-4 tracking-tight">
            SLAYER
          </h1>
          <p className="text-slate-300 text-xl font-semibold mb-2">
            Quest. Battle. Conquer.
          </p>
          <p className="text-slate-400 text-sm">
            Transform your productivity into epic RPG adventures
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-12">
            <div className="text-6xl mb-3">⚔️</div>
            <h1 className="font-display text-5xl font-bold bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent mb-2 tracking-tight">
              SLAYER
            </h1>
            <p className="text-slate-400">Quest. Battle. Conquer.</p>
          </div>

          {/* Form Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
            {error && (
              <div className="mb-6 bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username field */}
              <div>
                <input
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent border-2 border-slate-600 text-white placeholder-slate-400 px-5 py-3.5 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-base"
                  required
                  minLength={3}
                />
              </div>

              {/* Password field */}
              <div>
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-2 border-slate-600 text-white placeholder-slate-400 px-5 py-3.5 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-base"
                  required
                  minLength={6}
                />
              </div>

              {/* Hero Class Selection (Registration Only) */}
              {!isLogin && (
                <div>
                  <label className="block text-slate-300 mb-2 text-sm font-medium">
                    Choose Your Hero Class
                  </label>
                  <select
                    value={heroClass}
                    onChange={(e) => setHeroClass(e.target.value)}
                    className="w-full bg-slate-700 border-2 border-slate-600 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-base"
                  >
                    <option value="Warrior">⚔️ Warrior - The fearless fighter</option>
                    <option value="Mage">🔮 Mage - Master of arcane arts</option>
                    <option value="Rogue">🗡️ Rogue - Swift and deadly</option>
                    <option value="Healer">✨ Healer - Guardian of light</option>
                  </select>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition-all text-base shadow-lg"
              >
                {loading ? 'Please wait...' : (isLogin ? '⚔️ Enter the Arena' : '🎮 Begin Your Journey')}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setUsername('');
                setPassword('');
                setHeroClass('Warrior');
              }}
              className="w-full border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 py-3.5 rounded-xl font-semibold transition-all text-base"
            >
              {isLogin ? 'Create New Hero' : 'Already a Slayer?'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
