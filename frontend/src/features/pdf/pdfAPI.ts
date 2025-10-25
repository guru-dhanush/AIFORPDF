import { api } from '../../app/api';

export const documentsApi = api.injectEndpoints({
  endpoints: (builder) => ({

    uploadDocument: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('pdf', file);
        return {
          url: '/documents/upload',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Documents'],
    }),

    getDocuments: builder.query({
      query: (limit = 50) => `/documents?limit=${limit}`,
      providesTags: ['Documents'],
    }),

    getDocument: builder.query({
      query: (id) => `/documents/${id}`,
      providesTags: (_result: any, _error: any, id: any) => [{ type: 'Documents', id }],
    }),

    deleteDocument: builder.mutation({
      query: (id) => ({
        url: `/documents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Documents'],
    }),
  }),
});

export const {
  useUploadDocumentMutation,
  useGetDocumentsQuery,
  useGetDocumentQuery,
  useDeleteDocumentMutation,
} = documentsApi;
