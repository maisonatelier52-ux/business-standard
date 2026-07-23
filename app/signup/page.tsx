'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || username.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/');
        router.refresh();
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-12">
      <div className="max-w-md mx-auto bg-white border rounded-xl shadow-sm p-8">
        
        {/* Top Accent Line */}
        <div className="h-1 bg-red-700 w-full rounded-t-xl -mt-8 -mx-8 mb-8" style={{ width: 'calc(100% + 64px)' }}></div>

        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-bold logo-font text-red-700 mb-2">
              Business Standard
            </h1>
          </Link>
          <h2 className="text-xl font-bold text-gray-900">Create your account</h2>
          <p className="text-sm text-gray-500 mt-1">
            Join Business Standard to participate in discussions & subscribe
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 4 characters"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-4 rounded-lg transition duration-200 text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-red-700 font-bold hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
