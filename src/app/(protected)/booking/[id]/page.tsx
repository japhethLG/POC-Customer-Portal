'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Booking } from '@/types';
import ChatInterface from '@/components/ChatInterface';
import { apiClient } from '@/lib/api';

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
    fetchBooking();
  }, [id]);

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/login');
      }
    }
  };

  const fetchBooking = async () => {
    try {
      const response = await apiClient.getBookingById(id);
      
      if (response.success) {
        const job = response.data;
        const date = job.scheduledDate ? new Date(job.scheduledDate) : new Date();
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        
        const transformed: Booking = {
          id: job.id,
          ref: job.jobNumber || `#${job.servicem8Uuid?.substring(0, 8)}`,
          title: job.description || 'Service Booking',
          status: job.status || 'Scheduled',
          dateDisplay: { day, month },
          fullDate: date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          address: job.address || 'N/A',
          technician: { 
            name: job.contactName || 'Technician', 
            avatar: '' 
          },
          type: job.description || 'Service',
          attachments: (job.attachments || []).map((att: any) => ({
            name: att.fileName || 'Attachment',
            type: att.fileType?.includes('image') ? 'image' : 'pdf',
            thumbnailUrl: att.thumbnailUrl
          }))
        };
        
        setBooking(transformed);
      } else {
        setError('Booking not found');
      }
    } catch (err: any) {
      console.error('Error fetching booking:', err);
      setError(err.message || 'Failed to load booking');
      if (err.message.includes('Invalid or expired token')) {
        localStorage.removeItem('auth_token');
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-background-light dark:bg-background-dark">
        <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error || 'Booking not found'}</p>
        <Link href="/dashboard" className="text-primary-dark hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-text-dark dark:text-text-light">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light bg-white dark:bg-background-dark dark:border-gray-800 px-4 sm:px-10 lg:px-20 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-4 text-[#111818] dark:text-white">
          <Link href="/dashboard" className="size-6 text-teal-accent hover:opacity-80 transition-opacity">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor" />
            </svg>
          </Link>
          <h2 className="text-[#111818] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Customer Portal</h2>
        </div>
        
        <div className="hidden md:flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <a href="#" className="text-[#111818] dark:text-white text-sm font-medium leading-normal hover:text-teal-accent transition-colors">Dashboard</a>
            <Link href="/dashboard" className="text-teal-accent text-sm font-bold leading-normal">Bookings</Link>
            <a href="#" className="text-[#111818] dark:text-white text-sm font-medium leading-normal hover:text-teal-accent transition-colors">Profile</a>
            <a href="#" className="text-[#111818] dark:text-white text-sm font-medium leading-normal hover:text-teal-accent transition-colors">Support</a>
          </div>
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-[#111818] text-sm font-bold leading-normal tracking-[0.015em] hover:brightness-95 transition-all">
            <span className="truncate">New Booking</span>
          </button>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBNiLycRoYDmSNeGkq9OrpOzjhdmVso0qqb7_wkh2DF4RRtxa78W9aiHlZmyA64E84NmcFXjcLX19xPJvciPHtAtrSMDdj2Cwmg6EjPbMefCJibxgVtytXzre_nh_uQQevKTUfn37NLfLFpxqQauKJr1RHvULsuEoSgPLujIGdl7jGhy1aDKSu6cuv_-U2tnbLSmCSGgrr3zlL8WE9zObj5Z4VXw42HDCln8z9cyhubUzL8FprkOJw7ZjtZD42CRNU0CKYJuywWpA")' }} />
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex flex-col gap-1">
              <p className="text-[#111818] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Booking {booking.id}</p>
              <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Here are the details for your upcoming service.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Panel: Job Info */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white dark:bg-background-dark/80 rounded-xl shadow-sm p-6 space-y-6 border border-border-light dark:border-gray-800">
                <div>
                  <div className={`py-2 px-4 rounded-lg inline-block text-sm font-bold ${
                    booking.status === 'In Progress' 
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                      : 'bg-teal-accent/20 text-teal-accent'
                  }`}>
                    Status: {booking.status}
                  </div>
                </div>

                <div className="space-y-4 border-t border-b border-border-light dark:border-gray-800 py-6">
                  {/* Service Address */}
                  <div className="flex items-center gap-4 min-h-[72px]">
                    <div className="text-teal-accent flex items-center justify-center rounded-lg bg-neutral-secondary dark:bg-gray-800 shrink-0 size-12">
                      <span className="material-symbols-outlined">location_on</span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-[#111818] dark:text-white text-base font-medium leading-normal line-clamp-1">Service Address</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal line-clamp-2">{booking.address}</p>
                    </div>
                  </div>

                  {/* Technician */}
                  <div className="flex items-center gap-4 min-h-[72px]">
                    {booking.technician.avatar ? (
                         <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12" style={{ backgroundImage: `url("${booking.technician.avatar}")` }} />
                    ) : (
                        <div className="flex items-center justify-center rounded-full size-12 bg-gray-200 dark:bg-gray-700 text-gray-500">
                            <span className="material-symbols-outlined">person</span>
                        </div>
                    )}
                   
                    <div className="flex flex-col justify-center">
                      <p className="text-[#111818] dark:text-white text-base font-medium leading-normal line-clamp-1">Assigned Technician</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal line-clamp-2">{booking.technician.name}</p>
                    </div>
                  </div>

                  {/* Date Time */}
                  <div className="flex items-center gap-4 min-h-[72px]">
                    <div className="text-teal-accent flex items-center justify-center rounded-lg bg-neutral-secondary dark:bg-gray-800 shrink-0 size-12">
                      <span className="material-symbols-outlined">calendar_month</span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-[#111818] dark:text-white text-base font-medium leading-normal line-clamp-1">Scheduled Date & Time</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal line-clamp-2">{booking.fullDate}</p>
                    </div>
                  </div>

                  {/* Service Type */}
                  <div className="flex items-center gap-4 min-h-[72px]">
                    <div className="text-teal-accent flex items-center justify-center rounded-lg bg-neutral-secondary dark:bg-gray-800 shrink-0 size-12">
                      <span className="material-symbols-outlined">design_services</span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-[#111818] dark:text-white text-base font-medium leading-normal line-clamp-1">Service Type</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal line-clamp-2">{booking.type}</p>
                    </div>
                  </div>
                </div>

                {/* Attachments */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Attachments</h3>
                  {booking.attachments.length > 0 ? (
                    <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                        {booking.attachments.map((att, i) => (
                            <div className="shrink-0" key={i}>
                                <div 
                                    className="w-28 h-20 bg-center bg-cover rounded-lg bg-neutral-secondary dark:bg-gray-800 flex items-center justify-center text-gray-500 border border-border-light dark:border-gray-700" 
                                    style={att.thumbnailUrl ? { backgroundImage: `url("${att.thumbnailUrl}")` } : {}}
                                >
                                    {!att.thumbnailUrl && (
                                        <span className="material-symbols-outlined text-4xl text-gray-400">description</span>
                                    )}
                                </div>
                                <p className="text-xs text-center mt-1 text-gray-500 dark:text-gray-400 truncate w-28">{att.name}</p>
                            </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No attachments for this booking.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel: Chat Interface */}
            <div className="lg:col-span-7">
              <ChatInterface booking={booking} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

