import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:3000/api/v1',
    credentials: 'include', // As per requirements for secure cookies
  }),
  tagTypes: ['User', 'Table', 'Booking'],
  endpoints: () => ({}),
});
