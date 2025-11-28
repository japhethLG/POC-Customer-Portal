'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Booking } from '@/types';
import { apiClient } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    checkAuth();
    fetchBookings();
    
    // Check for success message from URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('deleted') === 'true') {
      setSuccessMessage('Booking deleted successfully');
      // Clear the URL parameter
      window.history.replaceState({}, '', '/dashboard');
      // Clear message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, []);

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/login');
      }
    }
  };

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getBookings();
      
      if (response.success) {
        // Transform backend data to frontend format
        const transformed = response.data.map((job: any) => {
          const date = job.scheduledDate ? new Date(job.scheduledDate) : new Date();
          const day = date.getDate().toString().padStart(2, '0');
          const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
          
          return {
            id: job.id,
            ref: job.jobNumber || `#${job.servicem8Uuid?.substring(0, 8)}`,
            title: job.description || 'Service Booking',
            status: job.status || 'Scheduled',
            dateDisplay: { day, month },
            fullDate: date.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }),
            address: job.address || 'N/A',
            technician: { 
              name: job.contactName || 'Technician', 
              avatar: '' 
            },
            type: job.description || 'Service',
            attachments: []
          };
        });
        
        setBookings(transformed);
      }
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      setError(error.message || 'Failed to fetch bookings');
      if (error.message.includes('Invalid or expired token')) {
        localStorage.removeItem('auth_token');
        router.push('/login');
      }
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
      // Logout locally even if API call fails
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
        <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-10">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <p className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">My Bookings</p>
            <div className="flex gap-3">
              <button 
                onClick={() => router.push('/create-job')}
                className="flex items-center justify-center gap-2 cursor-pointer rounded-lg h-10 px-4 bg-primary-dark hover:bg-primary-dark/90 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors"
              >
                <span className="material-symbols-outlined !text-xl">add</span>
                <span className="truncate">Create Job</span>
              </button>
              <button 
                onClick={fetchBookings}
                className="flex items-center justify-center gap-2 cursor-pointer rounded-lg h-10 px-4 bg-slate-200/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="material-symbols-outlined !text-xl">refresh</span>
                <span className="truncate">Refresh</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">check_circle</span>
              {successMessage}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500 dark:text-slate-400 text-lg">No bookings found</p>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
                Your bookings will appear here once they are created
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {bookings.map((booking) => {
                let dateBgClass = "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300";
                let badgeClass = "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300";
                
                if (booking.status === 'In Progress') {
                  dateBgClass = "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400";
                  badgeClass = "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300";
                } else if (booking.status === 'Complete') {
                  dateBgClass = "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400";
                  badgeClass = "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300";
                }

                return (
                  <div 
                    key={booking.id}
                    onClick={() => router.push(`/booking/${booking.id}`)}
                    className="flex gap-4 sm:gap-6 bg-white dark:bg-slate-900/50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                  >
                    <div className={`flex flex-col items-center justify-center rounded-lg w-16 h-16 shrink-0 ${dateBgClass}`}>
                      <span className="text-2xl font-bold">{booking.dateDisplay.day}</span>
                      <span className="text-xs font-bold uppercase tracking-wider">{booking.dateDisplay.month}</span>
                    </div>
                    <div className="flex flex-1 flex-col justify-center gap-1">
                      <div className="flex items-center gap-2">
                        <p className="text-slate-800 dark:text-white text-base font-bold leading-normal">{booking.title}</p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeClass}`}>{booking.status}</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">REF: {booking.ref}</p>
                    </div>
                    <div className="shrink-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">chevron_right</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

