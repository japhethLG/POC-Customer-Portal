import { Booking } from '@/types';

export const mockBookings: Booking[] = [
  {
    id: '12345',
    ref: '#A8B2-C5D1',
    title: 'Annual Boiler Service',
    status: 'Scheduled',
    dateDisplay: { day: '15', month: 'NOV' },
    fullDate: 'November 15, 2023',
    address: '123 Main Street, Anytown, USA 12345',
    technician: { name: 'Sarah Smith', avatar: '' },
    type: 'Maintenance',
    attachments: []
  },
  {
    id: '67890',
    ref: '#F4G5-H9I2',
    title: 'Quarterly Maintenance Check',
    status: 'In Progress',
    dateDisplay: { day: '08', month: 'NOV' },
    fullDate: 'October 26, 2023 at 2:00 PM',
    address: '123 Main Street, Anytown, USA 12345',
    technician: { 
      name: 'John Doe', 
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhi6A9QJo_Ukj9vpyqX1SEbiIM5QwiZbvrwD7NSvDaDvQLq8evqou3S8CoRZ0loDNUjzRkKjMtDz3Dyo7hANsNYx8GinMql1fc3gevLEmJjnAd7kevZSwYipBg8-hdj4L742WCokG-rQPOe9XiEOjPFx7bv6BgRMY3cSqFhG1af9q22O-3BEwGL7QzEILK31MP9tLB0DnhL8YGywtx5pW6xDwu8UZEpfQsSLNf4gygNtQmHmZr6tXa_7esMFJGJQycGcVEsweaag' 
    },
    type: 'Annual HVAC Maintenance',
    attachments: [
      { name: 'HVAC_Schematic.pdf', type: 'pdf' },
      { 
        name: 'worksite_photo.jpg', 
        type: 'image', 
        thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0B1txdVqj56OZ_HPkthDhiCEI49gaUb9Rxo8NDbhhdz2N6mnK9HNDBTSavyYZ7UJANBEhz_US6yvmJaYj4cCHUIzT4tf06N78q-X_gRZuYnWQum0-W_Vkib6E82H--vfAR9iaXPN0_WiwqoUb85dcTQwjP35K0wE8CduY0SORj7c6Qz_e6wKjnZ6FqhQrNj12eD8kHknKoGethtqLGWXEkH5BGlJm3rf2cufp8zR7m1-lvfNZnLFijQJjafd63BJ6vDdOWRDmwg' 
      },
      { 
        name: 'invoice_12345.png', 
        type: 'image', 
        thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnp14A2tT7OsiAaQYhGivHI-DX4HtwPT-dJTi5BJMtQvIAr3pzAiP2l-_jse01BJdE8qjS691FDeJsWCB-4AjtPiW07KPu0f0eOv-oTKdBLk_mvfk1mWhYXtxAqkocMwIp82uRXNbWoLxACt4SxhiGYjzDBByoH3IH4xyHa8l2XHMWj3i4-5Uwmf5NxpS9bnvm8Qy6_On2fg8xyRFsiLp6JD7z005qroskDBemkwAywe4wuD_VGHpxiBcxaqRL2_KTIL-GX5C5qw' 
      }
    ]
  },
  {
    id: '13579',
    ref: '#J1K3-L6M4',
    title: 'Emergency Plumbing Repair',
    status: 'Complete',
    dateDisplay: { day: '25', month: 'OCT' },
    fullDate: 'October 25, 2023',
    address: '123 Main Street, Anytown, USA 12345',
    technician: { name: 'Mike Jones', avatar: '' },
    type: 'Repair',
    attachments: []
  }
];

// Helper function to get booking by ID
export function getBookingById(id: string): Booking | undefined {
  return mockBookings.find(booking => booking.id === id);
}

// Helper function to get all bookings
export function getAllBookings(): Booking[] {
  return mockBookings;
}

