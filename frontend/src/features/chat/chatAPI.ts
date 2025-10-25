import { api } from '../../app/api';

export const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: ({ documentId, message, chatHistory }) => ({
        url: '/chat',
        method: 'POST',
        body: {
          documentId,
          message,
          chatHistory: chatHistory || [],
        },
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useSendMessageMutation } = chatApi;
