import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRecyclerAuth } from '../../context/RecyclerAuthContext';
import { Building2, User, Phone, Mail, Lock, MapPin, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

export const RecyclerRegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useRecyclerAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [authorizationNumber, setAuthorizationNumber] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Contact person name is required.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setError('Valid 10-digit mobile number is required.');
      return;
    }
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!facilityName.trim()) {
      setError('Facility name is required.');
      return;
    }
    if (!authorizationNumber.trim()) {
      setError('CPCB Authorization / License Number is required.');
      return;
    }
    if (!location.trim()) {
      setError('Facility location is required.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        facility_name: facilityName.trim(),
        authorization_number: authorizationNumber.trim(),
        location: location.trim(),
        password,
      });

      setSuccess('Recycler Facility Registered successfully! Redirecting...');
      setTimeout(() => {
        navigate('/recycler/home');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 mb-3">
          <Building2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          SAHI VALUE
        </h2>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
          CPCB Authorized Recycler Registration
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 sm:rounded-2xl sm:px-10">
          <h3 className="text-xl font-extrabold text-slate-900 mb-1">
            Register Recycler Facility
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Enter your official CPCB e-waste authorization & facility details
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs font-semibold text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs font-bold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contact Name *
              </label>
              <div className="relative rounded-xl border border-slate-300 bg-slate-50 focus-within:bg-white focus-within:border-emerald-600 transition-all">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Official Contact Person"
                  className="w-full pl-9 pr-3 py-2 bg-transparent text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mobile Number *
              </label>
              <div className="relative rounded-xl border border-slate-300 bg-slate-50 focus-within:bg-white focus-within:border-emerald-600 transition-all">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit Phone"
                  className="w-full pl-9 pr-3 py-2 bg-transparent text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative rounded-xl border border-slate-300 bg-slate-50 focus-within:bg-white focus-within:border-emerald-600 transition-all">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="facility@company.com"
                  className="w-full pl-9 pr-3 py-2 bg-transparent text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Facility Name *
              </label>
              <div className="relative rounded-xl border border-slate-300 bg-slate-50 focus-within:bg-white focus-within:border-emerald-600 transition-all">
                <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  placeholder="e.g. EcoRecycle Pvt Ltd"
                  className="w-full pl-9 pr-3 py-2 bg-transparent text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                CPCB License Number *
              </label>
              <div className="relative rounded-xl border border-slate-300 bg-slate-50 focus-within:bg-white focus-within:border-emerald-600 transition-all">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={authorizationNumber}
                  onChange={(e) => setAuthorizationNumber(e.target.value)}
                  placeholder="CPCB-EW-2026-XXXX"
                  className="w-full pl-9 pr-3 py-2 bg-transparent text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Facility Location / Address *
              </label>
              <div className="relative rounded-xl border border-slate-300 bg-slate-50 focus-within:bg-white focus-within:border-emerald-600 transition-all">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Industrial Area, City, State"
                  className="w-full pl-9 pr-3 py-2 bg-transparent text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password *
              </label>
              <div className="relative rounded-xl border border-slate-300 bg-slate-50 focus-within:bg-white focus-within:border-emerald-600 transition-all">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-9 pr-3 py-2 bg-transparent text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirm Password *
              </label>
              <div className="relative rounded-xl border border-slate-300 bg-slate-50 focus-within:bg-white focus-within:border-emerald-600 transition-all">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-9 pr-3 py-2 bg-transparent text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none transition-all disabled:opacity-70"
              >
                {loading ? 'REGISTERING FACILITY...' : 'REGISTER RECYCLER FACILITY'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/recycler/login" className="font-extrabold text-emerald-600 hover:text-emerald-700">
              LOG IN HERE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
