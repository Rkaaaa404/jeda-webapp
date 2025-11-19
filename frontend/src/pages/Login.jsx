import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
        await register({ username, password });
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Left Side - Logo */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="text-center">
          <h1 className="font-display text-8xl font-bold text-white mb-4 tracking-tight">
            jeda.
          </h1>
          <p className="text-slate-400 text-lg font-light">
            Focus. Validate. Compete.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-12">
            <h1 className="font-display text-6xl font-bold text-white mb-2 tracking-tight">
              jeda.
            </h1>
            <p className="text-slate-400">Focus. Validate. Compete.</p>
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition-all text-base shadow-lg shadow-emerald-500/20"
              >
                {loading ? 'Please wait...' : (isLogin ? 'login' : 'register')}
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
              }}
              className="w-full border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 py-3.5 rounded-xl font-semibold transition-all text-base"
            >
              {isLogin ? 'register' : 'login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
