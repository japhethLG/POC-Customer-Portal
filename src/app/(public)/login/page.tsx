'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if already logged in
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        router.push('/dashboard');
      }
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const credentials = loginType === 'email' 
        ? { email, password }
        : { phone, password };
      
      const data = await apiClient.login(credentials);

      if (data.success) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError('Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuDJb8sDwX0frXd4ZEgKGMSpVrsFRf08oStvM3n6FfDeGpBrvOYti-faLFmF1oPt23aDqMxIZhhLc7k1bC9kuUHBXXnEDBGdbH30J3L3-wXDZgFQpcKf2VU5bUjIGo5RyaFyr0Dm-VTHLLzpn7XqpDlalJEpLkCZ31PeTPM8bx7O5pjGmBdqbHRF4-afhRmNsp-crt97SfSfs7s5x0QE8fnU5xB_F0rxs9BUsAGXnKolinn3YZTRM2ROu1ZN9YJJbn_Na4u-e1O4aQ')] bg-cover bg-center">
      <div className="flex h-full grow flex-col">
        <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="flex w-full max-w-md flex-col items-center gap-8 py-8">
            <div className="w-full rounded-xl bg-white dark:bg-gray-900/80 dark:backdrop-blur-md shadow-2xl shadow-gray-300/20 dark:shadow-black/20 border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex flex-col gap-6 p-8 sm:p-10">
                <div className="flex justify-center">
                  <svg
                    className="h-10 w-auto text-primary-dark dark:text-primary"
                    fill="none"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 3.10789C10.0219 3.10789 5.10526 8.02456 5.10526 14.0026V25.2632C5.10526 26.3132 5.68421 27.2368 6.57895 27.7618L8.21053 28.6855C9.44737 29.4197 10.9737 28.5921 10.9737 27.1684V18.1579C10.9737 17.5803 11.4211 17.1329 12 17.1329H20C20.5789 17.1329 21.0263 17.5803 21.0263 18.1579V27.1684C21.0263 28.5921 22.5526 29.4197 23.7895 28.6855L25.4211 27.7618C26.3158 27.2368 26.8947 26.3132 26.8947 25.2632V14.0026C26.8947 8.02456 21.9781 3.10789 16 3.10789ZM16 5.21053C20.8421 5.21053 24.7895 9.15789 24.7895 14.0026V25.2632C24.7895 25.5921 24.5789 25.8684 24.2632 26.0263L22.6316 26.95C22.2105 27.1842 21.7368 26.8158 21.7368 26.3421V18.1579C21.7368 17.1079 20.9737 16.3158 20 16.3158H12C11.0263 16.3158 10.2632 17.1079 10.2632 18.1579V26.3421C10.2632 26.8158 9.78947 27.1842 9.36842 26.95L7.73684 26.0263C7.42105 25.8684 7.21053 25.5921 7.21053 25.2632V14.0026C7.21053 9.15789 11.1579 5.21053 16 5.21053Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h1 className="text-[#111818] dark:text-gray-100 tracking-tight text-2xl sm:text-3xl font-bold text-center">
                  Customer Portal Access
                </h1>
                
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                  {/* Login Type Toggle */}
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setLoginType('email')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        loginType === 'email'
                          ? 'bg-primary-dark text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginType('phone')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        loginType === 'phone'
                          ? 'bg-primary-dark text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Phone
                    </button>
                  </div>

                  {loginType === 'email' ? (
                    <label className="flex flex-col flex-1">
                      <p className="text-[#111818] dark:text-gray-300 text-sm font-medium leading-normal pb-2">
                        Email Address
                      </p>
                      <div className="flex w-full flex-1 items-stretch rounded-lg group">
                        <input
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111818] dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-3 rounded-r-none border-r-0 text-base font-normal leading-normal"
                          placeholder="Enter your email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <div className="text-gray-400 dark:text-gray-500 flex border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 items-center justify-center px-3 rounded-r-lg border-l-0 group-focus-within:border-primary group-focus-within:ring-2 group-focus-within:ring-primary/50">
                          <span className="material-symbols-outlined text-xl">
                            mail
                          </span>
                        </div>
                      </div>
                    </label>
                  ) : (
                    <label className="flex flex-col flex-1">
                      <p className="text-[#111818] dark:text-gray-300 text-sm font-medium leading-normal pb-2">
                        Phone Number
                      </p>
                      <div className="flex w-full flex-1 items-stretch rounded-lg group">
                        <input
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111818] dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-3 rounded-r-none border-r-0 text-base font-normal leading-normal"
                          placeholder="Enter your phone number"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                        <div className="text-gray-400 dark:text-gray-500 flex border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 items-center justify-center px-3 rounded-r-lg border-l-0 group-focus-within:border-primary group-focus-within:ring-2 group-focus-within:ring-primary/50">
                          <span className="material-symbols-outlined text-xl">
                            phone
                          </span>
                        </div>
                      </div>
                    </label>
                  )}

                  <label className="flex flex-col flex-1">
                    <p className="text-[#111818] dark:text-gray-300 text-sm font-medium leading-normal pb-2">
                      Password
                    </p>
                    <div className="flex w-full flex-1 items-stretch rounded-lg group">
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111818] dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-3 rounded-r-none border-r-0 text-base font-normal leading-normal"
                        placeholder="Enter your password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <div className="text-gray-400 dark:text-gray-500 flex border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 items-center justify-center px-3 rounded-r-lg border-l-0 group-focus-within:border-primary group-focus-within:ring-2 group-focus-within:ring-primary/50">
                        <span className="material-symbols-outlined text-xl">
                          lock
                        </span>
                      </div>
                    </div>
                  </label>
                  <div className="flex pt-2">
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary-dark text-white text-base font-bold leading-normal tracking-wide hover:bg-primary-dark/90 focus:outline-none focus:ring-4 focus:ring-primary/30 transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="truncate">
                        {isLoading ? 'Signing In...' : 'Access Portal'}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link href="/register" className="text-primary-dark dark:text-primary font-medium hover:underline">
                  Register here
                </Link>
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-dark dark:hover:text-primary transition-colors">Help</a>
                <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-dark dark:hover:text-primary transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

