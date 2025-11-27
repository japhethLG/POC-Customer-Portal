import { NextRequest, NextResponse } from 'next/server';
import { getAllBookings, getBookingById } from '@/lib/data';
import { ApiResponse, Booking } from '@/types';

// GET /api/bookings - Get all bookings or specific booking by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Get specific booking
      const booking = getBookingById(id);
      
      if (!booking) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: 'Booking not found',
          },
          { status: 404 }
        );
      }

      return NextResponse.json<ApiResponse<Booking>>({
        success: true,
        data: booking,
      });
    }

    // Get all bookings
    const bookings = getAllBookings();
    
    return NextResponse.json<ApiResponse<Booking[]>>({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to fetch bookings',
      },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create new booking (Future: ServiceM8 integration)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Implement booking creation
    // This will integrate with ServiceM8 in the future
    
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Booking creation not yet implemented',
        message: 'This feature will be available with ServiceM8 integration',
      },
      { status: 501 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to create booking',
      },
      { status: 500 }
    );
  }
}

// PUT /api/bookings - Update booking (Future: ServiceM8 integration)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Implement booking update
    // This will integrate with ServiceM8 in the future
    
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Booking update not yet implemented',
        message: 'This feature will be available with ServiceM8 integration',
      },
      { status: 501 }
    );
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to update booking',
      },
      { status: 500 }
    );
  }
}

