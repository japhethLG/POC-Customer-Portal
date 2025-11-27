'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Check if already logged in
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        router.push('/dashboard');
      }
    }
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!formData.email && !formData.phone) {
      setError('Please provide either an email or phone number');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registrationData } = formData;
      const data = await apiClient.register(registrationData);

      if (data.success) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError('Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('Registration error:', err);
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
                  Create Account
                </h1>
                
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                <form className="flex flex-col gap-4" onSubmit={handleRegister}>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex flex-col">
                      <p className="text-[#111818] dark:text-gray-300 text-sm font-medium leading-normal pb-2">
                        First Name
                      </p>
                      <input
                        className="form-input flex w-full resize-none overflow-hidden rounded-lg text-[#111818] dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-3 text-base font-normal leading-normal"
                        placeholder="First name"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </label>
                    <label className="flex flex-col">
                      <p className="text-[#111818] dark:text-gray-300 text-sm font-medium leading-normal pb-2">
                        Last Name
                      </p>
                      <input
                        className="form-input flex w-full resize-none overflow-hidden rounded-lg text-[#111818] dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-3 text-base font-normal leading-normal"
                        placeholder="Last name"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </label>
                  </div>

                  <label className="flex flex-col flex-1">
                    <p className="text-[#111818] dark:text-gray-300 text-sm font-medium leading-normal pb-2">
                      Email Address <span className="text-gray-400 text-xs">(Email or Phone required)</span>
                    </p>
                    <input
                      className="form-input flex w-full resize-none overflow-hidden rounded-lg text-[#111818] dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-3 text-base font-normal leading-normal"
                      placeholder="your.email@example.com"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="flex flex-col flex-1">
                    <p className="text-[#111818] dark:text-gray-300 text-sm font-medium leading-normal pb-2">
                      Phone Number <span className="text-gray-400 text-xs">(Email or Phone required)</span>
                    </p>
                    <input
                      className="form-input flex w-full resize-none overflow-hidden rounded-lg text-[#111818] dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-3 text-base font-normal leading-normal"
                      placeholder="+1234567890"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="flex flex-col flex-1">
                    <p className="text-[#111818] dark:text-gray-300 text-sm font-medium leading-normal pb-2">
                      Address (Optional)
                    </p>
                    <input
                      className="form-input flex w-full resize-none overflow-hidden rounded-lg text-[#111818] dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-3 text-base font-normal leading-normal"
                      placeholder="123 Main St, City, State"
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="flex flex-col flex-1">
                    <p className="text-[#111818] dark:text-gray-300 text-sm font-medium leading-normal pb-2">
                      Password <span className="text-gray-400 text-xs">(Min 6 characters)</span>
                    </p>
                    <input
                      className="form-input flex w-full resize-none overflow-hidden rounded-lg text-[#111818] dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-3 text-base font-normal leading-normal"
                      placeholder="Enter your password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label className="flex flex-col flex-1">
                    <p className="text-[#111818] dark:text-gray-300 text-sm font-medium leading-normal pb-2">
                      Confirm Password
                    </p>
                    <input
                      className="form-input flex w-full resize-none overflow-hidden rounded-lg text-[#111818] dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-primary h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-3 text-base font-normal leading-normal"
                      placeholder="Confirm your password"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <div className="flex pt-2">
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary-dark text-white text-base font-bold leading-normal tracking-wide hover:bg-primary-dark/90 focus:outline-none focus:ring-4 focus:ring-primary/30 transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="truncate">
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-dark dark:text-primary font-medium hover:underline">
                  Login here
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

