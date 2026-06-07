import { api } from './api';
import type { Table } from '../data/Table';

export const tablesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTables: builder.query<Table[], void>({
      query: () => '/tables',
      providesTags: ['Table'],
    }),
    addTable: builder.mutation<Table, Partial<Table>>({
      query: (body) => ({
        url: '/tables',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Table'],
    }),
    updateTable: builder.mutation<Table, { id: number; data: Partial<Table> }>({
      query: ({ id, data }) => ({
        url: `/tables/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Table'],
    }),
    updateTablePosition: builder.mutation<Table, { id: number; x: number; y: number }>({
      query: ({ id, x, y }) => ({
        url: `/tables/${id}/position`,
        method: 'PATCH',
        body: { x, y },
      }),
      // Optimistic update would be better here, but we will just invalidate
      // or rely on local state updates for dragging to avoid flickering.
    }),
    deleteTable: builder.mutation<void, number>({
      query: (id) => ({
        url: `/tables/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Table'],
    }),
  }),
});

export const {
  useGetTablesQuery,
  useAddTableMutation,
  useUpdateTableMutation,
  useUpdateTablePositionMutation,
  useDeleteTableMutation,
} = tablesApi;
