import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRecyclerAuth } from '../../context/RecyclerAuthContext';
import { ShieldCheck, Phone, Lock, Eye, EyeOff, AlertCircle, Sparkles, Building2 } from 'lucide-react';

export const RecyclerLoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useRecyclerAuth();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = phone.trim();
    if (!cleanPhone) {
      setError('Please enter your mobile number.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      await login({ phone: cleanPhone, password });
      navigate('/recycler/home');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 mb-4">
          <Building2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          SAHI VALUE
        </h2>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 mt-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase">
            Recycler Operations Portal
          </span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 sm:rounded-2xl sm:px-10">
          <h3 className="text-xl font-extrabold text-slate-900 mb-1">
            Sign In to Recycler Portal
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Authorized CPCB E-Waste Recycler Operations & Verification
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs font-semibold text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mobile Number
              </label>
              <div className="relative rounded-xl border border-slate-300 bg-slate-50 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600 transition-all">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10-digit registered phone"
                  className="block w-full pl-9 pr-3 py-2.5 bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative rounded-xl border border-slate-300 bg-slate-50 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600 transition-all">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full pl-9 pr-10 py-2.5 bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-70 mt-6"
            >
              {loading ? 'AUTHENTICATING...' : 'LOG IN TO PORTAL'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have a registered Recycler facility account?{' '}
            <Link to="/recycler/register" className="font-extrabold text-emerald-600 hover:text-emerald-700">
              REGISTER FACILITY
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
