
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.endsWith('@lehigh.edu')) {
      setError('');
      onLogin(email);
    } else {
      setError('Please use a valid @lehigh.edu email address.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lehigh-light-gold">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
           <svg className="w-16 h-16 mx-auto text-lehigh-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
          <h1 className="mt-4 text-3xl font-bold text-lehigh-brown">VoiceIt Lehigh</h1>
          <p className="mt-2 text-gray-600">Anonymous feedback for the Lehigh community.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-lehigh-gold focus:border-lehigh-gold focus:z-10 sm:text-sm"
              placeholder="Your @lehigh.edu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-lehigh-brown hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lehigh-brown transition-colors"
            >
              Sign In with Lehigh Email
            </button>
          </div>
          <p className="text-xs text-center text-gray-500">
            This is a simulated sign-in. Your email is only used for access verification.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
