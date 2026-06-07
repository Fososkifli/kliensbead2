import { api } from './api';

export interface Booking {
  id: number;
  tableId: number;
  tableName: string;
  userId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'accepted' | 'declined';
  name: string;
  email: string;
  phone: string;
  headcount: number;
  notes: string;
}

export const bookingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyBookings: builder.query<Booking[], void>({
      query: () => '/bookings/my',
      providesTags: ['Booking'],
    }),
    getAllBookings: builder.query<Booking[], void>({
      query: () => '/bookings',
      providesTags: ['Booking'],
    }),
    createBooking: builder.mutation<Booking, unknown>({
      query: (body) => ({
        url: '/bookings',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Booking'],
    }),
    updateBookingStatus: builder.mutation<Booking, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/bookings/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Booking'],
    }),
  }),
});

export const {
  useGetMyBookingsQuery,
  useGetAllBookingsQuery,
  useCreateBookingMutation,
  useUpdateBookingStatusMutation,
} = bookingsApi;
