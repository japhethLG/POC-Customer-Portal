'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';

export default function CreateJobPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    job_address: '',
    job_description: '',
    scheduled_date: '',
    status: 'Quote',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/login');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!formData.job_address || !formData.job_description) {
      setError('Address and description are required');
      setIsLoading(false);
      return;
    }

    try {
      const jobData = {
        job_address: formData.job_address,
        job_description: formData.job_description,
        scheduled_date: formData.scheduled_date 
          ? new Date(formData.scheduled_date).toISOString() 
          : undefined,
        status: formData.status,
      };

      const response = await apiClient.createJob(jobData);

      if (response.success) {
        router.push('/dashboard');
      } else {
        setError('Failed to create job');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('Create job error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('auth_token');
      router.push('/login');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display">
      <header className="sticky top-0 z-10 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 text-slate-800 dark:text-white">
            <div className="size-6 text-[#0d8282]">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_6_543)">
                  <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor" />
                  <path clipRule="evenodd" d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z" fill="currentColor" fillRule="evenodd" />
                </g>
                <defs>
                  <clipPath id="clip0_6_543"><rect fill="white" height="48" width="48" /></clipPath>
                </defs>
              </svg>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Modern Utility</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8 items-center">
            <Link
              href="/dashboard"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-dark dark:hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-dark dark:hover:text-primary transition-colors"
            >
              Logout
            </button>
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDSRF_vctYPZBl24D1z3TdeX1tbR7tLUoO55TMve_4ZBGGhNex8wZq95Nm3DNLnpxRswmw6XfmItpkB4Z-vT2ao0PnxY8zlxZu5P88Exms_2ID-LxWXVsz4eKwsA21KoNsJudDwhxGFPoE6ugL4NKUiKOADQWiX1_tBJt_fsNfyYPqv6B_EF_bgXcEhTWrA1jOZ4ilh4EOfaPWoLGQV8J7R8C2RR5DOWW60YcyS0uXRrFaE3v8zm-TcPDxX9fGnyeS8w_BU1AhDkg")' }} />
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <div className="px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto py-10">
          <div className="mb-8">
            <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] mb-2">
              Create New Job
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base">
              Request a new service booking
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 space-y-6">
            <div>
              <label className="block text-slate-800 dark:text-white text-sm font-medium mb-2">
                Service Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="job_address"
                value={formData.job_address}
                onChange={handleChange}
                placeholder="123 Main St, City, State, ZIP"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-dark"
              />
            </div>

            <div>
              <label className="block text-slate-800 dark:text-white text-sm font-medium mb-2">
                Service Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="job_description"
                value={formData.job_description}
                onChange={handleChange}
                placeholder="Describe the service you need..."
                required
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-dark"
              />
            </div>

            <div>
              <label className="block text-slate-800 dark:text-white text-sm font-medium mb-2">
                Preferred Date & Time
              </label>
              <input
                type="datetime-local"
                name="scheduled_date"
                value={formData.scheduled_date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-dark"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Leave empty if you don't have a preferred time
              </p>
            </div>

            <div>
              <label className="block text-slate-800 dark:text-white text-sm font-medium mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-dark"
              >
                <option value="Quote">Quote</option>
                <option value="Work Order">Work Order</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary-dark hover:bg-primary-dark/90 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Job...' : 'Create Job'}
              </button>
              <Link
                href="/dashboard"
                className="flex-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold py-3 px-6 rounded-lg transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

